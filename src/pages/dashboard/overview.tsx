import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Search, MessageSquare, Package, TrendingUp, DollarSign } from 'lucide-react'

const role = (localStorage.getItem('user_role') as 'buyer' | 'seller' | 'admin') ?? 'buyer'

export function DashboardOverviewPage() {
  if (role === 'seller') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seller dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your listings, orders, and payouts.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Listing views', value: '—', icon: TrendingUp },
            { label: 'Earnings', value: '—', icon: DollarSign },
            { label: 'Active listings', value: '0', icon: Package },
            { label: 'Pending orders', value: '0', icon: ShoppingBag },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Create a listing or view orders.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link to="/listings/new">Create listing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/orders">View orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (role === 'admin') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin dashboard</h1>
          <p className="mt-1 text-muted-foreground">Platform metrics, moderation, and configuration.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'GMV', value: '—', icon: DollarSign },
            { label: 'Active users', value: '—', icon: TrendingUp },
            { label: 'Moderation queue', value: '0', icon: Package },
            { label: 'Open disputes', value: '0', icon: MessageSquare },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Shortcuts</CardTitle>
            <CardDescription>Configuration console, moderation, disputes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/dashboard/config">Configuration console</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/moderation">Moderation queue</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/disputes">Disputes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Buyer
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Buyer dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your orders, saved items, and messages.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active orders', value: '0', icon: ShoppingBag },
          { label: 'Saved searches', value: '0', icon: Search },
          { label: 'Unread messages', value: '0', icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Your latest orders and messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity.</p>
          <Button asChild className="mt-4">
            <Link to="/search">Discover listings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
