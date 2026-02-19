import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageCircle, ShieldCheck, Clock } from 'lucide-react'
import type { ListingSeller } from '@/types/listing-detail'

export interface SellerSidebarProps {
  seller: ListingSeller
  onContactClick?: () => void
  className?: string
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  const v = Math.min(max, Math.max(0, value))
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating: ${v} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn(
            'text-sm',
            i < Math.floor(v) ? 'text-amber-500' : 'text-muted-foreground/40'
          )}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export function SellerSidebar({ seller, onContactClick, className }: SellerSidebarProps) {
  const responseText =
    seller.response_time_hours != null
      ? `Usually responds within ${seller.response_time_hours}h`
      : 'Response time varies'

  return (
    <Card
      className={cn(
        'border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover',
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-secondary"
            aria-hidden
          >
            {seller.avatar_url ? (
              <img
                src={seller.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
                {seller.display_name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-foreground">
              {seller.display_name}
            </h3>
            {seller.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
                Verified seller
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <StarRating value={seller.rating_average} />
          <span className="text-sm text-muted-foreground">
            ({seller.rating_count} {seller.rating_count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          {responseText}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full gap-2 transition-all hover:scale-[1.02] hover:shadow-md"
          onClick={onContactClick}
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Contact seller
        </Button>
      </CardContent>
    </Card>
  )
}
