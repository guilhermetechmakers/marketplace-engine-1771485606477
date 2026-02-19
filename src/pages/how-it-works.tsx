import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Shield, Zap } from 'lucide-react'

export function HowItWorksPage() {
  return (
    <div className="container-tight py-12">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">How it works</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Three steps to go live with your niche marketplace.</p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {[
          { title: 'Configure', desc: 'Define categories, schemas, and fees in the Configuration Console.', icon: Palette },
          { title: 'Onboard sellers', desc: 'Sellers complete KYC and Stripe Connect; add listings.', icon: Shield },
          { title: 'Go live', desc: 'Buyers discover, checkout, and pay. You earn commission.', icon: Zap },
        ].map(({ title, desc, icon: Icon }) => (
          <Card key={title} className="border-border bg-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link to="/signup">Create marketplace</Link>
        </Button>
      </div>
    </div>
  )
}
