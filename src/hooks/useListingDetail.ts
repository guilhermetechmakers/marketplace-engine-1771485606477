import { useQuery } from '@tanstack/react-query'
import { fetchListingDetailById, fetchRelatedListingsById } from '@/api/listing-detail'
import type { ListingDetail, RelatedListing } from '@/types/listing-detail'

const listingDetailQueryKey = (id: string) => ['listing-detail', id] as const
const relatedListingsQueryKey = (listingId: string) => ['listing-related', listingId] as const

export interface UseListingDetailResult {
  listing: ListingDetail | null
  related: RelatedListing[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useListingDetail(id: string | undefined): UseListingDetailResult {
  const {
    data: listing = null,
    isLoading: listingLoading,
    isError: listingError,
    error: listingErr,
    refetch: refetchListing,
  } = useQuery({
    queryKey: listingDetailQueryKey(id ?? ''),
    queryFn: () => fetchListingDetailById(id!),
    enabled: Boolean(id),
  })

  const {
    data: related = [],
    refetch: refetchRelated,
  } = useQuery({
    queryKey: relatedListingsQueryKey(id ?? ''),
    queryFn: () => fetchRelatedListingsById(id!, 4),
    enabled: Boolean(id),
  })

  const refetch = () => {
    refetchListing()
    refetchRelated()
  }

  return {
    listing: listing ?? null,
    related: related ?? [],
    isLoading: listingLoading,
    isError: listingError,
    error: listingErr instanceof Error ? listingErr : listingErr ? new Error(String(listingErr)) : null,
    refetch,
  }
}
