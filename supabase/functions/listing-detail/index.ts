// Supabase Edge Function: listing-detail
// Server-side only: fetch listing detail and related listings for public listing page.
// Client calls via supabase.functions.invoke('listing-detail', { body: { id } }) or GET /listing-detail?id=xxx
// Integrates with listing_detail_page table and listings/media/seller data.

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let id: string | null = null
  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)
  const lastSegment = path[path.length - 1]
  if (lastSegment && lastSegment !== 'listing-detail') {
    id = lastSegment
  }
  if (!id) id = url.searchParams.get('id')
  if (!id && req.method === 'POST') {
    try {
      const body = (await req.json().catch(() => ({}))) as { id?: string }
      if (body?.id) id = body.id
    } catch {
      // ignore
    }
  }

  try {
    if (!id || typeof id !== 'string') {
      return jsonResponse({ error: 'Missing listing id' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: 'Server configuration error.' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch listing_detail_page record (RLS applies)
    const { data: pageData, error: pageError } = await supabase
      .from('listing_detail_page')
      .select('id, user_id, title, description, status, created_at, updated_at')
      .eq('id', id)
      .single()

    if (pageError || !pageData) {
      return jsonResponse(
        { error: pageError?.message ?? 'Listing not found' },
        pageError?.code === 'PGRST116' ? 404 : 400
      )
    }

    // Build extended listing payload for public detail page.
    // In a full implementation, join with listings, media, seller, reviews tables.
    const listing = {
      ...pageData,
      price: null as string | number | null,
      currency: undefined as string | undefined,
      listing_type: 'buy' as const,
      verified: false,
      shipping_available: false,
      media: [] as { id: string; type: 'image' | 'video'; url: string; thumbnail_url?: string; alt?: string; order: number }[],
      attributes: [] as { label: string; fields: { key: string; label: string; value: string | number | boolean }[] }[],
      seller: {
        id: pageData.user_id,
        display_name: 'Seller',
        avatar_url: undefined as string | undefined,
        rating_average: 0,
        rating_count: 0,
        response_time_hours: undefined as number | undefined,
        verified: false,
      },
      reviews: [] as { id: string; user_id: string; user_display_name: string; rating: number; body?: string; created_at: string }[],
      review_summary: { average: 0, count: 0 },
      availability_calendar_enabled: false,
    }

    // Related listings (same category or user) - placeholder
    const related: { id: string; title: string; price?: string | number; currency?: string; thumbnail_url?: string; verified?: boolean }[] = []

    return jsonResponse({ listing, related })
  } catch (e) {
    return jsonResponse(
      { error: e instanceof Error ? e.message : 'Internal error' },
      500
    )
  }
})
