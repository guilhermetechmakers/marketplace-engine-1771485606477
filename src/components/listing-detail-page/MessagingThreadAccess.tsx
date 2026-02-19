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
import { Input } from '@/components/ui/input'
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
  className?: string
}

export function MessagingThreadAccess({
  listingId,
  sellerId,
  listingTitle,
  existingThreadId,
  open: controlledOpen,
  onOpenChange: controlledSetOpen,
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
      <Button
        type="button"
        variant="outline"
        className={cn('w-full gap-2 transition-all hover:scale-[1.02]', className)}
        onClick={handleOpenConversation}
      >
        {hasThread ? 'Open conversation' : 'Start conversation'}
      </Button>

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
              <Input
                id="message"
                placeholder="Hi, I'm interested in this listing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] resize-y"
              />
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
