import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/search', label: 'Discover' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
]

export function MainNav() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-tight flex h-14 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90"
          aria-label="Home"
        >
          <span className="text-lg font-bold text-accent">Marketplace</span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/search')}
            aria-label="Search"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/login')}
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            className="hidden sm:inline-flex"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
          <Button
            className="hidden sm:inline-flex"
            onClick={() => navigate('/signup')}
          >
            Get started
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="animate-fade-in border-t border-border bg-background px-4 py-4 md:hidden"
          role="dialog"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                Sign in
              </Button>
              <Button className="flex-1" onClick={() => { navigate('/signup'); setMobileOpen(false); }}>
                Get started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
