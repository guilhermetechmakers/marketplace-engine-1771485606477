import { useEffect, useState } from 'react'
import { useParams, Link, useLocation, Navigate } from 'react-router-dom'
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
import { AlertCircle, ChevronRight } from 'lucide-react'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { listing, related, isLoading: loading, error: err } = useListingDetail(id)
  const [messagingOpen, setMessagingOpen] = useState(false)
  const error = err?.message ?? null

  const isListingDetailPageRoute = location.pathname.startsWith('/listing-detail-page')
  const shouldRedirectToSearch = isListingDetailPageRoute && !id

  useEffect(() => {
    if (!listing) return
    const prevTitle = document.title
    const desc = listing.description?.slice(0, 160) ?? `${listing.title} – view details on Marketplace`
    document.title = `${listing.title} | Marketplace`

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      return { el, prev: el.content, content }
    }

    const metaDesc = setMeta('description', desc)
    metaDesc.el.content = metaDesc.content

    const ogTitle = setMeta('og:title', `${listing.title} | Marketplace`, 'property')
    ogTitle.el.content = ogTitle.content

    const ogDesc = setMeta('og:description', desc, 'property')
    ogDesc.el.content = ogDesc.content

    return () => {
      document.title = prevTitle
      metaDesc.el.content = metaDesc.prev
      ogTitle.el.content = ogTitle.prev
      ogDesc.el.content = ogDesc.prev
    }
  }, [listing])

  if (!id) {
    if (shouldRedirectToSearch) {
      return <Navigate to="/search" replace />
    }
    return (
      <div className="container-tight py-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link to="/search" className="transition-colors hover:text-foreground">Discover</Link></li>
            <li><ChevronRight className="h-4 w-4 shrink-0" aria-hidden /></li>
            <li className="text-foreground">Listing</li>
          </ol>
        </nav>
        <Card className="border-border bg-card shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No listing selected.</p>
            <Button asChild className="mt-4 transition-transform hover:scale-[1.02]">
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
        <nav aria-label="Breadcrumb" className="mb-6">
          <Skeleton className="h-5 w-48 rounded" />
        </nav>
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
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link to="/search" className="transition-colors hover:text-foreground">Discover</Link></li>
            <li><ChevronRight className="h-4 w-4 shrink-0" aria-hidden /></li>
            <li className="text-foreground">Listing</li>
          </ol>
        </nav>
        <Card className="border-border bg-card shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mt-2 text-center text-muted-foreground">
              {error ?? 'This listing could not be loaded.'}
            </p>
            <Button asChild className="mt-6 transition-transform hover:scale-[1.02]" variant="outline">
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
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link to="/search" className="transition-colors hover:text-foreground">Discover</Link>
          </li>
          <li><ChevronRight className="h-4 w-4 shrink-0" aria-hidden /></li>
          <li className="truncate text-foreground" title={listing.title}>{listing.title}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section
            className="animate-fade-in"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
            aria-label="Listing media"
          >
            <HeroMediaCarousel media={listing.media} title={listing.title} />
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
            aria-label="Listing details"
          >
            <Card className="border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <CardContent className="p-6">
                {listing.description ? (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <h3 className="text-lg font-semibold text-foreground">Description</h3>
                    <p className="mt-2 text-muted-foreground">{listing.description}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No description provided.</p>
                )}
              </CardContent>
            </Card>
          </section>

          <section
            className="animate-fade-in"
            style={{ animationDelay: '160ms', animationFillMode: 'both' }}
            aria-label="Attributes"
          >
            <DynamicAttributes attributeGroups={listing.attributes} />
          </section>

          {listing.availability_calendar_enabled && (
            <section
              className="animate-fade-in"
              style={{ animationDelay: '240ms', animationFillMode: 'both' }}
              aria-label="Availability"
            >
              <AvailabilityBookingCalendar
                enabled={listing.availability_calendar_enabled}
                listingId={listing.id}
              />
            </section>
          )}

          <section
            className="animate-fade-in"
            style={{ animationDelay: '320ms', animationFillMode: 'both' }}
            aria-label="Reviews"
          >
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
          <div
            className="animate-fade-in"
            style={{ animationDelay: '80ms', animationFillMode: 'both' }}
          >
            <ListingSummaryCard
              title={listing.title}
              price={listing.price}
              currency={listing.currency}
              listingId={listing.id}
              verified={listing.verified}
              shippingAvailable={listing.shipping_available}
              listingType={listingType}
            />
          </div>

          <div
            className="animate-fade-in"
            style={{ animationDelay: '160ms', animationFillMode: 'both' }}
          >
            <SellerSidebar seller={listing.seller} onContactClick={() => setMessagingOpen(true)} />
          </div>

          <div
            className="animate-fade-in"
            style={{ animationDelay: '240ms', animationFillMode: 'both' }}
          >
            <MessagingThreadAccess
              listingId={listing.id}
              sellerId={listing.seller.id}
              listingTitle={listing.title}
              existingThreadId={null}
              open={messagingOpen}
              onOpenChange={setMessagingOpen}
              hideTrigger
            />
          </div>
        </div>
      </div>

      <section
        className="mt-12 animate-fade-in"
        style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        aria-label="Related listings"
      >
        <RelatedListingsRecommendations
          listings={related}
          currentListingId={listing.id}
          title="Related listings"
        />
      </section>
    </div>
  )
}
