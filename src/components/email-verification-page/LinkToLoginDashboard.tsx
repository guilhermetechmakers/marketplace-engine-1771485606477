import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogIn, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LinkToLoginDashboardProps {
  /** If true, show primary CTA to dashboard; if false, show CTA to login. */
  verified: boolean
  /** Optional class for the container. */
  className?: string
}

/**
 * Renders the appropriate primary link: Dashboard after success, Login after failure or as secondary.
 * Includes optional secondary link for the other destination.
 * Gradient buttons and hover effects per design reference.
 */
export function LinkToLoginDashboard({ verified, className }: LinkToLoginDashboardProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {verified ? (
        <>
          <Button
            asChild
            className="w-full rounded-lg bg-gradient-to-r from-accent to-accent/90 px-6 py-6 text-base font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
            size="lg"
          >
            <Link to="/dashboard" className="flex items-center justify-center gap-2">
              <LayoutDashboard className="h-5 w-5" aria-hidden />
              Go to dashboard
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              sign in to a different account
            </Link>
          </p>
        </>
      ) : (
        <>
          <Button
            asChild
            className="w-full rounded-lg bg-gradient-to-r from-accent to-accent/90 px-6 py-6 text-base font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
            size="lg"
          >
            <Link to="/login" className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" aria-hidden />
              Back to sign in
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
