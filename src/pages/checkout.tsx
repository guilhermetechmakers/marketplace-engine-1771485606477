import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CheckoutPage() {
  return (
    <div className="container-tight py-8">
      <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
      <p className="mt-1 text-muted-foreground">Order summary, payment (Stripe Elements), place order.</p>
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Price breakdown, payer details, promo code, policy checkbox.</p>
          <Button className="mt-4">Place order</Button>
        </CardContent>
      </Card>
    </div>
  )
}
