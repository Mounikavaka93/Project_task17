import { useState } from 'react'
import { Layout } from './components/Layout'
import { initialNotifications } from './data/mockData'
import {
  clearSession,
  readCurrentUser,
  readSignedIn,
  writeSession,
  skipAutoDemoLogin,
  type AuthUser,
} from './lib/auth'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CustomersPage } from './pages/CustomersPage'
import { DashboardPage } from './pages/DashboardPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductsPage } from './pages/ProductsPage'
import { SignInPage } from './pages/SignInPage'
import type { NotificationItem, PageId } from './types'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    readSignedIn() ? readCurrentUser() : null,
  )
  const [page, setPage] = useState<PageId>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications)

  function markAllRead() {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })))
  }

  function toggleRead(id: string) {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
    )
  }

  function signIn(nextUser: AuthUser) {
    writeSession(nextUser)
    setUser(nextUser)
    setPage('dashboard')
  }

  function signOut() {
    skipAutoDemoLogin()
    clearSession()
    setUser(null)
    setSearch('')
    setMobileOpen(false)
    setPage('dashboard')
  }

  if (!user) {
    return <SignInPage onSuccess={signIn} />
  }

  return (
    <Layout
      page={page}
      onNavigate={setPage}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed((value) => !value)}
      mobileOpen={mobileOpen}
      onOpenMobile={() => setMobileOpen(true)}
      onCloseMobile={() => setMobileOpen(false)}
      search={search}
      onSearch={setSearch}
      notifications={notifications}
      onMarkAllRead={markAllRead}
      onToggleRead={toggleRead}
      onSignOut={signOut}
      user={user}
    >
      {page === 'dashboard' ? (
        <DashboardPage search={search} onNavigate={setPage} />
      ) : null}
      {page === 'orders' ? <OrdersPage search={search} /> : null}
      {page === 'products' ? <ProductsPage search={search} /> : null}
      {page === 'customers' ? <CustomersPage search={search} /> : null}
      {page === 'analytics' ? <AnalyticsPage /> : null}
    </Layout>
  )
}
