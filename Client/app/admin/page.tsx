'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { products, categories } from '@/lib/data'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Sparkles,
  MessageSquare,
  Search,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  Bell,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for dashboard
const stats = [
  { 
    title: 'Total Revenue', 
    value: '$124,592', 
    change: '+12.5%', 
    trend: 'up',
    icon: DollarSign 
  },
  { 
    title: 'Orders', 
    value: '1,429', 
    change: '+8.2%', 
    trend: 'up',
    icon: ShoppingCart 
  },
  { 
    title: 'AR Sessions', 
    value: '8,742', 
    change: '+24.3%', 
    trend: 'up',
    icon: Sparkles 
  },
  { 
    title: 'Conversion Rate', 
    value: '3.2%', 
    change: '-0.4%', 
    trend: 'down',
    icon: TrendingUp 
  }
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Mitchell', products: 2, total: 1548, status: 'processing' },
  { id: 'ORD-002', customer: 'James Chen', products: 1, total: 649, status: 'shipped' },
  { id: 'ORD-003', customer: 'Emily Rodriguez', products: 3, total: 2097, status: 'delivered' },
  { id: 'ORD-004', customer: 'Michael Park', products: 1, total: 1299, status: 'processing' },
  { id: 'ORD-005', customer: 'Lisa Wang', products: 2, total: 898, status: 'pending' },
]

const arAnalytics = [
  { product: 'Nordica 3-Seater Sofa', sessions: 1234, conversions: 89, rate: '7.2%' },
  { product: 'Aurora Lounge Chair', sessions: 987, conversions: 56, rate: '5.7%' },
  { product: 'Haven Platform Bed', sessions: 856, conversions: 67, rate: '7.8%' },
  { product: 'Oslo Coffee Table', sessions: 654, conversions: 34, rate: '5.2%' },
]

const chatbotMetrics = {
  totalConversations: 3245,
  avgResponseTime: '1.2s',
  resolutionRate: '94%',
  topQueries: ['Sofa recommendations', 'AR help', 'Shipping info', 'Return policy']
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-foreground text-background transform transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-background/10">
            <Link href="/" className="font-serif text-2xl font-bold">
              AR<span className="text-accent">Smart</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-background"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'AR Analytics', icon: Sparkles },
              { id: 'chatbot', label: 'Chatbot', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === item.id 
                    ? "bg-accent text-accent-foreground" 
                    : "text-background/70 hover:bg-background/10 hover:text-background"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-background/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                A
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-background/50">admin@arsmart.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-background/50 hover:text-background">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-background border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..."
                  className="w-64 pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </Button>
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
                </div>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <Card key={stat.title}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart Placeholder */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the current year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-accent/20 rounded-t-sm relative overflow-hidden"
                            style={{ height: `${40 + Math.random() * 60}%` }}
                          >
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-accent"
                              style={{ height: `${60 + Math.random() * 40}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{month}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.filter(p => p.isBestseller).slice(0, 4).map((product, i) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-4">
                            {i + 1}
                          </span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.reviews} sold</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="pb-3 font-medium text-muted-foreground">Order ID</th>
                          <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                          <th className="pb-3 font-medium text-muted-foreground">Products</th>
                          <th className="pb-3 font-medium text-muted-foreground">Total</th>
                          <th className="pb-3 font-medium text-muted-foreground">Status</th>
                          <th className="pb-3 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b border-border last:border-0">
                            <td className="py-4 font-mono text-sm">{order.id}</td>
                            <td className="py-4">{order.customer}</td>
                            <td className="py-4">{order.products} items</td>
                            <td className="py-4 font-medium">{formatPrice(order.total)}</td>
                            <td className="py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium capitalize",
                                getStatusColor(order.status)
                              )}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Products</h1>
                  <p className="text-muted-foreground">{products.length} products in catalog</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="p-4 font-medium text-muted-foreground">Product</th>
                          <th className="p-4 font-medium text-muted-foreground">Category</th>
                          <th className="p-4 font-medium text-muted-foreground">Price</th>
                          <th className="p-4 font-medium text-muted-foreground">Stock</th>
                          <th className="p-4 font-medium text-muted-foreground">AR</th>
                          <th className="p-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                  <img 
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {product.colors.length} colors
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize">{product.category.replace('-', ' ')}</td>
                            <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                            <td className="p-4">
                              <Badge variant={product.inStock ? 'default' : 'destructive'}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Switch checked={product.arEnabled} />
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">AR Analytics</h1>
                <p className="text-muted-foreground">Track augmented reality engagement and conversions</p>
              </div>

              {/* AR Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">8,742</p>
                        <p className="text-sm text-muted-foreground">Total AR Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">6.4%</p>
                        <p className="text-sm text-muted-foreground">AR Conversion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">3:24</p>
                        <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AR Product Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>AR Product Performance</CardTitle>
                  <CardDescription>Products with highest AR engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="pb-3 font-medium text-muted-foreground">Product</th>
                          <th className="pb-3 font-medium text-muted-foreground">AR Sessions</th>
                          <th className="pb-3 font-medium text-muted-foreground">Conversions</th>
                          <th className="pb-3 font-medium text-muted-foreground">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arAnalytics.map(item => (
                          <tr key={item.product} className="border-b border-border last:border-0">
                            <td className="py-4 font-medium">{item.product}</td>
                            <td className="py-4">{item.sessions.toLocaleString()}</td>
                            <td className="py-4">{item.conversions}</td>
                            <td className="py-4">
                              <Badge variant="secondary">{item.rate}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Chatbot Analytics</h1>
                <p className="text-muted-foreground">Monitor AI assistant performance</p>
              </div>

              {/* Chatbot Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold">{chatbotMetrics.totalConversations.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Conversations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold">{chatbotMetrics.avgResponseTime}</p>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold">{chatbotMetrics.resolutionRate}</p>
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold">4.8</p>
                    <p className="text-sm text-muted-foreground">User Satisfaction</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Queries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top User Queries</CardTitle>
                  <CardDescription>Most common questions asked to the chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chatbotMetrics.topQueries.map((query, i) => (
                      <div key={query} className="flex items-center gap-4">
                        <span className="text-muted-foreground font-medium w-6">{i + 1}</span>
                        <div className="flex-1 bg-secondary rounded-lg p-3">
                          <p className="font-medium">{query}</p>
                        </div>
                        <Badge variant="secondary">{Math.floor(200 + Math.random() * 300)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs show placeholder */}
          {!['overview', 'products', 'analytics', 'chatbot'].includes(activeTab) && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 capitalize">{activeTab}</h2>
                <p className="text-muted-foreground">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
