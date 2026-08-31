import type { Metadata } from 'next'
import Link from 'next/link'
import { getSedifexGallery } from '@/lib/sedifex'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected celebrations and event experiences by Gleam Events GH.',
}

const fallbackCategories = [
  ['Weddings & Engagements', 'Elegant celebrations shaped around the couple, family and occasion.'],
  ['Private Celebrations', 'Birthdays, anniversaries and personal milestones planned with thoughtful detail.'],
  ['Corporate Events', 'Professional gatherings, launches and team events coordinated with clarity.'],
]

export default async function PortfolioPage() {
  const gallery = await getSedifexGallery()
  const albums = gallery.albums || []
  const flatImages = gallery.gallery || []

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Our work</span>
        <h1>Events with character, care and a clear point of view.</h1>
        <p>
          This gallery is connected to Sedifex, so Gleam can publish new event albums and images from the Sedifex Website Gallery without changing website code.
        </p>
      </section>

      <section className="section">
        <div className="section-inner">
          {albums.length ? (
            <div className="album-stack">
              {albums.map(album => {
                const images = (album.images || []).filter(image => image.isPublished !== false)
                if (!images.length) return null
                return (
                  <section className="album-section" key={album.id}>
                    <div className="section-heading">
                      <span className="eyebrow">Portfolio album</span>
                      <h2>{album.title}</h2>
                      {album.description ? <p>{album.description}</p> : null}
                    </div>
                    <div className="gallery-grid">
                      {images.map(image => (
                        <figure className="gallery-item" key={image.id}>
                          <div className="gallery-image" style={{ backgroundImage: `url(${image.url})` }} role="img" aria-label={image.alt || image.caption || album.title} />
                          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                        </figure>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : flatImages.length ? (
            <div className="gallery-grid">
              {flatImages.map(image => (
                <figure className="gallery-item" key={image.id}>
                  <div className="gallery-image" style={{ backgroundImage: `url(${image.url})` }} role="img" aria-label={image.alt || image.caption || 'Gleam event'} />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {fallbackCategories.map(([title, text], index) => (
                <article className="card" key={title}>
                  <span className="card-kicker">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          )}

          <div className="hero-actions">
            <Link className="button button-primary" href="/book">Plan an Event With Us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
