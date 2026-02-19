import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function OrdersPage() {
  return (
    <div className="container-tight py-8">
      <h1 className="text-3xl font-bold text-foreground">Order history</h1>
      <p className="mt-1 text-muted-foreground">Transactions list, filters, detailed view, receipts, dispute.</p>
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No orders.</p>
          <Button className="mt-4">Start shopping</Button>
        </CardContent>
      </Card>
    </div>
  )
}
