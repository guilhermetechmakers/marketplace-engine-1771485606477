import * as React from 'react'
import { FileText, Plus, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ReconciliationLogEntry } from '@/types/dispute-refund-case'

export interface PayoutReconciliationControlsProps {
  caseId: string
  logs: ReconciliationLogEntry[]
  isLoading?: boolean
  onAdjustPayout?: (amountCents: number, note: string) => void
  isAdmin?: boolean
}

export function PayoutReconciliationControls({
  caseId,
  logs,
  isLoading,
  onAdjustPayout,
  isAdmin,
}: PayoutReconciliationControlsProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [amount, setAmount] = React.useState('')
  const [note, setNote] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cents = Math.round(parseFloat(amount) * 100)
    if (!Number.isFinite(cents) || !note.trim() || !onAdjustPayout) return
    setSubmitting(true)
    try {
      onAdjustPayout(cents, note.trim())
      setDialogOpen(false)
      setAmount('')
      setNote('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover" data-case-id={caseId}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5" />
          Payout reconciliation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manual payout adjustments and reconciliation logs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin && onAdjustPayout && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setDialogOpen(true)}
              disabled={isLoading}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Manual adjustment
            </Button>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Manual payout adjustment</DialogTitle>
                <DialogDescription>
                  Record a payout adjustment for reconciliation. This will be logged.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="adj-amount">Amount (e.g. 25.00)</Label>
                  <Input
                    id="adj-amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adj-note">Note *</Label>
                  <Input
                    id="adj-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for adjustment"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !amount || !note.trim()}>
                  Save adjustment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4" />
            Reconciliation log
          </h4>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center'
              )}
            >
              <History className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No reconciliation entries yet</p>
            </div>
          ) : (
            <ul className="space-y-2" role="list">
              {logs.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-foreground">{entry.action}</span>
                  {entry.amount_cents != null && (
                    <span className="text-muted-foreground">
                      {(entry.amount_cents / 100).toFixed(2)}
                    </span>
                  )}
                  {entry.note && (
                    <span className="w-full text-muted-foreground">{entry.note}</span>
                  )}
                  <time
                    dateTime={entry.created_at}
                    className="text-xs text-muted-foreground"
                  >
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
