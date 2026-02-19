import { Outlet } from 'react-router-dom'
import { MainNav } from './main-nav'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
