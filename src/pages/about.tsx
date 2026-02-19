import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutPage() {
  return (
    <div className="container-tight py-12">
      <h1 className="text-3xl font-bold text-foreground">About</h1>
      <p className="mt-2 text-muted-foreground">FAQ search, contact form, docs links.</p>
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle>About Marketplace Engine</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none">
          <p>Configurable two-sided marketplace engine. Built for operators and sellers.</p>
        </CardContent>
      </Card>
    </div>
  )
}
