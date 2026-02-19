import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User management</h1>
        <p className="mt-1 text-muted-foreground">Admin user operations.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Search and manage users.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Filterable list placeholder.</p>
        </CardContent>
      </Card>
    </div>
  )
}
