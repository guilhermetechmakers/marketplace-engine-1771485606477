/** Schema type for dispute & refund case (dispute_refund_case_page table) */
export interface DisputeRefundCase {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Case status */
export type DisputeRefundCaseStatus =
  | 'active'
  | 'pending_evidence'
  | 'under_review'
  | 'resolved'
  | 'closed'
  | 'escalated'

/** Timeline event types */
export type CaseTimelineEventType = 'message' | 'evidence' | 'automated' | 'refund' | 'status_change'

/** Single timeline entry (message, uploaded evidence, or automated event) */
export interface CaseTimelineEvent {
  id: string
  case_id: string
  type: CaseTimelineEventType
  author_id?: string
  author_label?: string
  body: string
  metadata?: Record<string, unknown>
  created_at: string
}

/** List params with pagination and filters */
export interface DisputeRefundCaseListParams {
  page?: number
  pageSize?: number
  status?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/** Paginated list response */
export interface DisputeRefundCaseListResponse {
  data: DisputeRefundCase[]
  total: number
  page: number
  pageSize: number
}

/** Reconciliation log entry for admin */
export interface ReconciliationLogEntry {
  id: string
  case_id: string
  action: string
  amount_cents?: number
  note?: string
  created_at: string
  created_by?: string
}
