import { NextResponse } from 'next/server'
import {
  createSedifexBooking,
  createSedifexCheckout,
  getSedifexAvailability,
  getSedifexCheckoutReturnUrl,
  getSedifexServices,
  getSedifexStoreId,
} from '@/lib/sedifex'

function clean(value: unknown, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function scheduledTime(startAt: string | null, timezone: string) {
  if (!startAt) return ''
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone || 'Africa/Accra',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(startAt))
  } catch {
    return ''
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const name = clean(body.name, 160)
    const phone = clean(body.phone, 80)
    const email = clean(body.email, 220).toLowerCase()
    const requestedServiceId = clean(body.serviceId, 240)
    const slotId = clean(body.slotId, 240)
    const notes = clean(body.notes, 5000)

    if (!name || !phone || !email || (!requestedServiceId && !slotId)) {
      return NextResponse.json({ message: 'Name, phone, email and service are required.' }, { status: 400 })
    }

    const [services, slots] = await Promise.all([
      getSedifexServices(),
      getSedifexAvailability(),
    ])

    const selectedSlot = slotId ? slots.find(slot => slot.id === slotId) : undefined
    const resolvedServiceId = selectedSlot?.serviceId || requestedServiceId
    const selectedService = services.find(service => service.id === resolvedServiceId || service.id === requestedServiceId)

    if (!selectedSlot && !selectedService) {
      return NextResponse.json({ message: 'The selected service is no longer available. Please refresh and try again.' }, { status: 400 })
    }

    const serviceName = selectedSlot?.serviceName || selectedService?.name || 'Gleam Events GH service'
    const bookingDate = selectedSlot?.eventDate || selectedSlot?.startAt?.slice(0, 10) || clean(body.bookingDate, 40)
    const bookingTime = selectedSlot?.displayTimeText || scheduledTime(selectedSlot?.startAt || null, selectedSlot?.timezone || 'Africa/Accra') || clean(body.bookingTime, 80) || 'Time to be announced'

    if (!bookingDate && selectedSlot?.scheduleStatus !== 'date_tba') {
      return NextResponse.json({ message: 'Please choose a booking date.' }, { status: 400 })
    }

    let amount = Number(selectedService?.price ?? 0)
    if (selectedSlot) {
      if (selectedSlot.registrationMode === 'free' || selectedSlot.registrationMode === 'enquiry') amount = 0
      else if (selectedSlot.registrationMode === 'deposit') amount = Number(selectedSlot.depositAmount ?? selectedSlot.price ?? amount)
      else if (selectedSlot.price != null) amount = Number(selectedSlot.price)
    }
    if (!Number.isFinite(amount) || amount < 0) amount = 0

    const booking = await createSedifexBooking({
      ...(selectedSlot ? { slotId: selectedSlot.id } : {}),
      serviceId: resolvedServiceId,
      serviceName,
      bookingDate: bookingDate || 'Date to be announced',
      bookingTime,
      quantity: 1,
      notes,
      customer: { name, email, phone },
      paymentMethod: amount > 0 ? 'paystack_checkout' : 'manual',
      paymentAmount: amount,
      sourceChannel: 'client_website',
      attributes: {
        source: selectedSlot ? 'website_availability_booking' : 'website_booking_form',
        sourceLabel: 'Gleam Events GH website',
        pageUrl: clean(request.headers.get('referer'), 1000),
        timezone: selectedSlot?.timezone || 'Africa/Accra',
        locale: 'en-GH',
        scheduleStatus: selectedSlot?.scheduleStatus || 'requested',
      },
    })

    const bookingId = clean(booking.bookingId, 240)
    const reference = clean(booking.reference, 240)

    if (amount <= 0) {
      return NextResponse.json({
        ok: true,
        reference,
        message: 'Your booking request has been sent to Gleam Events GH.',
      })
    }

    try {
      const storeId = getSedifexStoreId()
      const clientOrderId = `BOOKING-${bookingId || reference || Date.now()}`
      const returnUrl = getSedifexCheckoutReturnUrl() || new URL('/payment/return', request.url).toString()
      const checkout = await createSedifexCheckout({
        clientOrderId,
        orderType: 'service',
        sourceChannel: 'client_website',
        sourceLabel: 'Gleam Events GH Website',
        currency: selectedSlot?.currency || 'GHS',
        amount,
        customer: { name, email, phone },
        items: [
          {
            id: resolvedServiceId,
            item_id: resolvedServiceId,
            serviceId: resolvedServiceId,
            name: serviceName,
            serviceName,
            unitPrice: amount,
            price: amount,
            qty: 1,
            quantity: 1,
            type: 'SERVICE',
            item_type: 'service',
            ...(selectedSlot ? { slotId: selectedSlot.id } : {}),
          },
        ],
        returnUrl,
        metadata: {
          bookingId,
          clientOrderId,
          storeId,
          channel: 'client-website',
          ...(selectedSlot ? { slotId: selectedSlot.id } : {}),
        },
      })

      const checkoutUrl = clean(checkout.authorizationUrl, 2000) || clean(checkout.checkoutUrl, 2000)
      if (!checkoutUrl) throw new Error('Sedifex did not return a checkout URL.')

      return NextResponse.json({ ok: true, reference, checkoutUrl })
    } catch (checkoutError) {
      console.error('Gleam checkout creation failed after booking was saved', checkoutError)
      return NextResponse.json({
        ok: true,
        reference,
        message: 'Your booking was saved. Gleam Events GH will contact you to complete payment.',
      })
    }
  } catch (error) {
    console.error('Gleam booking route failed', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Could not submit your booking.' },
      { status: 500 },
    )
  }
}
