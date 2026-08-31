import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Gleam Events GH and our approach to planning memorable events.',
}

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">About Gleam</span>
        <h1>Beautiful events begin with thoughtful planning.</h1>
      </section>
      <section className="content-narrow">
        <p>
          Gleam Events GH helps clients turn ideas into well-organised, memorable experiences. We
          believe good event planning is not only about how a space looks, but also how smoothly the
          entire experience comes together.
        </p>
        <p>
          Our approach combines creative direction, clear communication and careful coordination so
          clients can enjoy their celebration while the important details are being managed.
        </p>
        <p>
          Our website connects directly to Sedifex for live services, availability, bookings and
          payment handoff, so clients can begin planning without leaving the Gleam experience.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/services">
            Explore Our Services
          </Link>
          <Link className="button button-secondary" href="/book">
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  )
}
