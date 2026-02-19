import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  type ApiError,
} from '@/lib/api'
import type {
  DisputeRefundCase,
  DisputeRefundCaseListParams,
  DisputeRefundCaseListResponse,
  CaseTimelineEvent,
  ReconciliationLogEntry,
} from '@/types/dispute-refund-case'

const BASE = '/dispute-refund-cases'

/** Fetch paginated dispute/refund cases. Backend: Supabase Edge Function. */
export async function fetchDisputeRefundCaseList(
  params: DisputeRefundCaseListParams
): Promise<DisputeRefundCaseListResponse> {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set('page', String(params.page))
  if (params.pageSize != null) sp.set('pageSize', String(params.pageSize))
  if (params.status) sp.set('status', params.status)
  if (params.sortBy) sp.set('sortBy', params.sortBy)
  if (params.sortDir) sp.set('sortDir', params.sortDir)
  const qs = sp.toString()
  const path = qs ? `${BASE}?${qs}` : BASE
  return apiGet<DisputeRefundCaseListResponse>(path)
}

/** Fetch single case by id. */
export async function fetchDisputeRefundCase(
  id: string
): Promise<DisputeRefundCase | null> {
  try {
    return await apiGet<DisputeRefundCase>(`${BASE}/${id}`)
  } catch {
    return null
  }
}

/** Fetch timeline events for a case. */
export async function fetchCaseTimeline(
  caseId: string
): Promise<CaseTimelineEvent[]> {
  try {
    const res = await apiGet<{ data: CaseTimelineEvent[] }>(
      `${BASE}/${caseId}/timeline`
    )
    return res.data ?? []
  } catch {
    return []
  }
}

/** Add timeline message or evidence. Server-side only. */
export async function addCaseTimelineEvent(
  caseId: string,
  payload: { type: CaseTimelineEvent['type']; body: string; metadata?: Record<string, unknown> }
): Promise<CaseTimelineEvent> {
  return apiPost<CaseTimelineEvent>(`${BASE}/${caseId}/timeline`, payload)
}

/** Refund (full). Server-side only (Edge Function / Stripe). */
export async function refundCase(caseId: string): Promise<void> {
  await apiPost(`${BASE}/${caseId}/refund`, {})
}

/** Partial refund. Server-side only. */
export async function partialRefundCase(
  caseId: string,
  amountCents: number,
  reason?: string
): Promise<void> {
  await apiPost(`${BASE}/${caseId}/partial-refund`, {
    amount_cents: amountCents,
    reason,
  })
}

/** Escalate case. */
export async function escalateCase(caseId: string, note?: string): Promise<void> {
  await apiPost(`${BASE}/${caseId}/escalate`, { note })
}

/** Close case. */
export async function closeCase(caseId: string, resolution?: string): Promise<void> {
  await apiPost(`${BASE}/${caseId}/close`, { resolution })
}

/** Impose penalty on seller. Server-side only. */
export async function imposePenalty(
  caseId: string,
  payload: { amount_cents?: number; reason: string }
): Promise<void> {
  await apiPost(`${BASE}/${caseId}/penalty`, payload)
}

/** Fetch reconciliation logs for a case (admin). */
export async function fetchReconciliationLogs(
  caseId: string
): Promise<ReconciliationLogEntry[]> {
  try {
    const res = await apiGet<{ data: ReconciliationLogEntry[] }>(
      `${BASE}/${caseId}/reconciliation-logs`
    )
    return res.data ?? []
  } catch {
    return []
  }
}

/** Manual payout adjustment (admin). Server-side only. */
export async function adjustPayout(
  caseId: string,
  payload: { amount_cents: number; note: string }
): Promise<void> {
  await apiPost(`${BASE}/${caseId}/adjust-payout`, payload)
}

/** Create case (e.g. from order dispute). */
export async function createDisputeRefundCase(payload: {
  title: string
  description?: string
  order_id?: string
}): Promise<DisputeRefundCase> {
  return apiPost<DisputeRefundCase>(BASE, payload)
}

/** Update case status/fields. */
export async function updateDisputeRefundCase(
  id: string,
  payload: Partial<Pick<DisputeRefundCase, 'title' | 'description' | 'status'>>
): Promise<DisputeRefundCase> {
  return apiPatch<DisputeRefundCase>(`${BASE}/${id}`, payload)
}

/** Delete case (soft or hard per backend). */
export async function deleteDisputeRefundCase(id: string): Promise<void> {
  await apiDelete(`${BASE}/${id}`)
}

export type { ApiError }
