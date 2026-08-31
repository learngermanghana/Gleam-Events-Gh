import Link from 'next/link'
import { getSedifexGallery, getSedifexHeroSlides, getSedifexServices } from '@/lib/sedifex'

const fallbackServices = [
  {
    id: 'event-planning',
    title: 'Event Planning',
    text: 'From the first idea to event day, we help organise the details and keep the experience coordinated.',
    category: 'Planning',
  },
  {
    id: 'event-styling',
    title: 'Event Styling',
    text: 'Thoughtful themes, colour direction and visual details designed around the atmosphere you want to create.',
    category: 'Styling',
  },
  {
    id: 'event-coordination',
    title: 'Event Coordination',
    text: 'A clear plan for the people, suppliers and activities that need to come together on the day.',
    category: 'Coordination',
  },
]

export default async function HomePage() {
  const [slides, liveServices, galleryData] = await Promise.all([
    getSedifexHeroSlides(),
    getSedifexServices(),
    getSedifexGallery(),
  ])

  const hero = slides[0]
  const services = liveServices.length
    ? liveServices.slice(0, 3).map(service => ({
        id: service.id,
        title: service.name,
        text: service.description || 'Explore this Gleam Events GH service and choose a suitable booking option.',
        category: service.category || 'Service',
      }))
    : fallbackServices

  const flatGallery = galleryData.gallery?.length
    ? galleryData.gallery
    : (galleryData.albums || []).flatMap(album => album.images || [])
  const gallery = flatGallery.slice(0, 3)

  return (
    <main>
      <section className={`hero ${hero?.imageUrl ? 'hero-connected' : ''}`}>
        <div>
          <span className="eyebrow">{hero?.eyebrow || 'Gleam Events GH'}</span>
          <h1>{hero?.title || 'Moments designed to be remembered.'}</h1>
          <p>
            {hero?.subtitle || 'We plan and coordinate beautiful events with care, clarity and attention to the details that make every celebration feel personal.'}
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={hero?.ctaHref || '/book'}>
              {hero?.ctaLabel || 'Book an Appointment'}
            </a>
            <a className="button button-secondary" href={hero?.secondaryCtaHref || '/services'}>
              {hero?.secondaryCtaLabel || 'Explore Services'}
            </a>
          </div>
        </div>
        {hero?.imageUrl ? (
          <div className="hero-art hero-photo" style={{ backgroundImage: `url(${hero.imageUrl})` }} aria-label={hero.title} />
        ) : (
          <div className="hero-art" aria-label="Gleam Events GH visual placeholder" />
        )}
      </section>

      <section className="section section-tint">
        <div className="section-inner">
          <div className="section-heading">
            <span className="eyebrow">What we do</span>
            <h2>One team for the details that bring an event together.</h2>
            <p>
              These services are loaded from Gleam&apos;s Sedifex catalogue, so updates made in Sedifex can appear here without editing the website.
            </p>
          </div>
          <div className="grid-3">
            {services.map((service, index) => (
              <article className="card" key={service.id}>
                <span className="card-kicker">{service.category || `0${index + 1}`}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="hero-actions">
                  <Link className="text-link" href={`/book?serviceId=${encodeURIComponent(service.id)}`}>Book / Enquire →</Link>
                </div>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/services">View All Services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <span className="eyebrow">Selected celebrations</span>
            <h2>A glimpse of the experiences we create.</h2>
          </div>

          {gallery.length ? (
            <div className="portfolio-grid">
              {gallery.map(image => (
                <div
                  className="portfolio-tile portfolio-photo"
                  key={image.id}
                  style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(33,24,20,.72)), url(${image.url})` }}
                >
                  <span>{image.caption || image.albumTitle || image.alt || 'Gleam event'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="portfolio-grid">
              <div className="portfolio-tile"><span>Weddings & Engagements</span></div>
              <div className="portfolio-tile"><span>Private Celebrations</span></div>
              <div className="portfolio-tile"><span>Corporate Events</span></div>
            </div>
          )}

          <div className="hero-actions">
            <Link className="button button-secondary" href="/portfolio">View Portfolio</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <span className="eyebrow">Start planning</span>
          <h2>Have an event in mind?</h2>
          <p>
            Choose a service and suitable time here on the Gleam website. The booking is saved directly into Sedifex for the team to manage.
          </p>
          <Link className="button button-primary" href="/book">Book Your Appointment</Link>
        </div>
      </section>
    </main>
  )
}
