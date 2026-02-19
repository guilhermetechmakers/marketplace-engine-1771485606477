import * as React from 'react'
import { MessageSquare, FileUp, Bot, RefreshCw, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CaseTimelineEvent, CaseTimelineEventType } from '@/types/dispute-refund-case'

export interface CaseTimelineProps {
  caseId: string
  events: CaseTimelineEvent[]
  isLoading?: boolean
  onAddMessage?: (body: string) => void
  onUploadEvidence?: (body: string, fileRef?: string) => void
  isSubmitting?: boolean
}

function eventIcon(type: CaseTimelineEventType) {
  switch (type) {
    case 'message':
      return MessageSquare
    case 'evidence':
      return FileUp
    case 'automated':
      return Bot
    case 'refund':
    case 'status_change':
      return RefreshCw
    default:
      return ArrowRight
  }
}

function eventLabel(type: CaseTimelineEventType) {
  switch (type) {
    case 'message':
      return 'Message'
    case 'evidence':
      return 'Evidence'
    case 'automated':
      return 'System'
    case 'refund':
      return 'Refund'
    case 'status_change':
      return 'Status'
    default:
      return 'Event'
  }
}

export function CaseTimeline({
  caseId,
  events,
  isLoading,
  onAddMessage,
  onUploadEvidence,
  isSubmitting,
}: CaseTimelineProps) {
  const [newMessage, setNewMessage] = React.useState('')
  const [newEvidence, setNewEvidence] = React.useState('')

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !onAddMessage || isSubmitting) return
    onAddMessage(newMessage.trim())
    setNewMessage('')
  }

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvidence.trim() || !onUploadEvidence || isSubmitting) return
    onUploadEvidence(newEvidence.trim())
    setNewEvidence('')
  }

  return (
    <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MessageSquare className="h-5 w-5" />
          Case timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Messages, uploaded evidence, and automated events
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">No timeline events yet</p>
              <p className="text-sm text-muted-foreground">
                Add a message or upload evidence below to start the audit trail.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-0" role="list" aria-label="Case timeline">
            {events.map((event, index) => {
              const Icon = eventIcon(event.type)
              const label = eventLabel(event.type)
              return (
                <li
                  key={event.id}
                  className={cn(
                    'flex gap-4 pb-6 animate-fade-in',
                    index < events.length - 1 && 'border-l-2 border-border pl-6 ml-5'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card',
                      event.type === 'automated' && 'bg-muted',
                      event.type === 'evidence' && 'bg-primary/10'
                    )}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      {event.author_label && (
                        <span className="text-xs text-muted-foreground">
                          · {event.author_label}
                        </span>
                      )}
                      <time
                        dateTime={event.created_at}
                        className="text-xs text-muted-foreground"
                      >
                        {new Date(event.created_at).toLocaleString()}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
                      {event.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {(onAddMessage || onUploadEvidence) && (
          <div className="space-y-4 border-t border-border pt-6">
            {onAddMessage && (
              <form onSubmit={handleSubmitMessage} className="space-y-2">
                <Label htmlFor={`timeline-message-${caseId}`}>Add message</Label>
                <div className="flex gap-2">
                  <Input
                    id={`timeline-message-${caseId}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button type="submit" disabled={!newMessage.trim() || isSubmitting}>
                    Send
                  </Button>
                </div>
              </form>
            )}
            {onUploadEvidence && (
              <form onSubmit={handleSubmitEvidence} className="space-y-2">
                <Label htmlFor={`timeline-evidence-${caseId}`}>Add evidence note</Label>
                <div className="flex gap-2">
                  <Input
                    id={`timeline-evidence-${caseId}`}
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    placeholder="Describe or link to evidence..."
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={!newEvidence.trim() || isSubmitting}
                  >
                    Add evidence
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
