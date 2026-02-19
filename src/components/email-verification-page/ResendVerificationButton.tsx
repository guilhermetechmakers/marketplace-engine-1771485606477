import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/api/auth'
import { cn } from '@/lib/utils'

export interface ResendVerificationButtonProps {
  /** Optional email to resend to (e.g. from session or query). */
  email?: string
  /** Called after a successful resend. */
  onResent?: () => void
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
}

/**
 * Button to request a new verification email.
 * Calls the auth resend-verification API and shows toast feedback.
 */
export function ResendVerificationButton({
  email,
  onResent,
  className,
  variant = 'outline',
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    setIsLoading(true)
    try {
      await resendVerificationEmail(email)
      toast.success('Verification email sent', {
        description: 'Check your inbox and spam folder for the link.',
      })
      onResent?.()
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to send verification email.'
      toast.error('Could not resend', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn('w-full rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]', className)}
      onClick={handleResend}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Sending verification email…' : 'Resend verification email'}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          Sending…
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" aria-hidden />
          Resend verification email
        </>
      )}
    </Button>
  )
}
