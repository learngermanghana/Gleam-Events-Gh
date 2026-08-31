# Gleam Events GH

Public website for Gleam Events GH, built with Next.js and connected to Sedifex as the business source of truth.

## Public pages

- `/` — Home
- `/services` — live services from Sedifex
- `/book` — live availability + booking form
- `/portfolio` — gallery albums/images from Sedifex
- `/about` — brand story
- `/contact` — public contact/social profile from Sedifex
- `/payment/return` — safe hosted-checkout return page

## Sedifex integrations

The website uses the Sedifex Website Integration API server-side.

- `GET /v1IntegrationProducts` → Services and service previews
- `GET /v1IntegrationAvailability` → Appointment/event availability
- `POST /v1IntegrationBookings` → Booking records and customer records
- `POST /integrationCheckoutCreate` → Hosted Sedifex/Paystack checkout
- `GET /integrationGallery` → Portfolio albums and images
- `GET /v1IntegrationHeroSlides` → Homepage hero content
- `GET /v1IntegrationSocialSettings` → Contact details, logo, public profile and social links

The Website Integration API key is never exposed to browser code. Add it only as a server-side deployment environment variable.

## Environment setup

Copy `.env.example` to `.env.local` for local development or add the same variables in Vercel.

The important values are:

```env
SEDIFEX_STORE_ID=<gleam_store_id>
SEDIFEX_BOOKING_TARGET_STORE_ID=<gleam_store_id>
NEXT_PUBLIC_SEDIFEX_STORE_ID=<gleam_store_id>
SEDIFEX_INTEGRATION_API_KEY=<website_integration_key>
SEDIFEX_PRODUCTS_API_KEY=<same_key>
SEDIFEX_BOOKING_API_KEY=<same_key>
SEDIFEX_CHECKOUT_API_KEY=<same_key>
SEDIFEX_CHECKOUT_RETURN_URL=https://your-domain.com/payment/return
SEDIFEX_CONTRACT_VERSION=2026-04-13
```

Generate the Website Integration API key from the Gleam store/workspace in Sedifex under the website integration/API-key settings. The store ID and key must belong to the same Sedifex store.

## Local development

```bash
npm install
npm run dev
```

When Sedifex credentials are not configured, the site falls back to curated marketing placeholders instead of exposing or guessing credentials.
