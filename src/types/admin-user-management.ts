/** Schema type for admin_user_management_page table */
export interface AdminUserManagementPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** User record as shown in admin list (from auth + profiles; backend can aggregate) */
export interface AdminUserListItem {
  id: string
  user_id: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  status: 'active' | 'suspended' | 'banned'
  kyc_status: 'pending' | 'verified' | 'rejected' | 'none'
  created_at: string
  updated_at?: string
  title?: string
  description?: string
}

/** Filters for the admin user list */
export interface AdminUserFilters {
  search?: string
  role?: AdminUserListItem['role'] | ''
  status?: AdminUserListItem['status'] | ''
  kyc_status?: AdminUserListItem['kyc_status'] | ''
}

/** Pagination params */
export interface AdminUserListParams extends AdminUserFilters {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/** API response for paginated user list */
export interface AdminUserListResponse {
  data: AdminUserListItem[]
  total: number
  page: number
  pageSize: number
}
