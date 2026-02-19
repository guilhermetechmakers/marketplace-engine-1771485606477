/**
 * Type for email_verification_page table (Supabase).
 * Used when persisting verification page state per user.
 */
export interface EmailVerificationPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}
