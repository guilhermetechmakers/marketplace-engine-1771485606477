import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ShieldCheck } from 'lucide-react'
import type { RelatedListing } from '@/types/listing-detail'

export interface RelatedListingsRecommendationsProps {
  listings: RelatedListing[]
  currentListingId: string
  title?: string
  className?: string
}

function formatPrice(price: string | number, currency?: string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (Number.isNaN(num)) return '—'
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
  return currency ? `${currency} ${formatted}` : formatted
}

export function RelatedListingsRecommendations({
  listings,
  currentListingId,
  title = 'Related listings',
  className,
}: RelatedListingsRecommendationsProps) {
  const filtered = listings.filter((l) => l.id !== currentListingId).slice(0, 6)

  if (filtered.length === 0) return null

  return (
    <section className={cn('animate-fade-in', className)}>
      <h2 className="mb-4 text-2xl font-bold text-foreground">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            to={`/listings/${listing.id}`}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl"
          >
            <Card className="h-full overflow-hidden border-border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover">
              <div className="aspect-video w-full overflow-hidden bg-secondary">
                {listing.thumbnail_url ? (
                  <img
                    src={listing.thumbnail_url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-accent">
                    {listing.title}
                  </h3>
                  {listing.verified && (
                    <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-label="Verified" />
                  )}
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {listing.price != null
                    ? formatPrice(listing.price, listing.currency)
                    : '—'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
