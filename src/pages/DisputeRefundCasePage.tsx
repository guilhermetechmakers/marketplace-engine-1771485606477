import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AlertCircle, ChevronLeft, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CaseTimeline,
  ActionPanel,
  PayoutReconciliationControls,
  ExportCasePDFandCSV,
} from '@/components/dispute-refund-case-page'
import {
  fetchDisputeRefundCaseList,
  fetchDisputeRefundCase,
  fetchCaseTimeline,
  fetchReconciliationLogs,
  addCaseTimelineEvent,
  refundCase,
  partialRefundCase,
  escalateCase,
  closeCase,
  imposePenalty,
  adjustPayout,
} from '@/api/dispute-refund-case'
import type { DisputeRefundCase, CaseTimelineEvent, ReconciliationLogEntry } from '@/types/dispute-refund-case'
import { toast } from 'sonner'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export default function DisputeRefundCasePage() {
  const { id: caseId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isAdmin = (localStorage.getItem('user_role') as string) === 'admin'

  const [listData, setListData] = React.useState<DisputeRefundCase[]>([])
  const [listTotal, setListTotal] = React.useState(0)
  const [listPage, setListPage] = React.useState(1)
  const [listPageSize, setListPageSize] = React.useState(10)
  const [listLoading, setListLoading] = React.useState(true)
  const [listError, setListError] = React.useState<string | null>(null)

  const [caseData, setCaseData] = React.useState<DisputeRefundCase | null>(null)
  const [timeline, setTimeline] = React.useState<CaseTimelineEvent[]>([])
  const [reconciliationLogs, setReconciliationLogs] = React.useState<ReconciliationLogEntry[]>([])
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [detailError, setDetailError] = React.useState<string | null>(null)
  const [actionLoading, setActionLoading] = React.useState(false)

  const fetchList = React.useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const res = await fetchDisputeRefundCaseList({
        page: listPage,
        pageSize: listPageSize,
        sortBy: 'updated_at',
        sortDir: 'desc',
      })
      setListData(res.data)
      setListTotal(res.total)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load cases'
      setListError(msg)
      toast.error(msg)
      setListData([])
      setListTotal(0)
    } finally {
      setListLoading(false)
    }
  }, [listPage, listPageSize])

  const fetchDetail = React.useCallback(async (cid: string) => {
    setDetailLoading(true)
    setDetailError(null)
    try {
      const [caseRes, timelineRes, logsRes] = await Promise.all([
        fetchDisputeRefundCase(cid),
        fetchCaseTimeline(cid),
        fetchReconciliationLogs(cid),
      ])
      setCaseData(caseRes ?? null)
      setTimeline(timelineRes ?? [])
      setReconciliationLogs(logsRes ?? [])
      if (!caseRes) {
        setDetailError('Case not found')
        toast.error('Case not found')
      }
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load case'
      setDetailError(msg)
      toast.error(msg)
      setCaseData(null)
      setTimeline([])
      setReconciliationLogs([])
    } finally {
      setDetailLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchList()
  }, [fetchList])

  React.useEffect(() => {
    if (caseId) fetchDetail(caseId)
    else {
      setCaseData(null)
      setTimeline([])
      setReconciliationLogs([])
    }
  }, [caseId, fetchDetail])

  const handleAddMessage = async (body: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await addCaseTimelineEvent(caseId, { type: 'message', body })
      toast.success('Message added')
      fetchDetail(caseId)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to add message'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddEvidence = async (body: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await addCaseTimelineEvent(caseId, { type: 'evidence', body })
      toast.success('Evidence added')
      fetchDetail(caseId)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to add evidence'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await refundCase(caseId)
      toast.success('Refund processed')
      fetchDetail(caseId)
      fetchList()
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Refund failed'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handlePartialRefund = async (amountCents: number, reason?: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await partialRefundCase(caseId, amountCents, reason)
      toast.success('Partial refund processed')
      fetchDetail(caseId)
      fetchList()
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Partial refund failed'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEscalate = async (note?: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await escalateCase(caseId, note)
      toast.success('Case escalated')
      fetchDetail(caseId)
      fetchList()
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Escalation failed'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseCase = async (resolution?: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await closeCase(caseId, resolution)
      toast.success('Case closed')
      fetchDetail(caseId)
      fetchList()
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to close case'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleImposePenalty = async (payload: {
    amount_cents?: number
    reason: string
  }) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await imposePenalty(caseId, payload)
      toast.success('Penalty recorded')
      fetchDetail(caseId)
      fetchReconciliationLogs(caseId).then(setReconciliationLogs)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to impose penalty'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAdjustPayout = async (amountCents: number, note: string) => {
    if (!caseId) return
    setActionLoading(true)
    try {
      await adjustPayout(caseId, { amount_cents: amountCents, note })
      toast.success('Payout adjustment saved')
      fetchReconciliationLogs(caseId).then(setReconciliationLogs)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Adjustment failed'
      toast.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(listTotal / listPageSize))

  if (caseId) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard/dispute-refund-case-page')}
              aria-label="Back to cases"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Case details</h1>
              <p className="mt-1 text-muted-foreground">
                Timeline, actions, reconciliation, and export
              </p>
            </div>
          </div>
        </div>

        {detailError && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-destructive">{detailError}</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/dispute-refund-case-page')}>
                Back to list
              </Button>
            </CardContent>
          </Card>
        )}

        {detailLoading && !caseData ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : caseData ? (
          <div className="grid gap-8 lg:grid-cols-1">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{caseData.title}</CardTitle>
                    <CardDescription>{caseData.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      caseData.status === 'resolved' || caseData.status === 'closed'
                        ? 'success'
                        : caseData.status === 'escalated'
                          ? 'warning'
                          : 'secondary'
                    }
                  >
                    {caseData.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <CaseTimeline
                  caseId={caseData.id}
                  events={timeline}
                  isLoading={detailLoading}
                  onAddMessage={handleAddMessage}
                  onUploadEvidence={handleAddEvidence}
                  isSubmitting={actionLoading}
                />
              </div>
              <div className="space-y-8">
                <ActionPanel
                  caseId={caseData.id}
                  status={caseData.status}
                  onRefund={handleRefund}
                  onPartialRefund={handlePartialRefund}
                  onEscalate={handleEscalate}
                  onCloseCase={handleCloseCase}
                  onImposePenalty={handleImposePenalty}
                  isLoading={actionLoading}
                />
                <ExportCasePDFandCSV
                  caseData={caseData}
                  timelineEvents={timeline}
                  isExporting={actionLoading}
                />
              </div>
            </div>

            {isAdmin && (
              <PayoutReconciliationControls
                caseId={caseData.id}
                logs={reconciliationLogs}
                isLoading={detailLoading}
                onAdjustPayout={handleAdjustPayout}
                isAdmin
              />
            )}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dispute & refund cases</h1>
        <p className="mt-1 text-muted-foreground">
          Case management, evidence, refunds, and audit trail
        </p>
      </div>

      <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Cases
          </CardTitle>
          <CardDescription>
            Open a case to view timeline, take actions, and export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {listError && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {listError}
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchList}>
                Retry
              </Button>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-border">
            {listLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full animate-pulse" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">No cases found</p>
                  <p className="text-sm text-muted-foreground">
                    Dispute and refund cases will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="sticky top-0 bg-muted/80 backdrop-blur">Title</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <span className="font-medium text-foreground">{row.title}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              row.status === 'resolved' || row.status === 'closed'
                                ? 'success'
                                : row.status === 'escalated'
                                  ? 'warning'
                                  : 'secondary'
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {new Date(row.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:scale-105"
                          >
                            <Link
                              to={`/dashboard/dispute-refund-case-page/${row.id}`}
                              className="inline-flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(listPage - 1) * listPageSize + 1}–
                    {Math.min(listPage * listPageSize, listTotal)} of {listTotal}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Per page</span>
                      <select
                        value={listPageSize}
                        onChange={(e) => {
                          setListPageSize(Number(e.target.value))
                          setListPage(1)
                        }}
                        className="h-9 rounded-lg border border-input bg-background px-2 text-sm focus:ring-2 focus:ring-accent"
                        aria-label="Items per page"
                      >
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setListPage((p) => Math.max(1, p - 1))}
                        disabled={listPage <= 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[6rem] text-center text-sm">
                        Page {listPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                        disabled={listPage >= totalPages}
                        aria-label="Next page"
                      >
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
