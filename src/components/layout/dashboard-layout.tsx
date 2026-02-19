import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from './dashboard-sidebar'

export function DashboardLayout() {
  const role = (localStorage.getItem('user_role') as 'buyer' | 'seller' | 'admin') ?? 'buyer'

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-4 border-b border-border px-4">
          <Link
            to="/search"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Search
          </Link>
          <Link
            to="/dashboard/settings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
