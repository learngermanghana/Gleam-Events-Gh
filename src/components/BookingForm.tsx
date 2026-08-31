'use client'

import { FormEvent, useMemo, useState } from 'react'
import type { SedifexAvailabilitySlot, SedifexProduct } from '@/lib/sedifex'

type Props = {
  services: SedifexProduct[]
  slots: SedifexAvailabilitySlot[]
  defaultServiceId?: string
}

type BookingResult = {
  ok?: boolean
  message?: string
  reference?: string
  checkoutUrl?: string
}

export default function BookingForm({ services, slots, defaultServiceId = '' }: Props) {
  const [serviceId, setServiceId] = useState(defaultServiceId)
  const [slotId, setSlotId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BookingResult | null>(null)

  const filteredSlots = useMemo(
    () => slots.filter(slot => serviceId && slot.serviceId === serviceId),
    [slots, serviceId],
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    setLoading(true)
    setResult(null)

    const form = new FormData(formElement)
    const payload = Object.fromEntries(form.entries())

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as BookingResult
      if (!response.ok) throw new Error(data.message || 'Could not submit your booking.')

      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl)
        return
      }

      setResult(data)
      formElement.reset()
      setServiceId('')
      setSlotId('')
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : 'Could not submit your booking.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>Phone / WhatsApp</span>
          <input name="phone" required autoComplete="tel" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Service</span>
          <select name="serviceId" value={serviceId} onChange={event => { setServiceId(event.target.value); setSlotId('') }} required>
            <option value="">Choose a service</option>
            {services.map(service => (
              <option value={service.id} key={service.id}>{service.name}</option>
            ))}
          </select>
        </label>

        {serviceId && filteredSlots.length ? (
          <label className="form-full">
            <span>Available time / event</span>
            <select name="slotId" value={slotId} onChange={event => setSlotId(event.target.value)}>
              <option value="">Choose an available slot</option>
              {filteredSlots.map(slot => {
                const date = slot.displayDateText || slot.eventDate || 'Date to be announced'
                const time = slot.displayTimeText || (slot.startAt ? new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time to be announced')
                return (
                  <option value={slot.id} key={slot.id}>
                    {slot.serviceName || 'Event'} — {date} — {time}{slot.location ? ` — ${slot.location}` : ''}
                  </option>
                )
              })}
            </select>
          </label>
        ) : serviceId ? (
          <>
            <label>
              <span>Preferred date</span>
              <input name="bookingDate" type="date" required />
            </label>
            <label>
              <span>Preferred time</span>
              <input name="bookingTime" type="time" required />
            </label>
          </>
        ) : null}

        <label className="form-full">
          <span>Tell us about your event</span>
          <textarea name="notes" rows={5} placeholder="Event type, venue, guest count, colours/theme, or anything else we should know." />
        </label>
      </div>

      <button className="button button-primary" type="submit" disabled={loading}>
        {loading ? 'Submitting…' : 'Continue with Booking'}
      </button>

      {result?.message ? (
        <div className={result.ok ? 'form-message success' : 'form-message error'}>
          {result.message}{result.reference ? ` Reference: ${result.reference}.` : ''}
        </div>
      ) : null}
    </form>
  )
}
