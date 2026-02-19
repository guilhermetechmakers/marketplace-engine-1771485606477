import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">This page could not be found.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/search">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Link>
        </Button>
      </div>
    </div>
  )
}
