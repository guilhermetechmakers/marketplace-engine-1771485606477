import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardModerationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Moderation queue</h1>
        <p className="mt-1 text-muted-foreground">Listings, reviews, users, disputes.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Queues</CardTitle>
          <CardDescription>Tabs: listings, reviews, users, disputes. Bulk actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Queue tabs and item detail placeholder.</p>
        </CardContent>
      </Card>
    </div>
  )
}
