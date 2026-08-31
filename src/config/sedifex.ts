export const sedifexLinks = {
  // Replace these two defaults with Gleam Events GH's exact Sedifex public links.
  // Environment variables let production override them without code changes.
  services:
    process.env.NEXT_PUBLIC_SEDIFEX_SERVICES_URL || 'https://www.sedifex.com',
  appointments:
    process.env.NEXT_PUBLIC_SEDIFEX_APPOINTMENTS_URL || 'https://www.sedifex.com',
} as const
