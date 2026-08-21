import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import type { PageId } from '../types'

const nav: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

type SidebarProps = {
  page: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  page,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-30 bg-ink/40 animate-fade-in lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-ink text-white transition-all duration-300',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[248px]',
          mobileOpen ? 'animate-slide-in translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral text-white shadow-[0_8px_16px_-8px_#F25C2A]">
              <ShoppingBag size={18} />
            </span>
            <div className={`leading-tight ${collapsed ? 'lg:hidden' : ''}`}>
                <p className="font-display text-[15px] font-extrabold tracking-tight">
                  VividCart
                </p>
                <p className="text-[11px] text-white/50">Online store</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="hide-scrollbar mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          <p
            className={[
              'px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35',
              collapsed ? 'lg:text-center' : '',
            ].join(' ')}
          >
            <span className={collapsed ? 'lg:hidden' : ''}>Workspace</span>
            <span className={collapsed ? 'hidden lg:inline' : 'hidden'}>Go</span>
          </p>
          {nav.map((item) => {
            const active = page === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  onNavigate(item.id)
                  onCloseMobile()
                }}
                className={[
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-coral text-white shadow-[0_10px_20px_-12px_#F25C2A]'
                    : 'text-white/65 hover:bg-white/10 hover:text-white',
                  collapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : '',
                ].join(' ')}
              >
                <Icon size={18} className={active ? '' : 'transition duration-200 group-hover:scale-110'} />
                <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-white/55 transition hover:bg-white/10 hover:text-white lg:flex"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
          {!collapsed ? (
            <div className="mt-3 hidden rounded-2xl bg-ink-soft p-3 lg:block">
              <p className="text-xs font-semibold text-white/80">Store is live</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                vividcart.com · 186 orders today
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}
