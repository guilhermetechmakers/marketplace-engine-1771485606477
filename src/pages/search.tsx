import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon } from 'lucide-react'

export function SearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="container-tight py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Discover</h1>
        <p className="mt-1 text-muted-foreground">Search and filter listings.</p>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Keywords, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg pl-10"
          />
        </div>
        <Button className="rounded-lg">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="aspect-video rounded-lg bg-secondary" />
              <p className="mt-2 font-medium text-foreground">Listing placeholder {i}</p>
              <p className="text-sm text-muted-foreground">Price —</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Dynamic filters and map toggle placeholder.</p>
    </div>
  )
}
