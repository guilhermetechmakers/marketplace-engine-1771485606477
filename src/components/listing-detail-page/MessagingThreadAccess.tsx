import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface MessagingThreadAccessProps {
  listingId: string
  sellerId: string
  listingTitle?: string
  /** If threadId is provided, show "Open conversation" instead of "Start conversation". */
  existingThreadId?: string | null
  /** Controlled: open state from parent (e.g. when "Contact seller" opens this dialog). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Hide the trigger button when parent provides its own (e.g. SellerSidebar "Contact seller"). */
  hideTrigger?: boolean
  className?: string
}

export function MessagingThreadAccess({
  listingId,
  sellerId,
  listingTitle,
  existingThreadId,
  open: controlledOpen,
  onOpenChange: controlledSetOpen,
  hideTrigger = false,
  className,
}: MessagingThreadAccessProps) {
  const navigate = useNavigate()
  const [internalOpen, setInternalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const isControlled = controlledOpen !== undefined && controlledSetOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledSetOpen : setInternalOpen

  const hasThread = Boolean(existingThreadId)

  const handleOpenConversation = () => {
    if (existingThreadId) {
      navigate(`/dashboard/messages?thread=${existingThreadId}`)
      return
    }
    setOpen(true)
  }

  const handleStartConversation = () => {
    if (!message.trim()) return
    navigate(`/dashboard/messages?new=1&listing=${listingId}&seller=${sellerId}&prefill=${encodeURIComponent(message.trim())}`)
    setOpen(false)
    setMessage('')
  }

  return (
    <>
      {!hideTrigger && (
        <Button
          type="button"
          variant="outline"
          className={cn('w-full gap-2 transition-all hover:scale-[1.02] hover:shadow-md', className)}
          onClick={handleOpenConversation}
        >
          {hasThread ? 'Open conversation' : 'Start conversation'}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start conversation</DialogTitle>
            <DialogDescription>
              {listingTitle
                ? `Send a message to the seller about "${listingTitle}".`
                : 'Send a message to the seller.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Your message</Label>
              <textarea
                id="message"
                placeholder="Hi, I'm interested in this listing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="flex min-h-[80px] w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-describedby="message-description"
              />
              <p id="message-description" className="sr-only">
                Enter your message to start a conversation with the seller
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleStartConversation}
              disabled={!message.trim()}
            >
              Send & open messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
