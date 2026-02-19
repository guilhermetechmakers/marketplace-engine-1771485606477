// Supabase Edge Function: order-booking-history
// Order/Booking History API: paginated lists, filters, detailed view, receipts, secure access.
// Client calls via apiGet/apiPost to /order-booking-history (proxied to this function).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

async function getAuthUser(req: Request): Promise<{ id: string; role?: string } | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !supabaseAnonKey) return null
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user } } = await supabase.auth.getUser(token)
  return user ? { id: user.id } : null
}

async function isAdmin(supabase: ReturnType<typeof createClient>, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role === 'admin'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname
    .replace(/^\/functions\/v1\/order-booking-history\/?/, '')
    .replace(/^\/order-booking-history\/?/, '') || ''
  const segments = path.split('/').filter(Boolean)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonResponse({ error: 'Server configuration error.' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const user = await getAuthUser(req)
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const admin = await isAdmin(supabase, user.id).catch(() => false)

  try {
    // GET /order-booking-history -> paginated list with filters
    if (req.method === 'GET' && segments.length === 0) {
      const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
      const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))
      const status = url.searchParams.get('status') ?? undefined
      const listingId = url.searchParams.get('listingId') ?? undefined
      const dateFrom = url.searchParams.get('dateFrom') ?? undefined
      const dateTo = url.searchParams.get('dateTo') ?? undefined
      const role = url.searchParams.get('role') ?? 'buyer' // buyer | seller

      let query = supabase
        .from('orders')
        .select('id, buyer_id, seller_id, listing_id, status, total_amount_cents, currency, created_at, updated_at, dispute_case_id', { count: 'exact' })

      if (!admin) {
        if (role === 'seller') {
          query = query.eq('seller_id', user.id)
        } else {
          query = query.eq('buyer_id', user.id)
        }
      }

      if (status) query = query.eq('status', status)
      if (listingId) query = query.eq('listing_id', listingId)
      if (dateFrom) query = query.gte('created_at', dateFrom)
      if (dateTo) query = query.lte('created_at', dateTo)

      const from = (page - 1) * pageSize
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1)

      if (error) {
        return jsonResponse({ error: error.message }, 400)
      }

      return jsonResponse({
        data: data ?? [],
        total: count ?? 0,
        page,
        pageSize,
      })
    }

    // GET /order-booking-history/:id -> detailed order view
    if (req.method === 'GET' && segments.length === 1) {
      const orderId = segments[0]

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return jsonResponse({ error: 'Order not found' }, 404)
      }

      if (!admin && order.buyer_id !== user.id && order.seller_id !== user.id) {
        return jsonResponse({ error: 'Forbidden' }, 403)
      }

      const [lineItemsRes, timelineRes] = await Promise.all([
        supabase.from('order_line_items').select('*').eq('order_id', orderId).order('created_at'),
        supabase.from('order_state_timeline').select('*').eq('order_id', orderId).order('created_at'),
      ])

      const payload = {
        ...order,
        line_items: lineItemsRes.data ?? [],
        state_timeline: timelineRes.data ?? [],
        payment_metadata: {
          payment_intent_id: order.payment_intent_id,
          payout_id: order.payout_id,
        },
        payout_metadata: order.payout_id ? { payout_id: order.payout_id } : null,
        message_thread_id: order.message_thread_id,
        dispute_status: order.dispute_case_id ? 'open' : null,
        dispute_case_id: order.dispute_case_id,
        receipt_pdf_url: order.receipt_pdf_url,
      }

      return jsonResponse(payload)
    }

    // GET /order-booking-history/:id/receipt -> receipt PDF link
    if (req.method === 'GET' && segments.length === 2 && segments[1] === 'receipt') {
      const orderId = segments[0]

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, buyer_id, seller_id, receipt_pdf_url')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return jsonResponse({ error: 'Order not found' }, 404)
      }

      if (!admin && order.buyer_id !== user.id && order.seller_id !== user.id) {
        return jsonResponse({ error: 'Forbidden' }, 403)
      }

      return jsonResponse({
        order_id: order.id,
        receipt_pdf_url: order.receipt_pdf_url,
      })
    }

    return jsonResponse({ error: 'Not found' }, 404)
  } catch (e) {
    return jsonResponse(
      { error: e instanceof Error ? e.message : 'Internal error' },
      500
    )
  }
})
