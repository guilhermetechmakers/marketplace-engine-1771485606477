import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { ListingReview } from '@/types/listing-detail'

export interface ReviewsSectionProps {
  listingId: string
  reviews: ListingReview[]
  averageRating?: number
  totalCount?: number
  /** Only show "Write review" when user has completed a transaction for this listing. */
  canWriteReview?: boolean
  className?: string
}

const REVIEWS_PAGE_SIZE = 5

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  const v = Math.min(max, Math.max(0, value))
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={i < Math.floor(v) ? 'text-amber-500' : 'text-muted-foreground/40'}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export function ReviewsSection({
  listingId,
  reviews,
  averageRating = 0,
  totalCount = 0,
  canWriteReview = false,
  className,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? reviews : reviews.slice(0, REVIEWS_PAGE_SIZE)
  const hasMore = reviews.length > REVIEWS_PAGE_SIZE

  return (
    <Card className={cn('border-border bg-card', className)}>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
          <div className="mt-1 flex items-center gap-2">
            <StarDisplay value={averageRating} />
            <span className="text-sm text-muted-foreground">
              {totalCount > 0
                ? `${averageRating.toFixed(1)} · ${totalCount} ${totalCount === 1 ? 'review' : 'reviews'}`
                : 'No reviews yet'}
            </span>
          </div>
        </div>
        {canWriteReview && (
          <Button asChild variant="default" className="shrink-0">
            <Link to={`/dashboard/messages?write-review=${listingId}`}>
              Write a review
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Star className="h-8 w-8 text-muted-foreground/60" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No reviews yet</p>
            <p className="mt-1 max-w-[280px] text-center text-sm text-muted-foreground">
              Be the first to leave a review after your purchase or booking.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {displayed.map((review) => (
              <li
                key={review.id}
                className="animate-fade-in border-b border-border pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2">
                  <StarDisplay value={review.rating} />
                  <span className="text-sm font-medium text-foreground">
                    {review.user_display_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.body && (
                  <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {hasMore && !showAll && (
          <Button
            type="button"
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => setShowAll(true)}
          >
            Show all {reviews.length} reviews
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
