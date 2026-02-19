// Supabase Edge Function: resend-verification
// Server-side only: resend email verification (signup confirmation) for the given email.
// Client calls via supabase.functions.invoke('resend-verification', { body: { email } }).

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
    const body = (await req.json()) as { email?: string }
    const email = body?.email

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(
        { message: 'Valid email is required to resend verification.' },
        400
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ message: 'Server configuration error.' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      return jsonResponse(
        { message: error.message || 'Failed to resend verification email.' },
        400
      )
    }

    return jsonResponse({
      message: 'Verification email sent. Check your inbox and spam folder.',
    })
  } catch (e) {
    return jsonResponse(
      { message: e instanceof Error ? e.message : 'Internal error' },
      500
    )
  }
})
