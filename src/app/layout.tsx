import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { sedifexLinks } from '@/config/sedifex'

export const metadata: Metadata = {
  title: {
    default: 'Gleam Events GH',
    template: '%s | Gleam Events GH',
  },
  description:
    'Gleam Events GH creates thoughtfully planned celebrations and events, with booking and client services powered by Sedifex.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <nav className="nav" aria-label="Main navigation">
              <Link className="brand" href="/">
                <span className="brand-mark">G</span>
                <span>Gleam Events GH</span>
              </Link>
              <div className="nav-links">
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <a href={sedifexLinks.services} target="_blank" rel="noreferrer">
                  Services
                </a>
                <a className="button button-primary" href={sedifexLinks.appointments} target="_blank" rel="noreferrer">
                  Book Appointment
                </a>
              </div>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <Link className="brand" href="/">
                  <span className="brand-mark">G</span>
                  <span>Gleam Events GH</span>
                </Link>
                <p>Elegant planning. Thoughtful details. Memorable moments.</p>
              </div>
              <div className="footer-links">
                <Link href="/portfolio">Portfolio</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <a href={sedifexLinks.services} target="_blank" rel="noreferrer">Services</a>
                <a href={sedifexLinks.appointments} target="_blank" rel="noreferrer">Book</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
