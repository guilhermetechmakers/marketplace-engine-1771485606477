import { useState, useEffect, useCallback } from 'react'
import { Users, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { SearchFiltersUserDetailModal } from '@/components/admin-user-management-page/SearchFiltersUserDetailModal'
import {
  ExportCSVAndRoleAssignment,
  RoleAssignmentButton,
} from '@/components/admin-user-management-page/ExportCSVAndRoleAssignment'
import { fetchAdminUserList } from '@/api/admin-users'
import type {
  AdminUserListItem,
  AdminUserFilters,
} from '@/types/admin-user-management'
import { toast } from 'sonner'

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export default function AdminUserManagementPage() {
  const [filters, setFilters] = useState<AdminUserFilters>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState<AdminUserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailUserId, setDetailUserId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAdminUserList({
        ...filters,
        page,
        pageSize,
        sortBy: 'created_at',
        sortDir: 'desc',
      })
      setData(res.data)
      setTotal(res.total)
    } catch (e) {
      const message = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to load users'
      setError(message)
      toast.error(message)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [filters, page, pageSize])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const allSelected = data.length > 0 && selectedIds.size === data.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(data.map((u) => u.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const openDetail = (id: string) => {
    setDetailUserId(id)
    setDetailOpen(true)
  }

  const handleDetailOpenChange = (open: boolean, _userId?: string) => {
    setDetailOpen(open)
    if (!open) setDetailUserId(null)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User management</h1>
        <p className="mt-1 text-muted-foreground">
          Search, view, and take actions on user accounts.
        </p>
      </div>

      <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
              <CardDescription>
                Filter, sort, and manage users. Use row actions for impersonation, suspend, ban, KYC, and role assignment.
              </CardDescription>
            </div>
            <ExportCSVAndRoleAssignment
              users={data}
              selectedIds={Array.from(selectedIds)}
              onRoleAssigned={fetchUsers}
              disabled={loading}
            />
          </div>
          <SearchFiltersUserDetailModal
            filters={filters}
            onFiltersChange={(f) => {
              setFilters(f)
              setPage(1)
            }}
            onRefresh={fetchUsers}
            detailUserId={detailUserId}
            detailOpen={detailOpen}
            onDetailOpenChange={handleDetailOpenChange}
          />
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fetchUsers()}
              >
                Retry
              </Button>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-border">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full animate-pulse" />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">No users found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting filters or search.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({})
                    setPage(1)
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="sticky top-0 bg-muted/80 backdrop-blur sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">KYC</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((user) => (
                      <TableRow
                        key={user.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(user.id)}
                            onCheckedChange={() => toggleSelect(user.id)}
                            aria-label={`Select ${user.email}`}
                          />
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => openDetail(user.id)}
                            className="font-medium text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                          >
                            {user.email}
                          </button>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
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
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              user.kyc_status === 'verified'
                                ? 'success'
                                : user.kyc_status === 'rejected'
                                  ? 'warning'
                                  : 'outline'
                            }
                          >
                            {user.kyc_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetail(user.id)}
                              className="h-8 w-8 hover:scale-105"
                              aria-label={`View ${user.email}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <RoleAssignmentButton
                              userId={user.id}
                              currentRole={user.role}
                              onAssigned={fetchUsers}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:scale-105"
                                  aria-label="More actions"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openDetail(user.id)}>
                                  View details (impersonate, suspend, ban, verify KYC)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, total)} of {total}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Per page</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value))
                          setPage(1)
                        }}
                        className="h-9 rounded-lg border border-input bg-background px-2 text-sm focus:ring-2 focus:ring-accent"
                        aria-label="Items per page"
                      >
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[6rem] text-center text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
