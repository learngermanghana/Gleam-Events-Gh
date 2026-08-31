import type { Metadata } from 'next'
import Link from 'next/link'
import { getSedifexServices, isSedifexConfigured } from '@/lib/sedifex'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore live Gleam Events GH services managed through Sedifex.',
}

const fallbackServices = [
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Planning support from the first idea through event-day delivery.',
  },
  {
    id: 'event-styling',
    name: 'Event Styling',
    description: 'Themes, colour direction and visual styling shaped around your occasion.',
  },
  {
    id: 'event-coordination',
    name: 'Event Coordination',
    description: 'Clear coordination for suppliers, timelines and the moving parts of event day.',
  },
]

function formatPrice(price?: number | null) {
  if (!Number.isFinite(Number(price)) || Number(price) <= 0) return null
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(Number(price))
}

export default async function ServicesPage() {
  const liveServices = await getSedifexServices()
  const services = liveServices.length ? liveServices : fallbackServices
  const connected = isSedifexConfigured()

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Our services</span>
        <h1>Choose the support your event needs.</h1>
        <p>
          Gleam&apos;s service catalogue is connected directly to Sedifex, so service names, descriptions and prices can be maintained from one place.
        </p>
      </section>

      <section className="section section-tint">
        <div className="section-inner">
          <div className="service-grid">
            {services.map((service) => {
              const price = 'price' in service ? formatPrice(service.price) : null
              const imageUrl = 'imageUrl' in service ? service.imageUrl : null
              return (
                <article className="service-card" key={service.id}>
                  {imageUrl ? (
                    <div className="service-card-image" style={{ backgroundImage: `url(${imageUrl})` }} aria-label={service.name} />
                  ) : (
                    <div className="service-card-image service-card-placeholder" aria-hidden="true">
                      <span>{service.name.slice(0, 1)}</span>
                    </div>
                  )}
                  <div className="service-card-body">
                    <span className="card-kicker">{'category' in service && service.category ? service.category : 'Gleam Events GH'}</span>
                    <h2>{service.name}</h2>
                    <p>{service.description || 'Contact Gleam Events GH for details about this service.'}</p>
                    {price ? <strong className="service-price">{price}</strong> : null}
                    <div className="hero-actions">
                      <Link className="button button-primary" href={`/book?serviceId=${encodeURIComponent(service.id)}`}>
                        Book / Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {!connected ? (
            <p className="integration-note">
              Live Sedifex data will replace the sample service cards as soon as the Gleam store ID and Website Integration API key are added to the deployment environment.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  )
}
