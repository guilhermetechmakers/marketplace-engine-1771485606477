import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { VerificationStatusDisplay } from '@/components/email-verification-page/VerificationStatusDisplay'
import { ResendVerificationButton } from '@/components/email-verification-page/ResendVerificationButton'
import { LinkToLoginDashboard } from '@/components/email-verification-page/LinkToLoginDashboard'
import { apiGet } from '@/lib/api'

type VerificationState = 'loading' | 'success' | 'failure'

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

  useEffect(() => {
    document.title = 'Email verification | Marketplace'
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
      apiGet<{ verified?: boolean; error?: string }>(
        `/auth/verify?token_hash=${encodeURIComponent(tokenHash)}&type=email`
      )
        .then((data) => {
          if (cancelled) return
          setState(data?.verified ? 'success' : 'failure')
          if (data?.error) setErrorMessage(data.error)
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
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border bg-card shadow-card animate-fade-in">
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
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in-up">
        <VerificationStatusDisplay
          success={success}
          description={errorMessage ?? undefined}
        />
        <CardContent className="flex flex-col gap-4">
          <LinkToLoginDashboard verified={success} />
          {!success && (
            <ResendVerificationButton className="mt-2" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
