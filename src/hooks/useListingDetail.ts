import { useState, useEffect, useCallback } from 'react'
import { fetchListingDetailById, fetchRelatedListingsById } from '@/api/listing-detail'
import type { ListingDetail, RelatedListing } from '@/types/listing-detail'

export interface UseListingDetailResult {
  listing: ListingDetail | null
  related: RelatedListing[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useListingDetail(id: string | undefined): UseListingDetailResult {
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [related, setRelated] = useState<RelatedListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      const [listingRes, relatedRes] = await Promise.all([
        fetchListingDetailById(id),
        fetchRelatedListingsById(id),
      ])
      setListing(listingRes)
      setRelated(relatedRes ?? [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load listing'))
      setListing(null)
      setRelated([])
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { listing, related, isLoading, error, refetch: load }
}
