// Supabase Edge Function: resend-verification
// Server-side only: resend email verification (signup confirmation) for the given email.
// Client calls via supabase.functions.invoke('resend-verification', { body: { email } }).
// When email is omitted, uses the session user's email from Authorization header if available.

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
    return jsonResponse({ message: 'Method not allowed' }, 405)
  }

  try {
    let body: { email?: string } = {}
    try {
      body = (await req.json()) as { email?: string }
    } catch {
      body = {}
    }
    let email = body?.email

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ message: 'Server configuration error.' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        email = user.email
      }
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(
        { message: 'Valid email is required to resend verification. Enter your email or sign in first.' },
        400
      )
    }

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
