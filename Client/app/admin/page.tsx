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
    <div className="min-h-screen bg-secondary flex relative overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-foreground text-background transform transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-background/10">
            <Link href="/" className="font-serif text-2xl font-bold">
              AR<span className="text-accent">Smart</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-background hover:bg-background/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                onClick={() => {
                    setActiveTab(item.id)
                    if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  activeTab === item.id 
                    ? "bg-accent text-accent-foreground" 
                    : "text-background/70 hover:bg-background/10 hover:text-background"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-background/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Admin User</p>
                <p className="text-xs text-background/50 truncate">admin@Gmail.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-background/50 hover:text-background shrink-0" asChild>
                <Link href="/account">
                  <LogOut className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-background border-b border-border sticky top-0 z-40 shrink-0">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-full pl-9 h-9" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
              <Link href="/" target="_blank" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-secondary/30">
          
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
                </div>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-full sm:w-40 h-9">
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
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <Card key={stat.title} className="shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-xs sm:text-sm font-medium",
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />}
                          {stat.change}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <p className="text-xl sm:text-2xl font-bold truncate">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the current year</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-accent/10 rounded-t-sm relative overflow-hidden h-full flex flex-col justify-end">
                            <div 
                              className="w-full bg-accent hover:bg-accent/80 transition-all cursor-pointer"
                              style={{ height: `${50 + (i * 8)}%` }}
                            />
                          </div>
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{month}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg">Top Products</CardTitle>
                    <CardDescription>Best selling this month</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-4">
                      {products.filter(p => p.isBestseller).slice(0, 4).map((product, i) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-muted-foreground/50 w-4 shrink-0">{i + 1}</span>
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.reviews} sold</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders Table */}
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">Recent Orders</CardTitle>
                    <CardDescription className="truncate">Latest customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 ml-2">
                    <span className="hidden xs:inline">View All</span>
                    <ChevronRight className="h-4 w-4 xs:ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="text-left bg-muted/50 border-y border-border">
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Products</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-mono text-xs">{order.id}</td>
                            <td className="p-4 text-sm font-medium">{order.customer}</td>
                            <td className="p-4 text-sm text-muted-foreground">{order.products} items</td>
                            <td className="p-4 text-sm font-bold">{formatPrice(order.total)}</td>
                            <td className="p-4">
                              <Badge variant="outline" className={cn("text-[10px] px-2 py-0 h-5", getStatusColor(order.status))}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Products</h1>
                  <p className="text-muted-foreground">{products.length} products in catalog</p>
                </div>
                <Link href="/products">
  <Button className="w-full sm:w-auto">
    <Plus className="h-4 w-4 mr-2" />
    Add Product
  </Button>
</Link>
              </div>

              <Card className="shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="text-left bg-muted/50 border-b border-border">
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Category</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">AR</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate">{product.name}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.colors.length} Variants</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm capitalize">{product.category.replace('-', ' ')}</td>
                            <td className="p-4 text-sm font-bold">{formatPrice(product.price)}</td>
                            <td className="p-4">
                              <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-[10px]">
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Switch checked={product.arEnabled} className="scale-75 origin-left" />
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <p className="text-muted-foreground">Track augmented reality engagement</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total AR Sessions', val: '8,742', icon: Sparkles, color: 'bg-accent/10 text-accent' },
                    { label: 'AR Conversion Rate', val: '6.4%', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
                    { label: 'Avg. Duration', val: '3:24', icon: Eye, color: 'bg-blue-100 text-blue-600' }
                ].map((item, idx) => (
                    <Card key={idx} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-2xl font-bold truncate">{item.val}</p>
                            <p className="text-sm text-muted-foreground truncate">{item.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              <Card className="shadow-sm">
                <CardHeader className="p-4 sm:p-6 border-b border-border">
                  <CardTitle className="text-lg">Product Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="text-left bg-muted/30">
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase text-center">AR Sessions</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase text-center">Conversions</th>
                          <th className="p-4 text-xs font-semibold text-muted-foreground uppercase text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {arAnalytics.map(item => (
                          <tr key={item.product} className="hover:bg-muted/20 transition-colors">
                            <td className="p-4 text-sm font-medium">{item.product}</td>
                            <td className="p-4 text-sm text-center font-mono">{item.sessions.toLocaleString()}</td>
                            <td className="p-4 text-sm text-center font-mono">{item.conversions}</td>
                            <td className="p-4 text-right">
                              <Badge variant="secondary" className="font-mono">{item.rate}</Badge>
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
                <h1 className="text-2xl font-bold">Chatbot</h1>
                <p className="text-muted-foreground">Monitor assistant performance</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { l: 'Conversations', v: chatbotMetrics.totalConversations.toLocaleString() },
                    { l: 'Avg Speed', v: chatbotMetrics.avgResponseTime },
                    { l: 'Resolution', v: chatbotMetrics.resolutionRate },
                    { l: 'Satisfaction', v: '4.8/5' }
                ].map((m, i) => (
                    <Card key={i} className="shadow-sm">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <p className="text-xl sm:text-2xl font-bold">{m.v}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mt-1">{m.l}</p>
                        </CardContent>
                    </Card>
                ))}
              </div>

              <Card className="shadow-sm">
                <CardHeader className="p-4 sm:p-6 border-b border-border">
                  <CardTitle className="text-lg">Common Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-3">
                    {chatbotMetrics.topQueries.map((query, i) => (
                      <div key={query} className="flex items-center gap-3 sm:gap-4 p-3 bg-muted/40 rounded-xl hover:bg-muted/70 transition-colors">
                        <span className="text-xs font-bold text-muted-foreground/40 w-5">{i + 1}</span>
                        <p className="flex-1 text-sm font-medium truncate">{query}</p>
                        <Badge variant="outline" className="bg-background font-mono text-[10px]">
                            {Math.floor(200 + Math.random() * 300)} hits
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!['overview', 'products', 'analytics', 'chatbot'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Settings className="h-8 w-8 text-muted-foreground animate-spin-slow" />
                </div>
                <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                    We are currently building this section. Check back soon for new updates!
                </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}