import { Package, ShoppingBag, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react'
import { overviewStats } from '../data/mockData'
import { formatCurrency, formatNumber } from '../lib/format'

const cards = [
  {
    label: 'Total Orders',
    value: formatNumber(overviewStats.orders.value),
    change: overviewStats.orders.change,
    icon: ShoppingBag,
    tint: 'bg-coral/10 text-coral',
  },
  {
    label: 'Total Sales',
    value: formatCurrency(overviewStats.sales.value),
    change: overviewStats.sales.change,
    icon: Wallet,
    tint: 'bg-teal/10 text-teal',
  },
  {
    label: 'Total Customers',
    value: formatNumber(overviewStats.customers.value),
    change: overviewStats.customers.change,
    icon: Users,
    tint: 'bg-violet-100 text-violet-600',
  },
  {
    label: 'Total Products',
    value: formatNumber(overviewStats.products.value),
    change: overviewStats.products.change,
    icon: Package,
    tint: 'bg-amber-100 text-amber-700',
  },
]

export function OverviewCards() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const up = card.change >= 0
        return (
          <article
            key={card.label}
            className={`card-hover animate-fade-up stagger-${index + 1} h-full rounded-2xl border border-line bg-white p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">
                  {card.value}
                </p>
              </div>
              <span className={`rounded-xl p-2.5 ${card.tint}`}>
                <Icon size={18} />
              </span>
            </div>
            <p
              className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {up ? '+' : ''}
              {card.change}%
              <span className="font-medium text-muted">vs last month</span>
            </p>
          </article>
        )
      })}
    </section>
  )
}
