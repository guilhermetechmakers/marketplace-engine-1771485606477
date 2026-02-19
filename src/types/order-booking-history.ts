/** Order/Booking record from Order Booking History API */
export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string | null
  status: string
  total_amount_cents: number
  currency: string
  payment_intent_id: string | null
  payout_id: string | null
  message_thread_id: string | null
  dispute_case_id: string | null
  receipt_pdf_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Order line item */
export interface OrderLineItem {
  id: string
  order_id: string
  listing_id: string | null
  title: string
  quantity: number
  unit_price_cents: number
  total_cents: number
  metadata: Record<string, unknown>
  created_at: string
}

/** Order state timeline entry */
export interface OrderStateTimelineEntry {
  id: string
  order_id: string
  from_status: string | null
  to_status: string
  triggered_by: string | null
  note: string | null
  metadata: Record<string, unknown>
  created_at: string
}

/** Detailed order view payload (single order with line items, timeline, metadata) */
export interface OrderDetail extends Order {
  line_items: OrderLineItem[]
  state_timeline: OrderStateTimelineEntry[]
  payment_metadata: {
    payment_intent_id: string | null
    payout_id: string | null
  }
  payout_metadata: { payout_id: string } | null
  message_thread_id: string | null
  dispute_status: string | null
  dispute_case_id: string | null
  receipt_pdf_url: string | null
}

/** List params with pagination and filters */
export interface OrderListParams {
  page?: number
  pageSize?: number
  status?: string
  listingId?: string
  dateFrom?: string
  dateTo?: string
  role?: 'buyer' | 'seller'
}

/** Paginated list response */
export interface OrderListResponse {
  data: Order[]
  total: number
  page: number
  pageSize: number
}

/** Receipt response */
export interface OrderReceiptResponse {
  order_id: string
  receipt_pdf_url: string | null
}
