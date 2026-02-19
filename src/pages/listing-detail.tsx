import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container-tight py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full rounded-2xl bg-secondary" />
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-foreground">Listing {id ?? '—'}</h1>
              <p className="mt-2 text-muted-foreground">Dynamic attributes from schema. Availability calendar.</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24 border-border bg-card">
            <CardContent className="p-6">
              <p className="text-2xl font-bold text-foreground">Price —</p>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 rounded-lg">Buy / Book / Request quote</Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Seller sidebar, ratings, messaging access.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
