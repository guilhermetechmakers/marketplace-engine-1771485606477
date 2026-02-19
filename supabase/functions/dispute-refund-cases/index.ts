// Supabase Edge Function: dispute-refund-cases
// Server-side only: list cases, get case, timeline, refund/partial refund, escalate, close, penalty, reconciliation.
// Client calls via supabase.functions.invoke('dispute-refund-cases', { body: { action, ... } }) or via BFF that proxies to this.
// Full implementation: integrate with dispute_refund_case_page table, Stripe refunds, and idempotent PaymentIntent handling.

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/dispute-refund-cases\/?/, '') || ''
  const segments = path.split('/').filter(Boolean)

  try {
    // GET /dispute-refund-cases -> list
    if (req.method === 'GET' && segments.length === 0) {
      const page = Number(url.searchParams.get('page')) || 1
      const pageSize = Math.min(Number(url.searchParams.get('pageSize')) || 10, 50)
      const status = url.searchParams.get('status') ?? undefined
      // TODO: query dispute_refund_case_page with RLS, paginate
      return jsonResponse({
        data: [],
        total: 0,
        page,
        pageSize,
      })
    }

    // GET /dispute-refund-cases/:id -> single case
    if (req.method === 'GET' && segments.length === 1) {
      const caseId = segments[0]
      // TODO: fetch from dispute_refund_case_page by id, enforce RLS
      return jsonResponse({ id: caseId, title: '', description: null, status: 'active', user_id: '', created_at: '', updated_at: '' })
    }

    // GET /dispute-refund-cases/:id/timeline
    if (req.method === 'GET' && segments.length === 2 && segments[1] === 'timeline') {
      // TODO: fetch case timeline events (separate table or JSONB)
      return jsonResponse({ data: [] })
    }

    // GET /dispute-refund-cases/:id/reconciliation-logs
    if (req.method === 'GET' && segments.length === 2 && segments[1] === 'reconciliation-logs') {
      return jsonResponse({ data: [] })
    }

    // POST /dispute-refund-cases -> create
    if (req.method === 'POST' && segments.length === 0) {
      const body = await req.json() as { title: string; description?: string; order_id?: string }
      // TODO: insert dispute_refund_case_page, return created row
      return jsonResponse({ id: crypto.randomUUID(), ...body, status: 'active', user_id: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 201)
    }

    // POST /dispute-refund-cases/:id/timeline
    if (req.method === 'POST' && segments.length === 2 && segments[1] === 'timeline') {
      const body = await req.json() as { type: string; body: string; metadata?: Record<string, unknown> }
      // TODO: insert timeline event, return event
      return jsonResponse({ id: crypto.randomUUID(), case_id: segments[0], ...body, created_at: new Date().toISOString() }, 201)
    }

    // POST /dispute-refund-cases/:id/refund | partial-refund | escalate | close | penalty | adjust-payout
    if (req.method === 'POST' && segments.length === 2) {
      const [, action] = segments
      // TODO: validate auth, then Stripe refund / update status / reconciliation log
      return jsonResponse({ ok: true, action })
    }

    // PATCH /dispute-refund-cases/:id
    if (req.method === 'PATCH' && segments.length === 1) {
      const body = await req.json() as Record<string, unknown>
      // TODO: update dispute_refund_case_page, return updated row
      return jsonResponse({ id: segments[0], ...body })
    }

    // DELETE /dispute-refund-cases/:id
    if (req.method === 'DELETE' && segments.length === 1) {
      // TODO: soft delete or hard delete per RLS
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    return jsonResponse({ error: 'Not found' }, 404)
  } catch (e) {
    return jsonResponse({ message: e instanceof Error ? e.message : 'Internal error' }, 500)
  }
})
