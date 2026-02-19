// Supabase Edge Function: verify-email
// Server-side only: exchange token_hash for session and return verification result.
// Client calls via supabase.functions.invoke('verify-email', { body: { token_hash, type } }).

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

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const body = (await req.json()) as { token_hash?: string; type?: string }
    const token_hash = body?.token_hash
    const type = body?.type ?? 'email'

    if (!token_hash || typeof token_hash !== 'string') {
      return jsonResponse({ verified: false, error: 'Missing or invalid token.' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ verified: false, error: 'Server configuration error.' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email',
    })

    if (error) {
      return jsonResponse(
        { verified: false, error: error.message || 'Verification failed.' },
        400
      )
    }

    return jsonResponse({
      verified: true,
      session: data.session ? { access_token: data.session.access_token } : undefined,
    })
  } catch (e) {
    return jsonResponse(
      { verified: false, error: e instanceof Error ? e.message : 'Internal error' },
      500
    )
  }
})
