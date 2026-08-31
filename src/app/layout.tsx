import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { getSedifexSocialProfile } from '@/lib/sedifex'

export const metadata: Metadata = {
  title: {
    default: 'Gleam Events GH',
    template: '%s | Gleam Events GH',
  },
  description:
    'Gleam Events GH creates thoughtfully planned celebrations and events, with services, bookings and client operations powered by Sedifex.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getSedifexSocialProfile()
  const brandName = profile?.displayName || 'Gleam Events GH'

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <nav className="nav" aria-label="Main navigation">
              <Link className="brand" href="/">
                <span className="brand-mark">G</span>
                <span>{brandName}</span>
              </Link>
              <div className="nav-links">
                <Link href="/services">Services</Link>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link className="button button-primary" href="/book">Book Appointment</Link>
              </div>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <Link className="brand" href="/">
                  <span className="brand-mark">G</span>
                  <span>{brandName}</span>
                </Link>
                <p>{profile?.tagline || 'Elegant planning. Thoughtful details. Memorable moments.'}</p>
                {profile?.publicEmail ? <a className="footer-contact" href={`mailto:${profile.publicEmail}`}>{profile.publicEmail}</a> : null}
                {profile?.publicPhone ? <a className="footer-contact" href={`tel:${profile.publicPhone}`}>{profile.publicPhone}</a> : null}
              </div>
              <div className="footer-links">
                <Link href="/services">Services</Link>
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/book">Book</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
