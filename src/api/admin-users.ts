import {
  apiGet,
  apiPost,
  apiPatch,
  type ApiError,
} from '@/lib/api'
import type {
  AdminUserListItem,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserManagementPage,
} from '@/types/admin-user-management'

/** Fetch paginated admin user list. Backend should be implemented as Supabase Edge Function. */
export async function fetchAdminUserList(
  params: AdminUserListParams
): Promise<AdminUserListResponse> {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set('page', String(params.page))
  if (params.pageSize != null) sp.set('pageSize', String(params.pageSize))
  if (params.search) sp.set('search', params.search)
  if (params.role) sp.set('role', params.role)
  if (params.status) sp.set('status', params.status)
  if (params.kyc_status) sp.set('kyc_status', params.kyc_status)
  if (params.sortBy) sp.set('sortBy', params.sortBy)
  if (params.sortDir) sp.set('sortDir', params.sortDir)
  const qs = sp.toString()
  const path = qs ? `/admin/users?${qs}` : '/admin/users'
  return apiGet<AdminUserListResponse>(path)
}

/** Fetch single user for detail modal. */
export async function fetchAdminUser(
  userId: string
): Promise<AdminUserListItem | null> {
  try {
    return await apiGet<AdminUserListItem>(`/admin/users/${userId}`)
  } catch {
    return null
  }
}

/** Suspend user. Server-side only (Edge Function). */
export async function suspendUser(userId: string): Promise<void> {
  await apiPost(`/admin/users/${userId}/suspend`, {})
}

/** Ban user. Server-side only (Edge Function). */
export async function banUser(userId: string): Promise<void> {
  await apiPost(`/admin/users/${userId}/ban`, {})
}

/** Verify KYC for user. Server-side only (Edge Function). */
export async function verifyKyc(userId: string): Promise<void> {
  await apiPost(`/admin/users/${userId}/verify-kyc`, {})
}

/** Assign role. Server-side only (Edge Function). */
export async function assignRole(
  userId: string,
  role: AdminUserListItem['role']
): Promise<void> {
  await apiPatch(`/admin/users/${userId}/role`, { role })
}

/** Impersonation: get token/session to act as user. Server-side only (Edge Function). */
export async function impersonateUser(userId: string): Promise<{ token: string }> {
  return apiPost<{ token: string }>(`/admin/users/${userId}/impersonate`, {})
}

/** Create/update admin_user_management_page record if needed. */
export async function upsertAdminUserManagementPage(
  payload: Partial<AdminUserManagementPage> & { user_id: string; title: string }
): Promise<AdminUserManagementPage> {
  return apiPost<AdminUserManagementPage>('/admin/user-management-page', payload)
}

export type { ApiError }
