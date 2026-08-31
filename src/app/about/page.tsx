import type { Metadata } from 'next'
import { sedifexLinks } from '@/config/sedifex'

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
          Services and appointments are managed through Sedifex, giving clients a straightforward
          way to explore what is available and start planning with us.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={sedifexLinks.services} target="_blank" rel="noreferrer">
            Explore Our Services
          </a>
          <a className="button button-secondary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
            Book an Appointment
          </a>
        </div>
      </section>
    </main>
  )
}
