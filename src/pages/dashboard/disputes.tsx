import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardDisputesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Disputes</h1>
        <p className="mt-1 text-muted-foreground">Case management, evidence, refunds.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Dispute & refund cases</CardTitle>
          <CardDescription>Case timeline, action panel, export.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No open disputes.</p>
        </CardContent>
      </Card>
    </div>
  )
}
