import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gavel } from 'lucide-react'

export function DashboardDisputesPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Disputes</h1>
        <p className="mt-1 text-muted-foreground">Case management, evidence, refunds.</p>
      </div>
      <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Dispute & refund cases</CardTitle>
          <CardDescription>Case timeline, action panel, reconciliation, export.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-muted-foreground">Manage disputes and refund cases in one place.</p>
          <Button asChild className="hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/dashboard/dispute-refund-case-page" className="inline-flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Open case management
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
