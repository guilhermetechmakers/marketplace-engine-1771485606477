import { useState } from 'react'
import { Download, UserCog, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { assignRole } from '@/api/admin-users'
import type { AdminUserListItem } from '@/types/admin-user-management'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ROLES: AdminUserListItem['role'][] = ['buyer', 'seller', 'admin']

export interface ExportCSVAndRoleAssignmentProps {
  users: AdminUserListItem[]
  selectedIds: string[]
  onRoleAssigned: () => void
  disabled?: boolean
}

/** Export current page (or selected) users to CSV */
function exportToCSV(users: AdminUserListItem[], filename = 'admin-users.csv') {
  if (users.length === 0) {
    toast.error('No users to export')
    return
  }
  const headers = ['id', 'user_id', 'email', 'role', 'status', 'kyc_status', 'created_at']
  const rows = users.map((u) =>
    [
      u.id,
      u.user_id,
      u.email,
      u.role,
      u.status,
      u.kyc_status,
      u.created_at ? new Date(u.created_at).toISOString() : '',
    ].map((c) => (typeof c === 'string' && c.includes(',') ? `"${c}"` : c))
  )
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
  toast.success('CSV exported')
}

export function ExportCSVAndRoleAssignment({
  users,
  selectedIds,
  onRoleAssigned: _onRoleAssigned,
  disabled = false,
}: ExportCSVAndRoleAssignmentProps) {
  const [exporting, setExporting] = useState(false)

  const usersToExport =
    selectedIds.length > 0
      ? users.filter((u) => selectedIds.includes(u.id))
      : users

  const handleExport = () => {
    setExporting(true)
    try {
      exportToCSV(usersToExport)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={disabled || usersToExport.length === 0 || exporting}
        className="hover:scale-[1.02] active:scale-[0.98]"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="sr-only sm:not-sr-only sm:ml-2">
          Export CSV{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
        </span>
      </Button>
      {/* Role assignment is per-row via RoleAssignmentButton in the table */}
    </div>
  )
}

/** Button to open role assignment for a single user (e.g. in table row) */
export function RoleAssignmentButton({
  userId,
  currentRole,
  onAssigned,
  className,
}: {
  userId: string
  currentRole: AdminUserListItem['role']
  onAssigned: () => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<AdminUserListItem['role']>(currentRole)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await assignRole(userId, role)
      toast.success('Role updated')
      onAssigned()
      setOpen(false)
    } catch {
      toast.error('Failed to update role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setRole(currentRole)
          setOpen(true)
        }}
        className={cn('hover:scale-[1.02] active:scale-[0.98]', className)}
        aria-label="Assign role"
      >
        <UserCog className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign role</DialogTitle>
            <DialogDescription>Select a new role for this user.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AdminUserListItem['role'])}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { exportToCSV }
