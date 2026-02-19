import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { VerificationStatusDisplay } from '@/components/email-verification-page/VerificationStatusDisplay'
import { ResendVerificationButton } from '@/components/email-verification-page/ResendVerificationButton'
import { LinkToLoginDashboard } from '@/components/email-verification-page/LinkToLoginDashboard'
import { verifyEmail } from '@/api/auth'

type VerificationState = 'loading' | 'success' | 'failure'

const SEO_TITLE = 'Email Verification | Marketplace'
const SEO_DESCRIPTION =
  'Verify your email address to complete your account setup. Check your inbox for the verification link.'

/**
 * Email verification landing page.
 * Handles token from URL (e.g. ?token_hash=...&type=email or ?status=success|failure),
 * shows success/failure message, resend button, and link to login or dashboard.
 */
export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState<VerificationState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const statusParam = searchParams.get('status')
  const emailParam = searchParams.get('email')

  useEffect(() => {
    document.title = SEO_TITLE
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', SEO_DESCRIPTION)
    return () => {
      document.title = 'Marketplace'
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    if (statusParam === 'success' || statusParam === 'failure') {
      setState(statusParam)
      setErrorMessage(null)
      return
    }

    if (tokenHash && type === 'email') {
      verifyEmail(tokenHash, type)
        .then((data) => {
          if (cancelled) return
          setState(data.verified ? 'success' : 'failure')
          if (data.error) setErrorMessage(data.error)
        })
        .catch(() => {
          if (cancelled) return
          setState('failure')
          setErrorMessage('Verification request failed. You can try resending the email.')
        })
      return
    }

    setState('failure')
    setErrorMessage('Missing or invalid verification link.')
    return () => {
      cancelled = true
    }
  }, [tokenHash, type, statusParam])

  if (state === 'loading') {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-12">
        {/* Animated gradient background */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10 bg-[length:200%_200%] animate-gradient-shift"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/15 blur-3xl animate-blob-float"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-2xl animate-blob-float"
          style={{ animationDelay: '-4s' }}
          aria-hidden
        />

        <Card className="relative z-10 w-full max-w-md border-border bg-card/95 shadow-card backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="w-full space-y-2 text-center">
                <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
                <Skeleton className="mx-auto h-4 w-full max-w-sm rounded-lg" />
                <Skeleton className="mx-auto h-4 w-3/4 max-w-xs rounded-lg" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const success = state === 'success'

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10 bg-[length:200%_200%] animate-gradient-shift"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/15 blur-3xl animate-blob-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-2xl animate-blob-float"
        style={{ animationDelay: '-4s' }}
        aria-hidden
      />

      <Card className="relative z-10 w-full max-w-md border-border bg-card/95 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover animate-fade-in-up">
        <div className="rounded-t-2xl border-b border-border bg-gradient-to-r from-accent/5 to-primary/10 px-6 py-1" />
        <VerificationStatusDisplay
          success={success}
          description={errorMessage ?? undefined}
        />
        <CardContent className="flex flex-col gap-4">
          <LinkToLoginDashboard verified={success} />
          {!success && (
            <ResendVerificationButton
              className="mt-2"
              email={emailParam ?? undefined}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
