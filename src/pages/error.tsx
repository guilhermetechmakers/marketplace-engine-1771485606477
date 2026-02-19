import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  const errorId = typeof window !== 'undefined' ? `E-${Date.now()}` : 'E-500'

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-foreground">500</h1>
      <p className="mt-4 text-lg text-muted-foreground">Something went wrong. Please try again.</p>
      <p className="mt-2 text-sm text-muted-foreground">Error ID: {errorId}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  )
}
