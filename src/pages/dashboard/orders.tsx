import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-muted-foreground">View and manage your orders.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Order list</CardTitle>
          <CardDescription>Transactions with filters and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          <Button className="mt-4">Place an order</Button>
        </CardContent>
      </Card>
    </div>
  )
}
