import { OverviewCards } from '../components/OverviewCards'
import { RecentOrders } from '../components/RecentOrders'
import { RevenueTrend } from '../components/RevenueTrend'
import { SalesDistribution } from '../components/SalesDistribution'
import { StorePulse } from '../components/StorePulse'
import type { PageId } from '../types'

type DashboardPageProps = {
  search: string
  onNavigate: (page: PageId) => void
}

export function DashboardPage({ search, onNavigate }: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <StorePulse />
      <OverviewCards />
      <div className="grid items-stretch gap-6 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <RevenueTrend />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SalesDistribution />
        </div>
      </div>
      <RecentOrders
        search={search}
        limit={5}
        onNavigate={onNavigate}
        showFilters={false}
      />
    </div>
  )
}
