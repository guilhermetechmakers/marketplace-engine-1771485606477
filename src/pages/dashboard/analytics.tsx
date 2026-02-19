import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Charts and reports.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>GMV, conversion, disputes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Charts placeholder. Use Recharts for dashboards.</p>
        </CardContent>
      </Card>
    </div>
  )
}
