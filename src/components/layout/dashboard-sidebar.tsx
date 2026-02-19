import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  Shield,
  MessageSquare,
  FileText,
  AlertCircle,
  Gavel,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SIDEBAR_COLLAPSED_KEY = 'marketplace-sidebar-collapsed'

const buyerNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const sellerNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/listings', label: 'Listings', icon: Package },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/payouts', label: 'Payouts', icon: FileText },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const adminNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/users', label: 'Users', icon: Users },
  { to: '/dashboard/admin-user-management-page', label: 'User management', icon: Users },
  { to: '/dashboard/moderation', label: 'Moderation', icon: Shield },
  { to: '/dashboard/disputes', label: 'Disputes', icon: AlertCircle },
  { to: '/dashboard/dispute-refund-case-page', label: 'Case management', icon: Gavel },
  { to: '/dashboard/config', label: 'Configuration', icon: Settings },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

type Role = 'buyer' | 'seller' | 'admin'

export function DashboardSidebar({ role = 'buyer' }: { role?: Role }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  const nav = role === 'admin' ? adminNav : role === 'seller' ? sellerNav : buyerNav

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-56'
      )}
      aria-label="Dashboard sidebar"
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!collapsed && (
          <Link to="/dashboard" className="font-semibold text-accent">
            Dashboard
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-2" aria-label="Dashboard navigation">
        {nav.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
