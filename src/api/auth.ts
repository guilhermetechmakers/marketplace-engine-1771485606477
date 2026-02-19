import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { apiGet, apiPost } from '@/lib/api'

export interface VerifyEmailResult {
  verified: boolean
  error?: string
}

export interface ResendVerificationResult {
  message?: string
}

/**
 * Verify email with token from magic link.
 * Uses Supabase Edge Function when configured; otherwise REST API at /auth/verify.
 */
export async function verifyEmail(tokenHash: string, type = 'email'): Promise<VerifyEmailResult> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.functions.invoke<{ verified?: boolean; error?: string }>('verify-email', {
      body: { token_hash: tokenHash, type },
    })
    if (error) {
      return { verified: false, error: error.message }
    }
    return {
      verified: Boolean(data?.verified),
      error: data?.error,
    }
  }
  try {
    const data = await apiGet<{ verified?: boolean; error?: string }>(
      `/auth/verify?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(type)}`
    )
    return {
      verified: Boolean(data?.verified),
      error: data?.error,
    }
  } catch (e) {
    return {
      verified: false,
      error: e instanceof Error ? e.message : 'Verification request failed.',
    }
  }
}

/**
 * Resend verification email.
 * Uses Supabase Edge Function when configured; otherwise REST API at /auth/resend-verification.
 */
export async function resendVerificationEmail(email?: string): Promise<ResendVerificationResult> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.functions.invoke<{ message?: string }>('resend-verification', {
      body: { email: email ?? undefined },
    })
    if (error) {
      throw new Error(data?.message ?? error.message)
    }
    return { message: data?.message }
  }
  const data = await apiPost<ResendVerificationResult>('/auth/resend-verification', {
    email: email ?? undefined,
  })
  return data
}
