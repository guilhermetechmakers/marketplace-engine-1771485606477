import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Role = 'buyer' | 'seller' | 'operator'

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('buyer')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) return
    setIsLoading(true)
    try {
      localStorage.setItem('user_role', role)
      await new Promise((r) => setTimeout(r, 500))
      if (role === 'seller') navigate('/onboarding')
      else navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card shadow-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Choose your role and complete signup.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground">Min 8 characters, include letters and numbers.</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2 rounded-lg border border-input p-2">
                {(['buyer', 'seller', 'operator'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      role === r ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
              />
              <span className="text-sm text-muted-foreground">
                I agree to the <Link to="/terms" className="text-accent hover:underline">Terms</Link> and{' '}
                <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
              </span>
            </label>
            <Button type="submit" className="w-full rounded-lg" disabled={!acceptTerms || isLoading}>
              {isLoading ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            After signing up, check your email to verify your account.{' '}
            <Link to="/email-verification-page" className="font-medium text-accent hover:underline">
              Verification page
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
