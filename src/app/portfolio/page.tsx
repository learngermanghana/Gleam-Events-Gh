import type { Metadata } from 'next'
import { sedifexLinks } from '@/config/sedifex'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected celebrations and event experiences by Gleam Events GH.',
}

const categories = [
  ['Weddings & Engagements', 'Elegant celebrations shaped around the couple, family and occasion.'],
  ['Private Celebrations', 'Birthdays, anniversaries and personal milestones planned with thoughtful detail.'],
  ['Corporate Events', 'Professional gatherings, launches and team events coordinated with clarity.'],
]

export default function PortfolioPage() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Our work</span>
        <h1>Events with character, care and a clear point of view.</h1>
        <p>Real event photography and case studies will live here as Gleam&apos;s portfolio grows.</p>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="grid-3">
            {categories.map(([title, text], index) => (
              <article className="card" key={title}>
                <span className="card-kicker">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
              Plan an Event With Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
