import { useState, useCallback } from 'react'
import { Search, User, Shield, Ban, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { AdminUserListItem, AdminUserFilters } from '@/types/admin-user-management'
import {
  suspendUser,
  banUser,
  verifyKyc,
  impersonateUser,
  fetchAdminUser,
} from '@/api/admin-users'
import { toast } from 'sonner'

export interface SearchFiltersUserDetailModalProps {
  filters: AdminUserFilters
  onFiltersChange: (f: AdminUserFilters) => void
  onRefresh: () => void
}

const ROLE_OPTIONS: { value: AdminUserFilters['role']; label: string }[] = [
  { value: '', label: 'All roles' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS: { value: AdminUserFilters['status']; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'banned', label: 'Banned' },
]

const KYC_OPTIONS: { value: AdminUserFilters['kyc_status']; label: string }[] = [
  { value: '', label: 'All KYC' },
  { value: 'none', label: 'None' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
]

export function SearchFilters({
  filters,
  onFiltersChange,
}: Pick<SearchFiltersUserDetailModalProps, 'filters' | 'onFiltersChange'>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by email..."
          value={filters.search ?? ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value || undefined })
          }
          className="pl-9"
          aria-label="Search users"
        />
      </div>
      <Select
        value={filters.role === '' || filters.role == null ? '__all__' : filters.role}
        onValueChange={(v) =>
          onFiltersChange({
            ...filters,
            role: v === '__all__' ? undefined : (v as AdminUserFilters['role']),
          })
        }
      >
        <SelectTrigger aria-label="Filter by role">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((o) => (
            <SelectItem key={o.value || '__all__'} value={o.value || '__all__'}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.status === '' || filters.status == null ? '__all__' : filters.status}
        onValueChange={(v) =>
          onFiltersChange({
            ...filters,
            status: v === '__all__' ? undefined : (v as AdminUserFilters['status']),
          })
        }
      >
        <SelectTrigger aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value || '__all__'} value={o.value || '__all__'}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.kyc_status === '' || filters.kyc_status == null ? '__all__' : filters.kyc_status}
        onValueChange={(v) =>
          onFiltersChange({
            ...filters,
            kyc_status: v === '__all__' ? undefined : (v as AdminUserFilters['kyc_status']),
          })
        }
      >
        <SelectTrigger aria-label="Filter by KYC">
          <SelectValue placeholder="KYC" />
        </SelectTrigger>
        <SelectContent>
          {KYC_OPTIONS.map((o) => (
            <SelectItem key={o.value || '__all__'} value={o.value || '__all__'}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export interface UserDetailModalProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh: () => void
}

export function UserDetailModal({
  userId,
  open,
  onOpenChange,
  onRefresh,
}: UserDetailModalProps) {
  const [user, setUser] = useState<AdminUserListItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadUser = useCallback(async (id: string) => {
    setLoading(true)
    setUser(null)
    try {
      const u = await fetchAdminUser(id)
      setUser(u ?? null)
    } catch {
      toast.error('Failed to load user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleOpen = useCallback(
    (isOpen: boolean) => {
      if (isOpen && userId) loadUser(userId)
      if (!isOpen) setUser(null)
      onOpenChange(isOpen)
    },
    [userId, loadUser, onOpenChange]
  )

  const runAction = async (
    key: string,
    fn: () => Promise<unknown>,
    successMessage: string
  ) => {
    if (!userId) return
    setActionLoading(key)
    try {
      await fn()
      toast.success(successMessage)
      onRefresh()
      if (user) setUser({ ...user })
      const u = await fetchAdminUser(userId)
      setUser(u ?? null)
    } catch {
      toast.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User details
          </DialogTitle>
          <DialogDescription>
            View and manage this user. Actions apply immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge
                  variant={
                    user.status === 'active'
                      ? 'success'
                      : user.status === 'suspended'
                        ? 'warning'
                        : 'default'
                  }
                >
                  {user.status}
                </Badge>
                <Badge
                  variant={
                    user.kyc_status === 'verified'
                      ? 'success'
                      : user.kyc_status === 'rejected'
                        ? 'warning'
                        : 'outline'
                  }
                >
                  KYC: {user.kyc_status}
                </Badge>
              </div>
              {user.created_at && (
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">User not found.</p>
          )}
        </div>
        {user && (
          <DialogFooter className="flex flex-wrap gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                runAction(
                  'impersonate',
                  () => impersonateUser(user.id),
                  'Impersonation started'
                )
              }
              disabled={!!actionLoading}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLoading === 'impersonate' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Impersonate</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                runAction(
                  'suspend',
                  () => suspendUser(user.id),
                  'User suspended'
                )
              }
              disabled={!!actionLoading || user.status === 'suspended'}
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLoading === 'suspend' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Suspend
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() =>
                runAction('ban', () => banUser(user.id), 'User banned')
              }
              disabled={!!actionLoading || user.status === 'banned'}
            >
              {actionLoading === 'ban' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Ban
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() =>
                runAction(
                  'verify-kyc',
                  () => verifyKyc(user.id),
                  'KYC verified'
                )
              }
              disabled={
                !!actionLoading || user.kyc_status === 'verified'
              }
              className="hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLoading === 'verify-kyc' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Verify KYC
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function SearchFiltersUserDetailModal({
  filters,
  onFiltersChange,
  onRefresh,
  detailUserId,
  detailOpen,
  onDetailOpenChange,
}: SearchFiltersUserDetailModalProps & {
  detailUserId: string | null
  detailOpen: boolean
  onDetailOpenChange: (open: boolean, userId?: string) => void
}) {
  return (
    <>
      <SearchFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      <UserDetailModal
        userId={detailUserId}
        open={detailOpen}
        onOpenChange={(open) => onDetailOpenChange(open)}
        onRefresh={onRefresh}
      />
    </>
  )
}
