import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { resendVerificationEmail } from '@/api/auth'
import { cn } from '@/lib/utils'

export interface ResendVerificationButtonProps {
  /** Optional email to resend to (e.g. from session, URL param, or user input). */
  email?: string
  /** Called after a successful resend. */
  onResent?: () => void
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
}

/**
 * Button to request a new verification email.
 * When email is not provided, shows an inline email input for the user to enter.
 * Calls the auth resend-verification API and shows toast feedback.
 */
export function ResendVerificationButton({
  email: initialEmail,
  onResent,
  className,
  variant = 'outline',
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailInput, setEmailInput] = useState(initialEmail ?? '')
  const [showEmailInput, setShowEmailInput] = useState(!initialEmail)

  const emailToUse = initialEmail ?? emailInput

  const handleResend = async () => {
    if (!emailToUse || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      toast.error('Enter a valid email', {
        description: 'We need your email to send the verification link.',
      })
      setShowEmailInput(true)
      return
    }

    setIsLoading(true)
    try {
      await resendVerificationEmail(emailToUse)
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
    <div className={cn('flex flex-col gap-3', className)}>
      {showEmailInput && !initialEmail && (
        <div className="space-y-2 animate-fade-in-up-stagger">
          <Label htmlFor="resend-email">Your email address</Label>
          <Input
            id="resend-email"
            type="email"
            placeholder="you@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            disabled={isLoading}
            autoComplete="email"
            className="rounded-lg border-border focus:ring-2 focus:ring-accent/25"
            aria-describedby="resend-email-hint"
          />
          <p id="resend-email-hint" className="text-xs text-muted-foreground">
            Enter the email you used to sign up. We&apos;ll send a new verification link.
          </p>
        </div>
      )}
      <Button
        type="button"
        variant={variant}
        className="w-full rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        onClick={handleResend}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? 'Sending verification email…' : 'Resend verification email'}
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            Sending…
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" aria-hidden />
            Resend verification email
          </>
        )}
      </Button>
    </div>
  )
}
