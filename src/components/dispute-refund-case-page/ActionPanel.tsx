import * as React from 'react'
import {
  RefreshCw,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Scale,
} from 'lucide-react'
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
export interface ActionPanelProps {
  caseId: string
  status: string
  onRefund?: () => void
  onPartialRefund?: (amountCents: number, reason?: string) => void
  onEscalate?: (note?: string) => void
  onCloseCase?: (resolution?: string) => void
  onImposePenalty?: (payload: { amount_cents?: number; reason: string }) => void
  isLoading?: boolean
}

export function ActionPanel({
  caseId,
  status,
  onRefund,
  onPartialRefund,
  onEscalate,
  onCloseCase,
  onImposePenalty,
  isLoading,
}: ActionPanelProps) {
  const [refundDialogOpen, setRefundDialogOpen] = React.useState(false)
  const [partialRefundOpen, setPartialRefundOpen] = React.useState(false)
  const [partialAmount, setPartialAmount] = React.useState('')
  const [partialReason, setPartialReason] = React.useState('')
  const [escalateOpen, setEscalateOpen] = React.useState(false)
  const [escalateNote, setEscalateNote] = React.useState('')
  const [closeOpen, setCloseOpen] = React.useState(false)
  const [closeResolution, setCloseResolution] = React.useState('')
  const [penaltyOpen, setPenaltyOpen] = React.useState(false)
  const [penaltyAmount, setPenaltyAmount] = React.useState('')
  const [penaltyReason, setPenaltyReason] = React.useState('')

  const isResolvedOrClosed = status === 'resolved' || status === 'closed'

  const handlePartialRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cents = Math.round(parseFloat(partialAmount) * 100)
    if (!Number.isFinite(cents) || cents <= 0 || !onPartialRefund) return
    onPartialRefund(cents, partialReason.trim() || undefined)
    setPartialRefundOpen(false)
    setPartialAmount('')
    setPartialReason('')
  }

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEscalate?.(escalateNote.trim() || undefined)
    setEscalateOpen(false)
    setEscalateNote('')
  }

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCloseCase?.(closeResolution.trim() || undefined)
    setCloseOpen(false)
    setCloseResolution('')
  }

  const handlePenaltySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!penaltyReason.trim() || !onImposePenalty) return
    const amount_cents = penaltyAmount.trim()
      ? Math.round(parseFloat(penaltyAmount) * 100)
      : undefined
    if (amount_cents !== undefined && (!Number.isFinite(amount_cents) || amount_cents < 0))
      return
    onImposePenalty({ amount_cents, reason: penaltyReason.trim() })
    setPenaltyOpen(false)
    setPenaltyAmount('')
    setPenaltyReason('')
  }

  return (
    <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover" data-case-id={caseId}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <RefreshCw className="h-5 w-5" />
          Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Refund, partial refund, escalate, close case, or impose penalties
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {onRefund && !isResolvedOrClosed && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setRefundDialogOpen(true)}
            disabled={isLoading}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            <DollarSign className="h-4 w-4" />
            Full refund
          </Button>
        )}
        {onRefund && (
          <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Full refund</DialogTitle>
                <DialogDescription>
                  Process a full refund for this case. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onRefund()
                    setRefundDialogOpen(false)
                  }}
                  disabled={isLoading}
                >
                  Confirm refund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {onPartialRefund && !isResolvedOrClosed && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPartialRefundOpen(true)}
              disabled={isLoading}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              <DollarSign className="h-4 w-4" />
              Partial refund
            </Button>
            <Dialog open={partialRefundOpen} onOpenChange={setPartialRefundOpen}>
              <DialogContent>
                <form onSubmit={handlePartialRefundSubmit}>
                  <DialogHeader>
                    <DialogTitle>Partial refund</DialogTitle>
                    <DialogDescription>
                      Enter the amount and optional reason.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="partial-amount">Amount (e.g. 25.00)</Label>
                      <Input
                        id="partial-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="partial-reason">Reason (optional)</Label>
                      <Input
                        id="partial-reason"
                        value={partialReason}
                        onChange={(e) => setPartialReason(e.target.value)}
                        placeholder="Reason for partial refund"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPartialRefundOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Process partial refund
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}

        {onEscalate && !isResolvedOrClosed && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEscalateOpen(true)}
              disabled={isLoading}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              <AlertTriangle className="h-4 w-4" />
              Escalate
            </Button>
            <Dialog open={escalateOpen} onOpenChange={setEscalateOpen}>
              <DialogContent>
                <form onSubmit={handleEscalateSubmit}>
                  <DialogHeader>
                    <DialogTitle>Escalate case</DialogTitle>
                    <DialogDescription>
                      Add a note for the escalation. The case will be marked as escalated.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="escalate-note">Note (optional)</Label>
                      <Input
                        id="escalate-note"
                        value={escalateNote}
                        onChange={(e) => setEscalateNote(e.target.value)}
                        placeholder="Reason for escalation"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEscalateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Escalate
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}

        {onCloseCase && !isResolvedOrClosed && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCloseOpen(true)}
              disabled={isLoading}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="h-4 w-4" />
              Close case
            </Button>
            <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
              <DialogContent>
                <form onSubmit={handleCloseSubmit}>
                  <DialogHeader>
                    <DialogTitle>Close case</DialogTitle>
                    <DialogDescription>
                      Optionally add a resolution note before closing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="close-resolution">Resolution (optional)</Label>
                      <Input
                        id="close-resolution"
                        value={closeResolution}
                        onChange={(e) => setCloseResolution(e.target.value)}
                        placeholder="Resolution summary"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCloseOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Close case
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}

        {onImposePenalty && !isResolvedOrClosed && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPenaltyOpen(true)}
              disabled={isLoading}
              className="hover:scale-[1.02] active:scale-[0.98] border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              <Scale className="h-4 w-4" />
              Impose penalty
            </Button>
            <Dialog open={penaltyOpen} onOpenChange={setPenaltyOpen}>
              <DialogContent>
                <form onSubmit={handlePenaltySubmit}>
                  <DialogHeader>
                    <DialogTitle>Impose penalty</DialogTitle>
                    <DialogDescription>
                      Apply a penalty to the seller. Reason is required.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="penalty-amount">Amount (optional, e.g. 10.00)</Label>
                      <Input
                        id="penalty-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={penaltyAmount}
                        onChange={(e) => setPenaltyAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="penalty-reason">Reason *</Label>
                      <Input
                        id="penalty-reason"
                        value={penaltyReason}
                        onChange={(e) => setPenaltyReason(e.target.value)}
                        placeholder="Reason for penalty"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPenaltyOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !penaltyReason.trim()}>
                      Impose penalty
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}

        {isResolvedOrClosed && (
          <p className="text-sm text-muted-foreground">
            Case is {status}. No further actions available.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
