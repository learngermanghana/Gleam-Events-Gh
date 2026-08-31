export type SedifexProduct = {
  id: string
  storeId?: string
  name: string
  category?: string | null
  description?: string | null
  price?: number | null
  priceMinor?: number | null
  stockCount?: number | null
  itemType?: string | null
  type?: string | null
  imageUrl?: string | null
  imageUrls?: string[]
  imageAlt?: string | null
}

export type SedifexHeroSlide = {
  id: string
  title: string
  eyebrow?: string | null
  subtitle?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  imageUrl?: string | null
  mobileImageUrl?: string | null
  accent?: string | null
  textColor?: 'light' | 'dark' | null
  overlayStyle?: 'none' | 'dark' | 'light' | 'gradient' | null
  layout?: 'left_text' | 'center_text' | 'right_text' | null
}

export type SedifexGalleryImage = {
  id: string
  albumId?: string | null
  albumTitle?: string | null
  url: string
  alt?: string | null
  caption?: string | null
  isPublished?: boolean
  sortOrder?: number | null
}

export type SedifexGalleryAlbum = {
  id: string
  title: string
  description?: string | null
  coverImageUrl?: string | null
  images?: SedifexGalleryImage[]
}

export type SedifexSocialProfile = {
  displayName?: string | null
  tagline?: string | null
  businessDescription?: string | null
  openingHours?: string | null
  brandColor?: string | null
  logoUrl?: string | null
  coverImageUrl?: string | null
  socialShareImage?: string | null
  publicPhone?: string | null
  whatsappNumber?: string | null
  telegramNumber?: string | null
  publicEmail?: string | null
  addressLine1?: string | null
  city?: string | null
  country?: string | null
  websiteUrl?: string | null
  instagramHandle?: string | null
  facebookUrl?: string | null
  tiktokHandle?: string | null
  youtubeUrl?: string | null
  xHandle?: string | null
  linkedinUrl?: string | null
}

export type SedifexAvailabilitySlot = {
  id: string
  storeId: string
  serviceId: string
  serviceName?: string
  registrationMode?: 'free' | 'paid' | 'deposit' | 'enquiry'
  price?: number | null
  depositAmount?: number | null
  currency?: string | null
  location?: string | null
  description?: string | null
  scheduleStatus: 'scheduled' | 'time_tba' | 'date_tba'
  startAt: string | null
  endAt: string | null
  eventDate: string | null
  displayDateText: string | null
  displayTimeText: string | null
  isDateConfirmed: boolean
  isTimeConfirmed: boolean
  timezone: string
  capacity: number
  seatsBooked: number
  seatsRemaining: number
  status: 'open' | 'closed'
  attributes: Record<string, unknown>
}

type ProductsResponse = {
  products?: SedifexProduct[]
  publicProducts?: SedifexProduct[]
  publicServices?: SedifexProduct[]
}

type GalleryResponse = {
  albums?: SedifexGalleryAlbum[]
  gallery?: SedifexGalleryImage[]
}

type SocialResponse = {
  profile?: SedifexSocialProfile
}

type HeroResponse = {
  slides?: SedifexHeroSlide[]
}

type AvailabilityResponse = {
  slots?: SedifexAvailabilitySlot[]
}

const DEFAULT_BASE_URL = 'https://us-central1-sedifex-web.cloudfunctions.net'
const DEFAULT_CONTRACT_VERSION = '2026-04-13'

function baseUrl() {
  return (process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
}

export function getSedifexStoreId() {
  return process.env.SEDIFEX_BOOKING_TARGET_STORE_ID || process.env.SEDIFEX_STORE_ID || process.env.NEXT_PUBLIC_SEDIFEX_STORE_ID || ''
}

function integrationKey() {
  return (
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_CHECKOUT_API_KEY ||
    process.env.SEDIFEX_PRODUCTS_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    ''
  )
}

function authHeaders(json = false): HeadersInit {
  const key = integrationKey()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Sedifex-Contract-Version': process.env.SEDIFEX_CONTRACT_VERSION || DEFAULT_CONTRACT_VERSION,
  }
  if (key) {
    headers['x-api-key'] = key
    headers.Authorization = `Bearer ${key}`
  }
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

export function isSedifexConfigured() {
  return Boolean(getSedifexStoreId() && integrationKey())
}

async function sedifexGet<T>(path: string, params: Record<string, string | undefined> = {}): Promise<T | null> {
  const storeId = getSedifexStoreId()
  if (!storeId || !integrationKey()) return null

  const query = new URLSearchParams({ storeId })
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value)
  }

  try {
    const response = await fetch(`${baseUrl()}${path}?${query.toString()}`, {
      headers: authHeaders(),
      next: { revalidate: 60 },
    })
    if (!response.ok) {
      console.error('Sedifex GET failed', path, response.status, response.headers.get('x-sedifex-request-id'))
      return null
    }
    return (await response.json()) as T
  } catch (error) {
    console.error('Sedifex GET failed', path, error)
    return null
  }
}

export async function getSedifexServices(): Promise<SedifexProduct[]> {
  const data = await sedifexGet<ProductsResponse>('/v1IntegrationProducts')
  if (!data) return []
  if (Array.isArray(data.publicServices) && data.publicServices.length) return data.publicServices

  const source = Array.isArray(data.products) ? data.products : []
  return source.filter(item => item.itemType?.toLowerCase() === 'service' || item.type?.toUpperCase() === 'SERVICE')
}

export async function getSedifexHeroSlides(): Promise<SedifexHeroSlide[]> {
  const data = await sedifexGet<HeroResponse>('/v1IntegrationHeroSlides', { placement: 'home_hero' })
  return Array.isArray(data?.slides) ? data.slides : []
}

export async function getSedifexGallery(): Promise<GalleryResponse> {
  const data = await sedifexGet<GalleryResponse>('/integrationGallery')
  return {
    albums: Array.isArray(data?.albums) ? data.albums : [],
    gallery: Array.isArray(data?.gallery) ? data.gallery.filter(item => item.isPublished !== false) : [],
  }
}

export async function getSedifexSocialProfile(): Promise<SedifexSocialProfile | null> {
  const data = await sedifexGet<SocialResponse>('/v1IntegrationSocialSettings')
  return data?.profile || null
}

export async function getSedifexAvailability(serviceId?: string): Promise<SedifexAvailabilitySlot[]> {
  const data = await sedifexGet<AvailabilityResponse>('/v1IntegrationAvailability', { serviceId })
  return (Array.isArray(data?.slots) ? data.slots : []).filter(slot => {
    if (slot.status !== 'open') return false
    if (slot.capacity > 0 && slot.seatsRemaining <= 0) return false
    return true
  })
}

export async function createSedifexBooking(payload: Record<string, unknown>) {
  const storeId = getSedifexStoreId()
  if (!storeId || !integrationKey()) throw new Error('Sedifex integration is not configured.')

  const response = await fetch(`${baseUrl()}/v1IntegrationBookings?storeId=${encodeURIComponent(storeId)}`, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  const result = (await response.json()) as Record<string, unknown>
  if (!response.ok) {
    console.error('Sedifex booking failed', response.status, response.headers.get('x-sedifex-request-id'))
    throw new Error(typeof result.message === 'string' ? result.message : 'Could not create booking.')
  }
  return result
}

export async function createSedifexCheckout(payload: Record<string, unknown>) {
  const storeId = getSedifexStoreId()
  if (!storeId || !integrationKey()) throw new Error('Sedifex integration is not configured.')

  const checkoutUrl = process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL || `${baseUrl()}/integrationCheckoutCreate`
  const response = await fetch(checkoutUrl, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ storeId, merchantId: storeId, ...payload }),
    cache: 'no-store',
  })
  const result = (await response.json()) as Record<string, unknown>
  if (!response.ok) {
    console.error('Sedifex checkout failed', response.status, response.headers.get('x-sedifex-request-id'))
    throw new Error(typeof result.message === 'string' ? result.message : 'Could not start checkout.')
  }
  return result
}

export function getSedifexCheckoutReturnUrl() {
  return process.env.SEDIFEX_CHECKOUT_RETURN_URL || ''
}
