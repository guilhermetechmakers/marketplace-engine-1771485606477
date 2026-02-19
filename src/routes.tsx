import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { PasswordResetPage } from '@/pages/password-reset'
import { EmailVerificationPage } from '@/pages/email-verification'
import { SearchPage } from '@/pages/search'
import { ListingDetailPage } from '@/pages/listing-detail'
import { ListingCreatePage } from '@/pages/listing-create'
import { CheckoutPage } from '@/pages/checkout'
import { OrdersPage } from '@/pages/orders'
import { OnboardingPage } from '@/pages/onboarding'
import { AboutPage } from '@/pages/about'
import { HowItWorksPage } from '@/pages/how-it-works'
import { LegalPage } from '@/pages/legal'
import { NotFoundPage } from '@/pages/not-found'
import { ErrorPage } from '@/pages/error'
import { DashboardOverviewPage } from '@/pages/dashboard/overview'
import { DashboardOrdersPage } from '@/pages/dashboard/orders'
import { DashboardListingsPage } from '@/pages/dashboard/listings'
import { DashboardPayoutsPage } from '@/pages/dashboard/payouts'
import { DashboardMessagesPage } from '@/pages/dashboard/messages'
import { DashboardAnalyticsPage } from '@/pages/dashboard/analytics'
import { DashboardUsersPage } from '@/pages/dashboard/users'
import { DashboardModerationPage } from '@/pages/dashboard/moderation'
import { DashboardConfigPage } from '@/pages/dashboard/config'
import { DashboardSettingsPage } from '@/pages/dashboard/settings'
import { DashboardDisputesPage } from '@/pages/dashboard/disputes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
      { path: 'email-verification', element: <EmailVerificationPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'listings/new', element: <ListingCreatePage /> },
      { path: 'listings/:id', element: <ListingDetailPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'privacy', element: <LegalPage title="Privacy Policy" slug="privacy" /> },
      { path: 'terms', element: <LegalPage title="Terms of Service" slug="terms" /> },
      { path: 'cookies', element: <LegalPage title="Cookie Policy" slug="cookies" /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverviewPage /> },
      { path: 'orders', element: <DashboardOrdersPage /> },
      { path: 'listings', element: <DashboardListingsPage /> },
      { path: 'payouts', element: <DashboardPayoutsPage /> },
      { path: 'messages', element: <DashboardMessagesPage /> },
      { path: 'analytics', element: <DashboardAnalyticsPage /> },
      { path: 'users', element: <DashboardUsersPage /> },
      { path: 'moderation', element: <DashboardModerationPage /> },
      { path: 'config', element: <DashboardConfigPage /> },
      { path: 'disputes', element: <DashboardDisputesPage /> },
      { path: 'settings', element: <DashboardSettingsPage /> },
    ],
  },
  { path: '/404', element: <NotFoundPage /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
])
