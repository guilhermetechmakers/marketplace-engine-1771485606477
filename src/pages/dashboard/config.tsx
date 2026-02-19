import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardConfigPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuration console</h1>
        <p className="mt-1 text-muted-foreground">Taxonomy, schemas, fees, feature flags.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Schema & taxonomy</CardTitle>
          <CardDescription>Schema builder, fees & commissions, preview, versioning.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Taxonomy editor and schema builder placeholder.</p>
        </CardContent>
      </Card>
    </div>
  )
}
