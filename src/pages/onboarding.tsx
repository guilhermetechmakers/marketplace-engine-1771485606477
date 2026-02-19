import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function OnboardingPage() {
  return (
    <div className="container-tight py-8">
      <h1 className="text-3xl font-bold text-foreground">Seller onboarding</h1>
      <p className="mt-1 text-muted-foreground">Profile, ID upload, Stripe Connect, tax, first listing.</p>
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle>Multi-step wizard</CardTitle>
          <CardDescription>Progress indicator, document upload, Stripe Connect link.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Continue</Button>
        </CardContent>
      </Card>
    </div>
  )
}
