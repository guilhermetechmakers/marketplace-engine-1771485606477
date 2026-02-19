import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardMessagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">Threads with buyers and sellers.</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Conversations tied to listings and orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
