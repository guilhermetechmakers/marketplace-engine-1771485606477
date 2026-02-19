import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AvailabilityBookingCalendarProps {
  enabled?: boolean
  /** Reserved for future API: fetch availability by listing id */
  listingId?: string
  /** YYYY-MM-DD dates that are booked or blocked */
  bookedDates?: string[]
  className?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function AvailabilityBookingCalendar({
  enabled = true,
  listingId: _listingId,
  bookedDates = [],
  className,
}: AvailabilityBookingCalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const toKey = (d: number) => {
    const date = new Date(year, month, d)
    return date.toISOString().slice(0, 10)
  }

  if (!enabled) return null

  return (
    <Card className={cn('border-border bg-card', className)} data-listing-id={_listingId}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold text-foreground">Availability</h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[120px] text-center text-sm font-medium">
            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1
            const key = toKey(d)
            const isBooked = bookedDates.includes(key)
            return (
              <button
                key={key}
                type="button"
                disabled={isBooked}
                className={cn(
                  'rounded-lg py-2 text-sm transition-colors',
                  isBooked
                    ? 'cursor-not-allowed bg-muted text-muted-foreground line-through'
                    : 'hover:bg-primary/20 hover:text-foreground'
                )}
                aria-label={isBooked ? `${key} unavailable` : `${key} available`}
              >
                {d}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Select a date to proceed to booking. Unavailable dates are greyed out.
        </p>
      </CardContent>
    </Card>
  )
}
