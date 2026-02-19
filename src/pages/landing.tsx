import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, Zap, Shield, Palette } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary/30 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(76,175,80,0.15),transparent)]" />
        <div className="container-tight relative flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Launch your marketplace in days, not months
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            A configurable two-sided marketplace engine. Buyers, sellers, dynamic listings, and payments—ready to go.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px] shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <Link to="/signup">Create marketplace</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link to="/search">Discover listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - 3 steps */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container-tight">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Three steps to go live with your niche marketplace.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Configure', desc: 'Define categories, schemas, and fees in the Configuration Console.', icon: Palette },
              { step: '2', title: 'Onboard sellers', desc: 'Sellers complete KYC and Stripe Connect; add listings with your schema.', icon: Shield },
              { step: '3', title: 'Go live', desc: 'Buyers discover, checkout, and pay. You earn commission on every transaction.', icon: Zap },
            ].map(({ step, title, desc, icon: Icon }) => (
              <Card key={step} className="animate-fade-in-up border-border bg-card">
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
        </div>
      </section>

      {/* Features Overview - Bento-style grid */}
      <section className="border-t border-border bg-secondary/30 py-16 md:py-24">
        <div className="container-tight">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            Built for operators
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Everything you need to run a trusted marketplace.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Dynamic listing schemas per category',
              'Checkout, booking & inquiry flows',
              'Stripe Connect payouts',
              'Reviews & moderation',
              'In-app messaging',
              'Disputes & refunds',
            ].map((feature, i) => (
              <Card key={feature} className="animate-fade-in-up bg-card" style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="flex flex-row items-center gap-3 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span className="font-medium text-foreground">{feature}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container-tight text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Commission-based. No upfront platform fee. Scale with your GMV.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/signup">
              Get started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 py-12">
        <div className="container-tight flex flex-col items-center justify-between gap-6 md:flex-row">
          <span className="font-semibold text-foreground">Marketplace Engine</span>
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
