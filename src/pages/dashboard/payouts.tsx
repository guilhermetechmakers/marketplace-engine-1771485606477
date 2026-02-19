import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPayoutsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
        <p className="mt-1 text-muted-foreground">Balance and payout schedule.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Available balance</CardTitle>
          <CardDescription>Stripe Connect payouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">—</p>
          <p className="mt-2 text-sm text-muted-foreground">Next payout: —</p>
        </CardContent>
      </Card>
    </div>
  )
}
