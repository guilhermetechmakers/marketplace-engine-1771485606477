import { useState, useCallback, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ListingMediaItem } from '@/types/listing-detail'

export interface HeroMediaCarouselProps {
  media: ListingMediaItem[]
  title?: string
  className?: string
}

export function HeroMediaCarousel({ media, title, className }: HeroMediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const items = media.length > 0 ? media : [{ id: 'placeholder', type: 'image' as const, url: '', order: 0 }]
  const current = items[index]
  const isPlaceholder = !current.url

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length)
    setZoom(false)
  }, [items.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % items.length)
    setZoom(false)
  }, [items.length])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setZoom(false)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    closeButtonRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, closeLightbox, goPrev, goNext])

  return (
    <>
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-accent/20',
          className
        )}
      >
        {isPlaceholder ? (
          <div
            className="flex h-full w-full items-center justify-center text-muted-foreground"
            aria-hidden
          >
            <span className="text-sm">No media</span>
          </div>
        ) : current.type === 'video' ? (
          <video
            src={current.url}
            className="h-full w-full object-cover"
            controls
            poster={current.thumbnail_url}
            aria-label={current.alt ?? title ?? 'Listing video'}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className={cn(
              'relative h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              zoom && 'cursor-zoom-out'
            )}
            aria-label="Open image in lightbox"
          >
            <img
              src={current.url}
              alt={current.alt ?? title ?? 'Listing image'}
              className={cn(
                'h-full w-full object-cover transition-transform duration-300',
                zoom && 'scale-150'
              )}
              onClick={(e) => {
                if (!lightboxOpen) return
                e.preventDefault()
                setZoom((z) => !z)
              }}
            />
            <span className="absolute bottom-3 right-3 rounded-lg bg-black/50 p-2 text-white">
              <ZoomIn className="h-5 w-5" aria-hidden />
            </span>
          </button>
        )}

        {items.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-md transition-transform hover:scale-105"
              onClick={goPrev}
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full shadow-md transition-transform hover:scale-105"
              onClick={goNext}
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-200',
                    i === index ? 'w-6 bg-primary' : 'w-2 bg-white/70 hover:bg-white'
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && current.type === 'image' && current.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
        >
          <Button
            ref={closeButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            onClick={closeLightbox}
            aria-label="Close lightbox (Escape)"
          >
            <X className="h-6 w-6" />
          </Button>
          <button
            type="button"
            className="max-h-[90vh] max-w-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            onClick={(e) => {
              e.stopPropagation()
              setZoom((z) => !z)
            }}
            aria-label={zoom ? 'Zoom out' : 'Zoom in'}
          >
            <img
              src={current.url}
              alt={current.alt ?? title ?? 'Listing image'}
              className={cn('max-h-[90vh] w-auto rounded-lg object-contain transition-transform duration-300', zoom && 'scale-150')}
            />
          </button>
        </div>
      )}
    </>
  )
}
