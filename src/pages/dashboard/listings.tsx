import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DashboardListingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Listings</h1>
          <p className="mt-1 text-muted-foreground">Manage your listings and drafts.</p>
        </div>
        <Button asChild>
          <Link to="/listings/new">Create listing</Link>
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Your listings</CardTitle>
          <CardDescription>Draft and published listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No listings yet.</p>
          <Button asChild className="mt-4">
            <Link to="/listings/new">Create your first listing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
