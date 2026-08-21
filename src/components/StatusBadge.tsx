import type { OrderStatus } from '../types'

const styles: Record<OrderStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Processing: 'bg-sky-50 text-sky-700 ring-sky-200',
  Shipped: 'bg-violet-50 text-violet-700 ring-violet-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  )
}
