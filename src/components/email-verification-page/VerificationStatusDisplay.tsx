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
 * Gradient accents and elevated styling per design reference.
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
      <div
        className={cn(
          'mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300',
          success
            ? 'bg-accent/15 ring-2 ring-accent/30 shadow-lg shadow-accent/10'
            : 'bg-destructive/10 ring-2 ring-destructive/20 shadow-lg shadow-destructive/5'
        )}
      >
        {success ? (
          <CheckCircle2
            className="h-12 w-12 text-accent animate-fade-in"
            aria-hidden
          />
        ) : (
          <XCircle
            className="h-12 w-12 text-destructive animate-fade-in"
            aria-hidden
          />
        )}
      </div>
      <CardTitle className="mt-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title ?? defaultTitle}
      </CardTitle>
      <CardDescription className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted-foreground">
        {description ?? defaultDescription}
      </CardDescription>
    </CardHeader>
  )
}
