/**
 * API for listing detail page: fetch single listing (extended view) and related listings.
 * Uses native fetch via src/lib/api.ts.
 */

import { apiGet } from '@/lib/api'
import type { ListingDetail, RelatedListing } from '@/types/listing-detail'

export async function fetchListingDetailById(id: string): Promise<ListingDetail> {
  return apiGet<ListingDetail>(`/listings/${id}`)
}

export async function fetchRelatedListingsById(listingId: string, limit = 4): Promise<RelatedListing[]> {
  const data = await apiGet<RelatedListing[]>(`/listings/${listingId}/related?limit=${limit}`)
  return data ?? []
}
