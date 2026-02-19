/** Core listing record (DB shape). */
export interface ListingDetailPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Schema-driven attribute group for dynamic attributes section. */
export interface AttributeGroup {
  label: string
  fields: { key: string; label: string; value: string | number | boolean }[]
}

/** Media item for hero carousel (image or video). */
export interface ListingMediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail_url?: string
  alt?: string
  order: number
}

/** Seller summary for sidebar. */
export interface ListingSeller {
  id: string
  display_name: string
  avatar_url?: string
  rating_average: number
  rating_count: number
  response_time_hours?: number
  verified: boolean
}

/** Single review. */
export interface ListingReview {
  id: string
  user_id: string
  user_display_name: string
  rating: number
  body?: string
  created_at: string
}

/** Full listing detail payload for the public detail page. */
export interface ListingDetail {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  /** Price as display string (e.g. "29.00") or number. */
  price?: string | number
  currency?: string
  /** Book / Buy / Request Quote */
  listing_type?: 'booking' | 'buy' | 'request_quote'
  verified: boolean
  shipping_available: boolean
  media: ListingMediaItem[]
  attributes: AttributeGroup[]
  seller: ListingSeller
  reviews: ListingReview[]
  review_summary?: {
    average: number
    count: number
  }
  /** For booking-type listings. */
  availability_calendar_enabled?: boolean
}

/** Minimal listing for related/recommendations. */
export interface RelatedListing {
  id: string
  title: string
  price?: string | number
  currency?: string
  thumbnail_url?: string
  verified?: boolean
}

/** Alias for API/hook compatibility. */
export type ListingDetailView = ListingDetail
