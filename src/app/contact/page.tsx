import type { Metadata } from 'next'
import { sedifexLinks } from '@/config/sedifex'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Gleam Events GH or book an event consultation through Sedifex.',
}

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Let&apos;s talk</span>
        <h1>Tell us what you are planning.</h1>
        <p>
          The fastest way to begin is to book an appointment. Gleam&apos;s appointment scheduling and
          live service catalogue are handled through Sedifex.
        </p>
      </section>

      <section className="section section-tint">
        <div className="section-inner">
          <div className="contact-grid">
            <article className="card">
              <span className="card-kicker">Appointments</span>
              <h3>Choose a convenient time</h3>
              <p>Book directly through Gleam&apos;s Sedifex appointment page.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
                  Book Appointment
                </a>
              </div>
            </article>
            <article className="card">
              <span className="card-kicker">Services</span>
              <h3>Know what you need?</h3>
              <p>View current services and available options on Gleam&apos;s Sedifex catalogue.</p>
              <div className="hero-actions">
                <a className="button button-secondary" href={sedifexLinks.services} target="_blank" rel="noreferrer">
                  View Services
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
