import { apiGet, type ApiError } from '@/lib/api'
import type {
  Order,
  OrderDetail,
  OrderListParams,
  OrderListResponse,
  OrderReceiptResponse,
} from '@/types/order-booking-history'

const BASE = '/order-booking-history'

/** Fetch paginated order/booking history. Backend: Supabase Edge Function. */
export async function fetchOrderList(
  params: OrderListParams
): Promise<OrderListResponse> {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set('page', String(params.page))
  if (params.pageSize != null) sp.set('pageSize', String(params.pageSize))
  if (params.status) sp.set('status', params.status)
  if (params.listingId) sp.set('listingId', params.listingId)
  if (params.dateFrom) sp.set('dateFrom', params.dateFrom)
  if (params.dateTo) sp.set('dateTo', params.dateTo)
  if (params.role) sp.set('role', params.role)
  const qs = sp.toString()
  const path = qs ? `${BASE}?${qs}` : BASE
  return apiGet<OrderListResponse>(path)
}

/** Fetch detailed order view (line items, state timeline, payment & payout metadata, dispute status). */
export async function fetchOrderDetail(id: string): Promise<OrderDetail | null> {
  try {
    return await apiGet<OrderDetail>(`${BASE}/${id}`)
  } catch {
    return null
  }
}

/** Fetch receipt PDF link for an order. */
export async function fetchOrderReceipt(
  orderId: string
): Promise<OrderReceiptResponse | null> {
  try {
    return await apiGet<OrderReceiptResponse>(`${BASE}/${orderId}/receipt`)
  } catch {
    return null
  }
}

export type { ApiError, Order, OrderDetail }
