import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react'
import { initials } from '../lib/format'
import type { AuthUser } from '../lib/auth'
import type { NotificationItem, PageId } from '../types'

type HeaderProps = {
  page: PageId
  search: string
  onSearch: (value: string) => void
  onOpenSidebar: () => void
  sidebarOpen: boolean
  notifications: NotificationItem[]
  onMarkAllRead: () => void
  onToggleRead: (id: string) => void
  onSignOut: () => void
  user: AuthUser
}

const titles: Record<PageId, { heading: string; sub: string }> = {
  dashboard: {
    heading: 'Store overview',
    sub: 'Sales, traffic, and what shoppers are buying',
  },
  orders: {
    heading: 'Orders',
    sub: 'Fulfill purchases as they come in',
  },
  products: {
    heading: 'Catalog',
    sub: 'Your live storefront assortment',
  },
  customers: {
    heading: 'Customers',
    sub: 'People shopping VividCart right now',
  },
  analytics: {
    heading: 'Analytics',
    sub: 'Channel mix and product velocity',
  },
}

const typeDot: Record<NotificationItem['type'], string> = {
  order: 'bg-coral',
  stock: 'bg-amber-400',
  payment: 'bg-teal',
  review: 'bg-violet-400',
}

export function Header({
  page,
  search,
  onSearch,
  onOpenSidebar,
  sidebarOpen,
  notifications,
  onMarkAllRead,
  onToggleRead,
  onSignOut,
  user,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [panel, setPanel] = useState<'profile' | 'settings' | 'signout' | null>(
    null,
  )
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(true)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const unread = notifications.filter((item) => !item.read).length
  const copy = titles[page]

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Node
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setNotifOpen(false)
      setProfileOpen(false)
      setMobileSearch(false)
      setPanel(null)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
    <header className="z-20 shrink-0 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="page-x flex h-16 items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-ink transition hover:bg-white lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1 md:flex-none md:max-w-[260px] lg:max-w-none lg:flex-1">
          <h1 className="truncate font-display text-lg font-extrabold tracking-tight sm:text-xl">
            {copy.heading}
          </h1>
          <p className="hidden truncate text-xs text-muted sm:block">{copy.sub}</p>
        </div>

        <a
          href="https://vividcart.com"
          className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-line transition hover:bg-paper lg:inline-flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          vividcart.com
          <ExternalLink size={12} />
        </a>

        <div className="hidden max-w-md flex-1 md:block">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search orders, products, customers…"
              className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-8 text-sm outline-none transition focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-paper hover:text-ink"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
          </label>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-ink transition hover:bg-white md:hidden"
          onClick={() => setMobileSearch((open) => !open)}
          aria-label="Toggle search"
        >
          <Search size={18} />
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((open) => !open)
              setProfileOpen(false)
            }}
            className="relative rounded-xl p-2 text-ink transition hover:bg-white"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={18} />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                <span className="absolute inset-0 rounded-full bg-coral animate-pulse-dot" />
                <span className="relative">{unread}</span>
              </span>
            ) : null}
          </button>

          {notifOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-line bg-white p-2 shadow-xl animate-scale-in">
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-sm font-semibold">Notifications</p>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-xs font-medium text-coral transition hover:text-coral-dark"
                >
                  Mark all read
                </button>
              </div>
              <ul className="hide-scrollbar max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onToggleRead(item.id)}
                      className="flex w-full gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-paper"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDot[item.type]} ${item.read ? 'opacity-30' : ''}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted">
                            {item.time}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {item.message}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open)
              setNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-white"
            aria-expanded={profileOpen}
            aria-label="User profile"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
              {initials(user.name)}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold">{user.name}</span>
              <span className="block text-[11px] text-muted">Store admin</span>
            </span>
            <ChevronDown size={14} className="hidden text-muted sm:block" />
          </button>

          {profileOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 origin-top-right rounded-2xl border border-line bg-white p-2 shadow-xl animate-scale-in">
              <div className="border-b border-line px-3 py-2">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  setPanel('profile')
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-paper"
              >
                <UserRound size={16} /> Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  setPanel('settings')
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-paper"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  setPanel('signout')
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {mobileSearch ? (
        <div className="page-x border-t border-line py-3 md:hidden animate-fade-in">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              autoFocus
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search orders, products, customers…"
              className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
          </label>
        </div>
      ) : null}
    </header>

    {panel ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-fade-in"
        onClick={() => setPanel(null)}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-xl animate-scale-in"
          onClick={(event) => event.stopPropagation()}
        >
          {panel === 'profile' ? (
            <>
              <div className="flex items-start justify-between">
                <h2 className="font-display text-lg font-bold">Profile</h2>
                <button type="button" onClick={() => setPanel(null)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {initials(user.name)}
                </span>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted">Store admin · {user.email}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-paper p-3">
                  <dt className="text-xs text-muted">Role</dt>
                  <dd className="font-semibold">Administrator</dd>
                </div>
                <div className="rounded-xl bg-paper p-3">
                  <dt className="text-xs text-muted">Store</dt>
                  <dd className="font-semibold">VividCart HQ</dd>
                </div>
              </dl>
            </>
          ) : null}

          {panel === 'settings' ? (
            <>
              <div className="flex items-start justify-between">
                <h2 className="font-display text-lg font-bold">Settings</h2>
                <button type="button" onClick={() => setPanel(null)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted">Notification preferences for this session.</p>
              <label className="mt-4 flex items-center justify-between rounded-xl bg-paper px-3 py-3 text-sm">
                Email alerts
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(event) => setEmailAlerts(event.target.checked)}
                />
              </label>
              <label className="mt-2 flex items-center justify-between rounded-xl bg-paper px-3 py-3 text-sm">
                Push alerts
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(event) => setPushAlerts(event.target.checked)}
                />
              </label>
            </>
          ) : null}

          {panel === 'signout' ? (
            <>
              <h2 className="font-display text-lg font-bold">Sign out?</h2>
              <p className="mt-2 text-sm text-muted">
                This demo has no backend auth. Signing out clears the local admin session UI.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMarkAllRead()
                    onSearch('')
                    setPanel(null)
                    onSignOut()
                  }}
                  className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    ) : null}
    </>
  )
}
