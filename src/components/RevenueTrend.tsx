import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlySales } from '../data/mockData'
import { formatCurrency } from '../lib/format'

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
      <p className="text-coral">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function RevenueTrend() {
  return (
    <section className="animate-fade-up stagger-4 flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Revenue trend</h2>
          <p className="text-xs text-muted">Last six months of store sales</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          +22.8% YTD
        </span>
      </div>
      <div className="mt-auto h-64 min-h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlySales} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F25C2A" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#F25C2A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eee8df" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b6a66', fontSize: 12 }} />
            <YAxis
              width={42}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b6a66', fontSize: 12 }}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#F25C2A"
              strokeWidth={2.5}
              fill="url(#salesFill)"
              activeDot={{ r: 5, fill: '#F25C2A' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
