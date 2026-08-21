import { useMemo, useState } from 'react'
import { Filter, Search, X } from 'lucide-react'
import { customers, orders, productImage } from '../data/mockData'
import { avatarColor, formatCurrency, initials } from '../lib/format'
import { textMatches } from '../lib/search'
import type { Order, OrderStatus, PageId, PaymentMethod } from '../types'
import { ProductImage } from './ProductImage'
import { StatusBadge } from './StatusBadge'

const statuses: Array<'All' | OrderStatus> = [
  'All',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

const payments: Array<'All' | PaymentMethod> = [
  'All',
  'Card',
  'PayPal',
  'UPI',
  'Wallet',
  'COD',
]

type RecentOrdersProps = {
  search: string
  limit?: number
  onNavigate?: (page: PageId) => void
  showFilters?: boolean
}

export function RecentOrders({
  search,
  limit,
  onNavigate,
  showFilters = true,
}: RecentOrdersProps) {
  const [status, setStatus] = useState<'All' | OrderStatus>('All')
  const [payment, setPayment] = useState<'All' | PaymentMethod>('All')
  const [localQuery, setLocalQuery] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = status === 'All' || order.status === status
      const matchesPayment = payment === 'All' || order.payment === payment
      const haystack = `${order.id} ${order.customer} ${order.email} ${order.product} ${order.payment}`
      const matchesQuery =
        textMatches(haystack, search) && textMatches(haystack, localQuery)
      return matchesStatus && matchesPayment && matchesQuery
    })
  }, [localQuery, payment, search, status])

  const visible = limit ? filtered.slice(0, limit) : filtered

  return (
    <section className="animate-fade-up stagger-6 flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Recent orders</h2>
          <p className="text-xs text-muted">
            {visible.length} of {orders.length} shown
          </p>
        </div>
        {onNavigate ? (
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-sm font-semibold text-coral transition hover:text-coral-dark"
          >
            View all
          </button>
        ) : null}
      </div>

      {showFilters ? (
        <div className="relative z-10 mt-4 space-y-3">
          <label className="relative block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={localQuery}
              onChange={(event) => setLocalQuery(event.target.value)}
              placeholder="Filter by ID, customer, or product"
              className="w-full rounded-xl border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none transition focus:border-coral/50 focus:bg-white focus:ring-2 focus:ring-coral/15"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={15} className="shrink-0 text-muted" />
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={[
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition duration-200',
                  status === item
                    ? 'bg-ink text-white'
                    : 'bg-paper text-muted hover:bg-white hover:text-ink',
                ].join(' ')}
              >
                {item}
              </button>
            ))}
            <select
              value={payment}
              onChange={(event) =>
                setPayment(event.target.value as 'All' | PaymentMethod)
              }
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold outline-none transition focus:border-coral/50 focus:bg-white"
            >
              {payments.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All payments' : item}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="mt-4 hidden overflow-x-auto hide-scrollbar md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="pb-3 font-semibold">Order</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Product</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Payment</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="cursor-pointer border-b border-line/70 transition last:border-b-0 hover:bg-paper/70"
              >
                <td className="py-3 font-semibold">{order.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: avatarColor(order.customer) }}
                    >
                      {initials(order.customer)}
                    </span>
                    <span>
                      <span className="block font-medium">{order.customer}</span>
                      <span className="block text-xs text-muted">{order.email}</span>
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <ProductImage
                      src={productImage(order.product)}
                      alt={order.product}
                      className="h-9 w-9 shrink-0 rounded-lg"
                    />
                    <span>{order.product}</span>
                  </div>
                </td>
                <td className="py-3 text-muted">{order.date}</td>
                <td className="py-3">{order.payment}</td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setStatus(order.status)
                    }}
                  >
                    <StatusBadge status={order.status} />
                  </button>
                </td>
                <td className="py-3 text-right font-semibold">
                  {formatCurrency(order.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {visible.map((order) => (
          <article
            key={order.id}
            onClick={() => setSelected(order)}
            className="cursor-pointer rounded-xl border border-line bg-paper/50 p-3 transition hover:border-coral/30 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <ProductImage
                  src={productImage(order.product)}
                  alt={order.product}
                  className="h-10 w-10 shrink-0 rounded-lg"
                />
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm">{order.customer}</p>
                  <p className="text-xs text-muted">{order.product}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setStatus(order.status)
                }}
              >
                <StatusBadge status={order.status} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <span>
                {order.date} · {order.payment}
              </span>
              <span className="text-sm font-semibold text-ink">
                {formatCurrency(order.amount)}
              </span>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          No orders match the current search or filters.
        </p>
      ) : null}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Order</p>
                <h3 className="font-display text-xl font-extrabold">{selected.id}</h3>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4">
              <StatusBadge status={selected.status} />
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-paper p-3">
              <ProductImage
                src={productImage(selected.product)}
                alt={selected.product}
                className="h-16 w-16 rounded-xl"
              />
              <div>
                <p className="font-semibold">{selected.product}</p>
                <p className="text-sm text-muted">
                  {selected.items} item · {selected.payment}
                </p>
                <p className="mt-1 font-bold">{formatCurrency(selected.amount)}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Customer</dt>
                <dd className="font-semibold">{selected.customer}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Placed</dt>
                <dd>{selected.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Ship to</dt>
                <dd>
                  {customers.find((item) => item.name === selected.customer)?.location ??
                    'New York'}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <p className="text-sm font-semibold">Fulfillment</p>
              <ol className="mt-3 space-y-2 text-sm">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step) => {
                  const reached =
                    selected.status === step ||
                    (selected.status === 'Delivered' && step !== 'Cancelled') ||
                    (selected.status === 'Shipped' && (step === 'Pending' || step === 'Processing')) ||
                    (selected.status === 'Processing' && step === 'Pending')
                  return (
                    <li key={step} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${reached ? 'bg-coral' : 'bg-line'}`}
                      />
                      <span className={reached ? 'font-medium' : 'text-muted'}>{step}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  )
}
