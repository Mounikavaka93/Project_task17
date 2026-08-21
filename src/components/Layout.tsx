import { useEffect, type ReactNode } from 'react'
import type { AuthUser } from '../lib/auth'
import type { NotificationItem, PageId } from '../types'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type LayoutProps = {
  page: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onOpenMobile: () => void
  onCloseMobile: () => void
  search: string
  onSearch: (value: string) => void
  notifications: NotificationItem[]
  onMarkAllRead: () => void
  onToggleRead: (id: string) => void
  onSignOut: () => void
  user: AuthUser
  children: ReactNode
}

export function Layout({
  page,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onOpenMobile,
  onCloseMobile,
  search,
  onSearch,
  notifications,
  onMarkAllRead,
  onToggleRead,
  onSignOut,
  user,
  children,
}: LayoutProps) {
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseMobile()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCloseMobile])

  return (
    <div className="h-svh overflow-hidden bg-paper">
      <Sidebar
        page={page}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={onCloseMobile}
      />
      <div
        className={[
          'flex h-full min-w-0 flex-col',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]',
        ].join(' ')}
      >
        <Header
          page={page}
          search={search}
          onSearch={onSearch}
          onOpenSidebar={onOpenMobile}
          sidebarOpen={mobileOpen}
          notifications={notifications}
          onMarkAllRead={onMarkAllRead}
          onToggleRead={onToggleRead}
          onSignOut={onSignOut}
          user={user}
        />
        <main className="page-x hide-scrollbar min-h-0 flex-1 overflow-y-auto py-5 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
