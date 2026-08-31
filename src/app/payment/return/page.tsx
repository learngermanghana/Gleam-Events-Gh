import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payment Return',
  description: 'Payment verification status for a Gleam Events GH booking.',
}

export default function PaymentReturnPage() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Payment received</span>
        <h1>Your payment is being verified.</h1>
        <p>
          We have received your checkout return. Sedifex will confirm the final payment status before Gleam Events GH treats the booking as paid.
        </p>
        <div className="hero-actions hero-actions-center">
          <Link className="button button-primary" href="/">Return Home</Link>
          <Link className="button button-secondary" href="/contact">Contact Gleam</Link>
        </div>
      </section>
    </main>
  )
}
