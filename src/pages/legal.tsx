import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type LegalPageProps = { title: string; slug: string }

export function LegalPage({ title, slug }: LegalPageProps) {
  return (
    <div className="container-tight py-12">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none">
          <p>Legal content for {slug}. Text sections, download/print, consent controls.</p>
        </CardContent>
      </Card>
    </div>
  )
}
