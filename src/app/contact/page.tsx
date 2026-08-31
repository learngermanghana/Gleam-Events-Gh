import type { Metadata } from 'next'
import Link from 'next/link'
import { getSedifexSocialProfile } from '@/lib/sedifex'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Gleam Events GH or book an event consultation through Sedifex.',
}

function whatsappHref(value?: string | null) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  const digits = value.replace(/[^0-9]/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

function socialHref(value: string | null | undefined, network: 'instagram' | 'tiktok' | 'x') {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  const handle = value.replace(/^@/, '')
  if (!handle) return null
  const base = network === 'instagram' ? 'https://instagram.com/' : network === 'tiktok' ? 'https://tiktok.com/@' : 'https://x.com/'
  return `${base}${handle}`
}

export default async function ContactPage() {
  const profile = await getSedifexSocialProfile()
  const whatsapp = whatsappHref(profile?.whatsappNumber)
  const instagram = socialHref(profile?.instagramHandle, 'instagram')
  const tiktok = socialHref(profile?.tiktokHandle, 'tiktok')
  const x = socialHref(profile?.xHandle, 'x')
  const location = [profile?.addressLine1, profile?.city, profile?.country].filter(Boolean).join(', ')

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Let&apos;s talk</span>
        <h1>Tell us what you are planning.</h1>
        <p>
          Book directly on the Gleam website or use the contact details below. The public contact information is managed from Gleam&apos;s Sedifex Website Builder settings.
        </p>
        <div className="hero-actions hero-actions-center">
          <Link className="button button-primary" href="/book">Book Appointment</Link>
          <Link className="button button-secondary" href="/services">View Services</Link>
        </div>
      </section>

      <section className="section section-tint">
        <div className="section-inner">
          <div className="contact-grid">
            <article className="card">
              <span className="card-kicker">Contact</span>
              <h3>{profile?.displayName || 'Gleam Events GH'}</h3>
              {profile?.tagline ? <p>{profile.tagline}</p> : null}
              <div className="contact-list">
                {profile?.publicPhone ? <a href={`tel:${profile.publicPhone}`}>{profile.publicPhone}</a> : null}
                {profile?.publicEmail ? <a href={`mailto:${profile.publicEmail}`}>{profile.publicEmail}</a> : null}
                {whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                {location ? <span>{location}</span> : null}
                {profile?.openingHours ? <span>{profile.openingHours}</span> : null}
              </div>
            </article>

            <article className="card">
              <span className="card-kicker">Social</span>
              <h3>Follow Gleam</h3>
              <p>See recent work, event inspiration and updates.</p>
              <div className="contact-list">
                {instagram ? <a href={instagram} target="_blank" rel="noreferrer">Instagram</a> : null}
                {profile?.facebookUrl ? <a href={profile.facebookUrl} target="_blank" rel="noreferrer">Facebook</a> : null}
                {tiktok ? <a href={tiktok} target="_blank" rel="noreferrer">TikTok</a> : null}
                {profile?.youtubeUrl ? <a href={profile.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a> : null}
                {x ? <a href={x} target="_blank" rel="noreferrer">X</a> : null}
                {profile?.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a> : null}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
