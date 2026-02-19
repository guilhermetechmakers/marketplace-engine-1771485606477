import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'success'

  const success = status === 'success'

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card shadow-card">
        <CardHeader className="text-center">
          {success ? (
            <CheckCircle2 className="mx-auto h-16 w-16 text-accent" aria-hidden />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-destructive" aria-hidden />
          )}
          <CardTitle className="text-2xl font-bold">
            {success ? 'Email verified' : 'Verification failed'}
          </CardTitle>
          <CardDescription>
            {success
              ? 'Your email has been verified. You can now sign in.'
              : 'The link may be expired or invalid. Request a new verification email.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="w-full rounded-lg">
            <Link to={success ? '/dashboard' : '/login'}>
              {success ? 'Go to dashboard' : 'Back to sign in'}
            </Link>
          </Button>
          {!success && (
            <Button asChild variant="outline" className="w-full rounded-lg">
              <Link to="/login">Resend verification</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
