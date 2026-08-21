import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ProductPerformance } from '../components/ProductPerformance'
import { SalesDistribution } from '../components/SalesDistribution'
import { monthlySales } from '../data/mockData'
import { formatNumber } from '../lib/format'

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-teal">{formatNumber(payload[0].value)} orders</p>
    </div>
  )
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid items-stretch gap-6 xl:grid-cols-5">
        <section className="animate-fade-up flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-5 xl:col-span-3">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold">Order volume</h2>
            <p className="text-xs text-muted">Completed checkouts by month</p>
          </div>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="#eee8df" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b6a66', fontSize: 12 }} />
                <YAxis width={36} tickLine={false} axisLine={false} tick={{ fill: '#6b6a66', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(26,166,166,0.08)' }} />
                <Bar dataKey="orders" fill="#1AA6A6" radius={[8, 8, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <div className="min-w-0 xl:col-span-2">
          <SalesDistribution />
        </div>
      </div>
      <ProductPerformance limit={8} />
    </div>
  )
}
