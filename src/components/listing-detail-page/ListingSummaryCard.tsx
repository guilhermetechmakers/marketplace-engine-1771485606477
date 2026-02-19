import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ShieldCheck, Truck } from 'lucide-react'

export type PrimaryCtaType = 'book' | 'buy' | 'request_quote'

export interface ListingSummaryCardProps {
  title: string
  price?: string | number
  currency?: string
  listingId: string
  verified?: boolean
  shippingAvailable?: boolean
  listingType?: PrimaryCtaType
  className?: string
}

function formatPrice(price: string | number, currency?: string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (Number.isNaN(num)) return '—'
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
  return currency ? `${currency} ${formatted}` : formatted
}

export function ListingSummaryCard({
  title,
  price,
  currency = '',
  listingId,
  verified = false,
  shippingAvailable = false,
  listingType = 'buy',
  className,
}: ListingSummaryCardProps) {
  const ctaLabel =
    listingType === 'book'
      ? 'Book now'
      : listingType === 'request_quote'
        ? 'Request quote'
        : 'Buy now'

  const ctaHref =
    listingType === 'book'
      ? `/checkout?listing=${listingId}&type=booking`
      : listingType === 'request_quote'
        ? `/checkout?listing=${listingId}&type=quote`
        : `/checkout?listing=${listingId}`

  return (
    <Card
      className={cn(
        'sticky top-24 border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-accent/20',
        className
      )}
    >
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold leading-tight text-foreground">
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {verified && (
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Verified
            </Badge>
          )}
          {shippingAvailable && (
            <Badge variant="secondary" className="gap-1">
              <Truck className="h-3.5 w-3.5" aria-hidden />
              Shipping
            </Badge>
          )}
        </div>
        <p className="mt-4 text-3xl font-bold text-foreground">
          {price != null ? formatPrice(price, currency) : '—'}
        </p>
        <Button
          asChild
          className="mt-6 w-full rounded-xl py-6 text-base font-semibold shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] bg-gradient-to-r from-accent to-accent/90 text-accent-foreground hover:opacity-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
