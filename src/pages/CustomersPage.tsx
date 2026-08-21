import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { customers } from '../data/mockData'
import { formatCurrency } from '../lib/format'
import { textMatches } from '../lib/search'

type CustomersPageProps = {
  search: string
}

export function CustomersPage({ search }: CustomersPageProps) {
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return customers.filter((customer) => {
      const matchesStatus = status === 'All' || customer.status === status
      const haystack = `${customer.name} ${customer.email} ${customer.location}`
      const matchesQuery =
        textMatches(haystack, search) && textMatches(haystack, query)
      return matchesStatus && matchesQuery
    })
  }, [query, search, status])

  return (
    <section className="animate-fade-up rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Customer directory</h2>
          <p className="text-xs text-muted">{filtered.length} people in view</p>
        </div>
        <div className="flex rounded-xl bg-paper p-1">
          {(['All', 'Active', 'Inactive'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                status === item ? 'bg-white shadow-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="relative mt-4 block max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, or city"
          className="w-full rounded-xl border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-coral/50 focus:bg-white focus:ring-2 focus:ring-coral/15"
        />
      </label>

      <div className="mt-4 hidden overflow-x-auto hide-scrollbar md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Location</th>
              <th className="pb-3 font-semibold">Orders</th>
              <th className="pb-3 font-semibold">Lifetime value</th>
              <th className="pb-3 font-semibold">Joined</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-line/70 transition last:border-b-0 hover:bg-paper/70">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={customer.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span>
                      <span className="block font-medium">{customer.name}</span>
                      <span className="block text-xs text-muted">{customer.email}</span>
                    </span>
                  </div>
                </td>
                <td className="py-3">{customer.location}</td>
                <td className="py-3">{customer.orders}</td>
                <td className="py-3 font-semibold">{formatCurrency(customer.spent)}</td>
                <td className="py-3 text-muted">{customer.joined}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                      customer.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-zinc-100 text-zinc-600 ring-zinc-200'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {filtered.map((customer) => (
          <article key={customer.id} className="rounded-xl border border-line p-3">
            <div className="flex items-center gap-3">
              <img
                src={customer.avatar}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{customer.name}</p>
                <p className="truncate text-xs text-muted">{customer.email}</p>
              </div>
              <span className="text-xs font-semibold">{customer.status}</span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {customer.location} · {customer.orders} orders · {formatCurrency(customer.spent)}
            </p>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          No customers match the current search or filters.
        </p>
      ) : null}
    </section>
  )
}
