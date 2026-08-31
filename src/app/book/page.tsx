import type { Metadata } from 'next'
import BookingForm from '@/components/BookingForm'
import type { SedifexProduct } from '@/lib/sedifex'
import { getSedifexAvailability, getSedifexServices, isSedifexConfigured } from '@/lib/sedifex'

export const metadata: Metadata = {
  title: 'Book',
  description: 'Book an event consultation or service with Gleam Events GH through Sedifex.',
}

type Props = {
  searchParams: Promise<{ serviceId?: string }>
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams
  const [services, slots] = await Promise.all([
    getSedifexServices(),
    getSedifexAvailability(),
  ])
  const connected = isSedifexConfigured()

  const bookableById = new Map<string, SedifexProduct>(services.map(service => [service.id, service]))
  for (const slot of slots) {
    if (!bookableById.has(slot.serviceId)) {
      bookableById.set(slot.serviceId, {
        id: slot.serviceId,
        storeId: slot.storeId,
        name: slot.serviceName || 'Upcoming event',
        description: slot.description || null,
        price: slot.price ?? slot.depositAmount ?? 0,
        itemType: 'service',
        type: 'SERVICE',
        imageUrl: typeof slot.attributes?.imageUrl === 'string' ? slot.attributes.imageUrl : null,
      })
    }
  }
  const bookableServices = Array.from(bookableById.values())

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Book with Gleam</span>
        <h1>Start with the service and time that suits you.</h1>
        <p>
          This form is connected directly to Gleam&apos;s Sedifex workspace. Your request becomes a Sedifex booking so the team can manage follow-up, payment and event planning from the same system.
        </p>
      </section>

      <section className="section section-tint">
        <div className="section-inner booking-shell">
          {connected && bookableServices.length ? (
            <BookingForm services={bookableServices} slots={slots} defaultServiceId={params.serviceId || ''} />
          ) : (
            <article className="card">
              <span className="card-kicker">Sedifex connection</span>
              <h2>Booking setup is ready for the Gleam store credentials.</h2>
              <p>
                Add the Gleam Sedifex store ID and Website Integration API key to the deployment environment. The live services and booking form will then appear here automatically.
              </p>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
