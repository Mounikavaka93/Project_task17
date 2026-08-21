import { liveActivity, storeStats } from '../data/mockData'
import { formatCurrency, formatNumber } from '../lib/format'

export function StorePulse() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4">
      <div>
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Store live · {storeStats.url}
        </p>
        <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight">
          Today at VividCart
        </h2>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-muted">Sales</p>
          <p className="font-semibold">{formatCurrency(storeStats.todaySales)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Orders</p>
          <p className="font-semibold">{formatNumber(storeStats.todayOrders)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Visitors</p>
          <p className="font-semibold">{formatNumber(storeStats.visitors)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Conversion</p>
          <p className="font-semibold">{storeStats.conversion}%</p>
        </div>
      </div>
      <p className="w-full text-xs text-muted xl:w-auto xl:max-w-xs xl:text-right">
        {liveActivity[0]?.text}
      </p>
    </section>
  )
}
