import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  HeroMediaCarousel,
  ListingSummaryCard,
  DynamicAttributes,
  AvailabilityBookingCalendar,
  SellerSidebar,
  MessagingThreadAccess,
  ReviewsSection,
  RelatedListingsRecommendations,
} from '@/components/listing-detail-page'
import { useListingDetail } from '@/hooks/useListingDetail'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, related, isLoading: loading, error: err } = useListingDetail(id)
  const error = err?.message ?? null

  useEffect(() => {
    if (listing?.title) {
      const prev = document.title
      document.title = `${listing.title} | Marketplace`
      return () => { document.title = prev }
    }
  }, [listing?.title])

  if (!id) {
    return (
      <div className="container-tight py-8">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No listing selected.</p>
            <Button asChild className="mt-4">
              <Link to="/search">Browse listings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container-tight py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container-tight py-8">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mt-2 text-center text-muted-foreground">
              {error ?? 'This listing could not be loaded.'}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/search">Back to search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const listingType =
    listing.listing_type === 'booking'
      ? 'book'
      : listing.listing_type === 'request_quote'
        ? 'request_quote'
        : 'buy'

  return (
    <div className="container-tight py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="animate-fade-in" aria-label="Listing media">
            <HeroMediaCarousel
              media={listing.media}
              title={listing.title}
            />
          </section>

          <section className="animate-fade-in" aria-label="Listing details">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                {listing.description && (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <h3 className="text-lg font-semibold text-foreground">Description</h3>
                    <p className="mt-2 text-muted-foreground">{listing.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="animate-fade-in" aria-label="Attributes">
            <DynamicAttributes attributeGroups={listing.attributes} />
          </section>

          {listing.availability_calendar_enabled && (
            <section className="animate-fade-in" aria-label="Availability">
              <AvailabilityBookingCalendar
                enabled={listing.availability_calendar_enabled}
                listingId={listing.id}
              />
            </section>
          )}

          <section className="animate-fade-in" aria-label="Reviews">
            <ReviewsSection
              listingId={listing.id}
              reviews={listing.reviews}
              averageRating={listing.review_summary?.average ?? listing.seller.rating_average}
              totalCount={listing.review_summary?.count ?? listing.seller.rating_count}
              canWriteReview={false}
            />
          </section>
        </div>

        <div className="space-y-6">
          <ListingSummaryCard
            title={listing.title}
            price={listing.price}
            currency={listing.currency}
            listingId={listing.id}
            verified={listing.verified}
            shippingAvailable={listing.shipping_available}
            listingType={listingType}
          />

          <SellerSidebar seller={listing.seller} />

          <MessagingThreadAccess
            listingId={listing.id}
            sellerId={listing.seller.id}
            listingTitle={listing.title}
            existingThreadId={null}
          />
        </div>
      </div>

      <section className="mt-12 animate-fade-in" aria-label="Related listings">
        <RelatedListingsRecommendations
          listings={related}
          currentListingId={listing.id}
          title="Related listings"
        />
      </section>
    </div>
  )
}
