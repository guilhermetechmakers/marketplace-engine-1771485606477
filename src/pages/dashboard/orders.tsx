import * as React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShoppingBag,
  ChevronLeft,
  Eye,
  FileText,
  AlertCircle,
  Filter,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  fetchOrderList,
  fetchOrderDetail,
  fetchOrderReceipt,
} from '@/api/order-booking-history'
import type { Order, OrderDetail } from '@/types/order-booking-history'
import { toast } from 'sonner'

const PAGE_SIZE_OPTIONS = [10, 25, 50]
const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

function formatAmount(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

function statusVariant(status: string): 'default' | 'secondary' | 'success' | 'warning' | 'outline' {
  switch (status) {
    case 'delivered':
    case 'paid':
    case 'refunded':
      return 'success'
    case 'cancelled':
      return 'secondary'
    case 'shipped':
    case 'processing':
      return 'warning'
    default:
      return 'outline'
  }
}

export function DashboardOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const role = (localStorage.getItem('user_role') as 'buyer' | 'seller' | 'admin') ?? 'buyer'
  const viewRole = role === 'seller' ? 'seller' : 'buyer'

  const [listData, setListData] = React.useState<Order[]>([])
  const [listTotal, setListTotal] = React.useState(0)
  const [listPage, setListPage] = React.useState(1)
  const [listPageSize, setListPageSize] = React.useState(10)
  const [statusFilter, setStatusFilter] = React.useState('')
  const [listingIdFilter, setListingIdFilter] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')
  const [listLoading, setListLoading] = React.useState(true)
  const [listError, setListError] = React.useState<string | null>(null)

  const [orderDetail, setOrderDetail] = React.useState<OrderDetail | null>(null)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [detailError, setDetailError] = React.useState<string | null>(null)
  const [receiptLoading, setReceiptLoading] = React.useState(false)

  const fetchList = React.useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const res = await fetchOrderList({
        page: listPage,
        pageSize: listPageSize,
        status: statusFilter || undefined,
        listingId: listingIdFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        role: viewRole,
      })
      setListData(res.data)
      setListTotal(res.total)
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load orders'
      setListError(msg)
      toast.error(msg)
      setListData([])
      setListTotal(0)
    } finally {
      setListLoading(false)
    }
  }, [listPage, listPageSize, statusFilter, listingIdFilter, dateFrom, dateTo, viewRole])

  const fetchDetail = React.useCallback(async (id: string) => {
    setDetailLoading(true)
    setDetailError(null)
    try {
      const res = await fetchOrderDetail(id)
      setOrderDetail(res ?? null)
      if (!res) {
        setDetailError('Order not found')
        toast.error('Order not found')
      }
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load order'
      setDetailError(msg)
      toast.error(msg)
      setOrderDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const handleFetchReceipt = React.useCallback(async (id: string) => {
    setReceiptLoading(true)
    try {
      const res = await fetchOrderReceipt(id)
      if (res?.receipt_pdf_url) {
        window.open(res.receipt_pdf_url, '_blank')
        toast.success('Receipt opened')
      } else {
        toast.info('Receipt not yet available')
      }
    } catch (e) {
      toast.error('Failed to fetch receipt')
    } finally {
      setReceiptLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchList()
  }, [fetchList])

  React.useEffect(() => {
    if (orderId) fetchDetail(orderId)
    else setOrderDetail(null)
  }, [orderId, fetchDetail])

  const totalPages = Math.max(1, Math.ceil(listTotal / listPageSize))

  const applyFilters = () => {
    setListPage(1)
    fetchList()
  }

  if (orderId) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchParams({})}
              aria-label="Back to orders"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order details</h1>
              <p className="mt-1 text-muted-foreground">
                Line items, state timeline, payment & payout metadata
              </p>
            </div>
          </div>
        </div>

        {detailError && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-destructive">{detailError}</p>
              <Button variant="outline" size="sm" onClick={() => setSearchParams({})}>
                Back to list
              </Button>
            </CardContent>
          </Card>
        )}

        {detailLoading && !orderDetail ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : orderDetail ? (
          <div className="grid gap-8 lg:grid-cols-1">
            <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Order #{orderDetail.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      {formatAmount(orderDetail.total_amount_cents, orderDetail.currency)} · {orderDetail.status}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(orderDetail.status)}>{orderDetail.status}</Badge>
                    {orderDetail.dispute_case_id && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/dispute-refund-case-page/${orderDetail.dispute_case_id}`}>
                          <AlertCircle className="h-4 w-4" />
                          View dispute
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleFetchReceipt(orderDetail.id)}
                      disabled={receiptLoading}
                      className="hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FileText className="h-4 w-4" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Line items</h4>
                  {orderDetail.line_items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No line items</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Unit price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetail.line_items.map((item) => (
                          <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {formatAmount(item.unit_price_cents, orderDetail.currency)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatAmount(item.total_cents, orderDetail.currency)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                {orderDetail.state_timeline.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-foreground">State timeline</h4>
                    <ul className="space-y-2">
                      {orderDetail.state_timeline.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-4 py-2 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {entry.from_status ?? '—'} → {entry.to_status}
                          </span>
                          {entry.note && (
                            <span className="text-muted-foreground">· {entry.note}</span>
                          )}
                          <time
                            dateTime={entry.created_at}
                            className="ml-auto text-xs text-muted-foreground"
                          >
                            {new Date(entry.created_at).toLocaleString()}
                          </time>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {orderDetail.message_thread_id && (
                  <p className="text-sm text-muted-foreground">
                    Message thread: {orderDetail.message_thread_id}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your {viewRole === 'seller' ? 'incoming' : ''} orders.
        </p>
      </div>

      <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order list
          </CardTitle>
          <CardDescription>
            Paginated list with filters (status, date range, listing id)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="grid gap-1">
                <Label htmlFor="status-filter" className="text-xs">Status</Label>
                <Select value={statusFilter || '__all__'} onValueChange={(v) => setStatusFilter(v === '__all__' ? '' : v)}>
                  <SelectTrigger id="status-filter" className="w-[140px]">
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
              </div>
              <div className="grid gap-1">
                <Label htmlFor="listing-filter" className="text-xs">Listing ID</Label>
                <Input
                  id="listing-filter"
                  placeholder="Listing ID"
                  value={listingIdFilter}
                  onChange={(e) => setListingIdFilter(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="date-from" className="text-xs">From date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-[140px]"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="date-to" className="text-xs">To date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-[140px]"
                />
              </div>
              <div className="flex items-end">
                <Button size="sm" onClick={applyFilters} className="hover:scale-[1.02] active:scale-[0.98]">
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {listError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {listError}
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchList}>
                Retry
              </Button>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-border">
            {listLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full animate-pulse" />
                ))}
              </div>
            ) : listData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">No orders found</p>
                  <p className="text-sm text-muted-foreground">
                    Your orders will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="sticky top-0 bg-muted/80 backdrop-blur">Order</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <span className="font-medium text-foreground">
                            #{row.id.slice(0, 8)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatAmount(row.total_amount_cents, row.currency)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {new Date(row.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchParams({ orderId: row.id })}
                              className="hover:scale-105"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            {row.dispute_case_id && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/dashboard/dispute-refund-case-page/${row.dispute_case_id}`}>
                                  <AlertCircle className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col gap-4 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(listPage - 1) * listPageSize + 1}–
                    {Math.min(listPage * listPageSize, listTotal)} of {listTotal}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Per page</span>
                      <select
                        value={listPageSize}
                        onChange={(e) => {
                          setListPageSize(Number(e.target.value))
                          setListPage(1)
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
                        onClick={() => setListPage((p) => Math.max(1, p - 1))}
                        disabled={listPage <= 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[6rem] text-center text-sm">
                        Page {listPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                        disabled={listPage >= totalPages}
                        aria-label="Next page"
                      >
                        <ChevronLeft className="h-4 w-4 rotate-180" />
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
