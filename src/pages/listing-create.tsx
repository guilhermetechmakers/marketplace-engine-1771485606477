import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ListingCreatePage() {
  return (
    <div className="container-tight py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create listing</h1>
        <p className="mt-1 text-muted-foreground">Category selector, dynamic form, media, preview.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Category & schema</CardTitle>
          <CardDescription>Dynamic form from category config. Save draft / Publish.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Save draft</Button>
          <Button className="ml-2">Publish</Button>
        </CardContent>
      </Card>
    </div>
  )
}
