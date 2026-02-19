import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VerificationStatusDisplayProps {
  /** Whether verification succeeded (true) or failed (false). */
  success: boolean
  /** Optional custom title override. */
  title?: string
  /** Optional custom description override. */
  description?: string
  className?: string
}

/**
 * Displays success or failure message for email verification.
 * Uses distinct icon, title, and description for each state.
 */
export function VerificationStatusDisplay({
  success,
  title,
  description,
  className,
}: VerificationStatusDisplayProps) {
  const defaultTitle = success ? 'Email verified' : 'Verification failed'
  const defaultDescription = success
    ? 'Your email has been verified. You can now sign in and access your account.'
    : 'The verification link may be expired or invalid. Use the button below to request a new verification email.'

  return (
    <CardHeader
      className={cn('text-center', className)}
      role="status"
      aria-live="polite"
      aria-label={success ? 'Email verification succeeded' : 'Email verification failed'}
    >
      {success ? (
        <CheckCircle2
          className="mx-auto h-16 w-16 text-accent animate-fade-in"
          aria-hidden
        />
      ) : (
        <XCircle
          className="mx-auto h-16 w-16 text-destructive animate-fade-in"
          aria-hidden
        />
      )}
      <CardTitle className="text-2xl font-bold mt-4">
        {title ?? defaultTitle}
      </CardTitle>
      <CardDescription className="mt-2 text-base leading-relaxed max-w-md mx-auto">
        {description ?? defaultDescription}
      </CardDescription>
    </CardHeader>
  )
}
