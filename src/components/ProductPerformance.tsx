import { TrendingDown, TrendingUp } from 'lucide-react'
import { products } from '../data/mockData'
import { formatCurrency, formatNumber } from '../lib/format'
import { ProductImage } from './ProductImage'

const maxRevenue = Math.max(...products.map((item) => item.revenue))

type ProductPerformanceProps = {
  limit?: number
}

export function ProductPerformance({ limit = 6 }: ProductPerformanceProps) {
  const rows = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)

  return (
    <section className="animate-fade-up stagger-6 flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-bold">Product performance</h2>
        <p className="text-xs text-muted">Top SKUs by revenue this month</p>
      </div>
      <ul className="space-y-4">
        {rows.map((product) => {
          const up = product.growth >= 0
          const width = Math.max(8, Math.round((product.revenue / maxRevenue) * 100))
          const lowStock = product.stock < 10
          return (
            <li key={product.id} className="group rounded-xl p-1 -mx-1 transition duration-200 hover:bg-paper/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="h-11 w-11 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-xs text-muted">
                      {product.category} · {formatNumber(product.sold)} sold
                      {lowStock ? (
                        <span className="ml-2 font-semibold text-coral">
                          {product.stock} left
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p
                    className={`inline-flex items-center justify-end gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {up ? '+' : ''}
                    {product.growth}%
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                <div
                  className="h-full rounded-full bg-coral transition-all duration-500 group-hover:bg-teal"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
