import { useMemo, useState } from 'react'
import { Search, Star, X } from 'lucide-react'
import { ProductImage } from '../components/ProductImage'
import { products } from '../data/mockData'
import { formatCurrency, formatNumber } from '../lib/format'
import { textMatches } from '../lib/search'
import type { Product, ProductBadge } from '../types'

const categories = ['All', ...Array.from(new Set(products.map((item) => item.category)))]

const badgeClass: Record<ProductBadge, string> = {
  Bestseller: 'bg-gold text-ink',
  New: 'bg-teal text-white',
  Sale: 'bg-coral text-white',
  'Low stock': 'bg-rose-600 text-white',
}

type ProductsPageProps = {
  search: string
}

export function ProductsPage({ search }: ProductsPageProps) {
  const [category, setCategory] = useState('All')
  const [stock, setStock] = useState<'All' | 'In stock' | 'Low'>('All')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesStock =
        stock === 'All' ||
        (stock === 'Low' && product.stock < 10) ||
        (stock === 'In stock' && product.stock >= 10)
      const haystack = `${product.name} ${product.category} ${product.id} ${product.description}`
      const matchesQuery =
        textMatches(haystack, search) && textMatches(haystack, query)
      return matchesCategory && matchesStock && matchesQuery
    })
  }, [category, query, search, stock])

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">
              Featured collection
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
              Late Summer Edit
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Curated pieces shoppers are adding to cart this week — headphones, linen, and home
              ritual goods.
            </p>
            <p className="mt-5 text-sm font-semibold">
              {filtered.length} products · free shipping over $75
            </p>
          </div>
          <div className="h-44 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
              alt="Featured collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the store"
              className="w-full rounded-xl border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-coral/50 focus:bg-white focus:ring-2 focus:ring-coral/15"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-coral/50 focus:bg-white"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={stock}
            onChange={(event) => setStock(event.target.value as 'All' | 'In stock' | 'Low')}
            className="rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-coral/50 focus:bg-white"
          >
            <option>All</option>
            <option>In stock</option>
            <option>Low</option>
          </select>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product) => (
            <article key={product.id} className="group card-hover overflow-hidden rounded-2xl border border-line bg-white">
              <button
                type="button"
                onClick={() => setActive(product)}
                className="block w-full text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full transition duration-500 group-hover:scale-105"
                  />
                  {product.badge ? (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass[product.badge]}`}
                    >
                      {product.badge}
                    </span>
                  ) : null}
                  <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-ink/90 py-2 text-center text-xs font-semibold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Quick view
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {product.category}
                  </p>
                  <h3 className="mt-1 font-semibold">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="font-bold">{formatCurrency(product.price)}</p>
                    {product.compareAtPrice ? (
                      <p className="text-sm text-muted line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Star size={12} className="fill-gold text-gold" />
                      {product.rating}
                      <span className="font-medium text-muted">
                        ({formatNumber(product.reviews)})
                      </span>
                    </span>
                    <span className="flex gap-1">
                      {product.colors.slice(0, 3).map((color) => (
                        <span
                          key={color}
                          className="h-3 w-3 rounded-full ring-1 ring-black/10"
                          style={{ background: color }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            No products match the current search or filters.
          </p>
        ) : null}
      </section>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 animate-fade-in"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <ProductImage src={active.image} alt={active.name} className="h-64 w-full md:h-full" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {active.category}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold">{active.name}</h3>
                </div>
                <button type="button" onClick={() => setActive(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{active.description}</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="font-display text-2xl font-extrabold">
                  {formatCurrency(active.price)}
                </p>
                {active.compareAtPrice ? (
                  <p className="pb-1 text-sm text-muted line-through">
                    {formatCurrency(active.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted">
                {active.stock} in stock · {formatNumber(active.sold)} sold · {active.rating} stars
              </p>
              <div className="mt-4 flex gap-2">
                {active.colors.map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full ring-1 ring-black/10"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                Add to bag · {formatCurrency(active.price)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
