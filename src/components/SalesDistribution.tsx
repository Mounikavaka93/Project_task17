import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { categorySales, paymentSales } from '../data/mockData'
import type { ChartSlice } from '../types'

type Mode = 'category' | 'payment'

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: ChartSlice }>
}) {
  if (!active || !payload?.length) return null
  const slice = payload[0]
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{slice.name}</p>
      <p className="text-muted">{slice.value}% of sales</p>
    </div>
  )
}

export function SalesDistribution() {
  const [mode, setMode] = useState<Mode>('category')
  const data = mode === 'category' ? categorySales : paymentSales
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="animate-fade-up stagger-5 flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Sales distribution</h2>
          <p className="text-xs text-muted">Share of revenue this month</p>
        </div>
        <div className="flex rounded-xl bg-paper p-1">
          {(['category', 'payment'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition',
                mode === option
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {option === 'category' ? 'Categories' : 'Payments'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 grid min-h-64 flex-1 items-center gap-4 md:grid-cols-[1fr_0.9fr]">
        <div className="relative h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={mode}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={98}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted">Coverage</p>
            <p className="font-display text-2xl font-extrabold">{total}%</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {data.map((slice) => (
            <li key={slice.name} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: slice.color }}
              />
              <span className="flex-1 text-sm">{slice.name}</span>
              <span className="text-sm font-semibold">{slice.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
