export type PageId =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'analytics'

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export type PaymentMethod = 'Card' | 'PayPal' | 'UPI' | 'Wallet' | 'COD'

export type Order = {
  id: string
  customer: string
  email: string
  product: string
  date: string
  amount: number
  status: OrderStatus
  payment: PaymentMethod
  items: number
}

export type ProductBadge = 'Bestseller' | 'New' | 'Sale' | 'Low stock'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  compareAtPrice?: number
  sold: number
  stock: number
  revenue: number
  growth: number
  rating: number
  reviews: number
  image: string
  description: string
  colors: string[]
  badge?: ProductBadge
}

export type Customer = {
  id: string
  name: string
  email: string
  orders: number
  spent: number
  joined: string
  status: 'Active' | 'Inactive'
  location: string
  avatar: string
}

export type NotificationItem = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'stock' | 'payment' | 'review'
}

export type ChartSlice = {
  name: string
  value: number
  color: string
}

export type MonthlyPoint = {
  month: string
  sales: number
  orders: number
}
