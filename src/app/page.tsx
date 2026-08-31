import Link from 'next/link'
import { sedifexLinks } from '@/config/sedifex'

const serviceHighlights = [
  {
    title: 'Event Planning',
    text: 'From the first idea to event day, we help organise the details and keep the experience coordinated.',
  },
  {
    title: 'Event Styling',
    text: 'Thoughtful themes, colour direction and visual details designed around the atmosphere you want to create.',
  },
  {
    title: 'Event Coordination',
    text: 'A clear plan for the people, suppliers and activities that need to come together on the day.',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">Gleam Events GH</span>
          <h1>Moments designed to be remembered.</h1>
          <p>
            We plan and coordinate beautiful events with care, clarity and attention to the details
            that make every celebration feel personal.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
              Book an Appointment
            </a>
            <a className="button button-secondary" href={sedifexLinks.services} target="_blank" rel="noreferrer">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-art" aria-label="Gleam Events GH visual placeholder" />
      </section>

      <section className="section section-tint">
        <div className="section-inner">
          <div className="section-heading">
            <span className="eyebrow">What we do</span>
            <h2>One team for the details that bring an event together.</h2>
            <p>
              Browse a snapshot here, then view Gleam&apos;s live service catalogue on Sedifex for the
              latest available services and booking options.
            </p>
          </div>
          <div className="grid-3">
            {serviceHighlights.map((service, index) => (
              <article className="card" key={service.title}>
                <span className="card-kicker">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href={sedifexLinks.services} target="_blank" rel="noreferrer">
              View All Services on Sedifex
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <span className="eyebrow">Selected celebrations</span>
            <h2>A glimpse of the experiences we create.</h2>
          </div>
          <div className="portfolio-grid">
            <div className="portfolio-tile"><span>Weddings & Engagements</span></div>
            <div className="portfolio-tile"><span>Private Celebrations</span></div>
            <div className="portfolio-tile"><span>Corporate Events</span></div>
          </div>
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
            Choose a convenient appointment time and tell us what you are planning. Booking is handled securely through Sedifex.
          </p>
          <a className="button button-primary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
            Book Your Appointment
          </a>
        </div>
      </section>
    </main>
  )
}
