import { RecentOrders } from '../components/RecentOrders'

type OrdersPageProps = {
  search: string
}

export function OrdersPage({ search }: OrdersPageProps) {
  return <RecentOrders search={search} showFilters />
}
