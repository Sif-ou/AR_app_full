'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' 

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
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  Sparkles,
  Search,
  Menu,
  X,
  LogOut,
  UserPlus,
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Trash2,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for dashboard
const stats = [
  { title: 'Total Revenue', value: '$124,592', change: '+12.5%', trend: 'up', icon: DollarSign },
  { title: 'Orders', value: '1,429', change: '+8.2%', trend: 'up', icon: ShoppingCart },
  { title: 'AR Sessions', value: '8,742', change: '+24.3%', trend: 'up', icon: Sparkles },
  { title: 'Conversion Rate', value: '3.2%', change: '-0.4%', trend: 'down', icon: TrendingDown }
]

const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Mitchell', products: 2, total: 1548, status: 'processing' },
  { id: 'ORD-002', customer: 'James Chen', products: 1, total: 649, status: 'shipped' },
  { id: 'ORD-003', customer: 'Emily Rodriguez', products: 3, total: 2097, status: 'delivered' },
  { id: 'ORD-004', customer: 'Michael Park', products: 1, total: 1299, status: 'processing' },
  { id: 'ORD-005', customer: 'Lisa Wang', products: 2, total: 898, status: 'pending' },
]

const INITIAL_ACCOUNTS = [
  { id: 'USR-001', name: 'Amine Rahmani', email: 'amine.r@arsmart.com', role: 'User', status: 'Active', joined: 'Oct 12, 2025' },
  { id: 'USR-002', name: 'Sofia Benali', email: 'sofia.b@arsmart.com', role: 'Marketing Manager', status: 'Active', joined: 'Jan 05, 2026' },
  { id: 'USR-003', name: 'Yacine Merah', email: 'yacine.m@arsmart.com', role: 'Stock Manager', status: 'Active', joined: 'Mar 18, 2026' },
  { id: 'USR-004', name: 'Meriem Kaddour', email: 'm.kaddour@partner.com', role: 'User', status: 'Suspended', joined: 'Nov 22, 2025' },
  { id: 'USR-005', name: 'Kamel Tounsi', email: 'kamel.t@arsmart.com', role: 'Delivery', status: 'Active', joined: 'May 02, 2026' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
  const [accountSearch, setAccountSearch] = useState('')

  // Modal State Form Control
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('User')
  
  const [adminName, setAdminName] = useState('Admin User')
  const [adminEmail, setAdminEmail] = useState('admin@Gmail.com')












const [newPassword, setNewPassword] = useState('')
const [newPhone, setNewPhone] = useState('')

// 2. Update your submission function to talk to the Spring Boot endpoint:
const handleProvisionAccount = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!newName || !newEmail || !newPassword || !newPhone) {
    alert("Please populate all administrative mapping fields.");
    return;
  }

  try {
    const token = localStorage.getItem('token'); // Retrieve auth handle
    
    const response = await fetch('https://ar-app-back-end.onrender.com/api/admin/provision-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Pass JWT vector to backend security context
      },
      body: JSON.stringify({
        username: newName,
        email: newEmail,
        password: newPassword,
        phoneNumber: newPhone,
        role: newRole
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "An error occurred during account routing provisioning.");
      return;
    }

    // Success Hook: Update local UI table view state dynamically
    const localizedMockAccount = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setAccounts(prev => [localizedMockAccount, ...prev]);
    alert(data.message);
    
    // Clear standard form inputs
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewPhone('');
    setNewRole('User');
    setIsModalOpen(false);

  } catch (error) {
    console.error("Network communication failure:", error);
    alert("Could not reach administrative server systems.");
  }

/*

  const handleProvisionAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return

    const newAccount = {
      id: `USR-00${accounts.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    }

    setAccounts(prev => [newAccount, ...prev])
    setNewName('')
    setNewEmail('')
    setNewRole('User')
    setIsModalOpen(false)
  }

 */


}


  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!token || userRole !== 'ADMIN') {
      setIsAuthorized(false) 
    } else {
      const savedName = localStorage.getItem('username')
      const savedEmail = localStorage.getItem('userEmail')
      if (savedName) setAdminName(savedName)
      if (savedEmail) setAdminEmail(savedEmail)
      
      const timer = setTimeout(() => {
        setIsAuthorized(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center space-y-3 font-sans antialiased">
        <div className="text-4xl animate-bounce mb-2">👋</div>
        <h1 className="text-2xl font-bold text-white tracking-wide animate-in fade-in duration-300">
          Hello, Admin
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Preparing your dashboard...
        </p>
        <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-indigo-500 rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-center shadow-2xl p-6 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="h-8 w-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Access Denied</h1>
            <p className="text-sm text-slate-400">
              You do not have administrative privileges to access the dashboard configuration ecosystem.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'shipped': return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'processing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'pending': return 'bg-slate-800 text-slate-400 border-slate-700'
      default: return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  const toggleAccountStatus = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, status: acc.status === 'Active' ? 'Suspended' : 'Active' }
      }
      return acc
    }))
  }

  const deleteAccount = (id: string) => {
    if (confirm('Are you sure you want to completely revoke access and delete this entity?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id))
    }
  }



  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(accountSearch.toLowerCase()) || 
    acc.email.toLowerCase().includes(accountSearch.toLowerCase()) ||
    acc.role.toLowerCase().includes(accountSearch.toLowerCase())
  )

  // Segregating into Clients (Users) and Workers
  const clientAccounts = filteredAccounts.filter(acc => acc.role === 'User')
  const workerAccounts = filteredAccounts.filter(acc => acc.role !== 'User')

  // Shared Table Render Component to avoid redundant code
  const renderAccountTable = (targetAccounts: typeof accounts) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
            <th className="p-4 px-5">Administrative Entity</th>
            <th className="p-4 px-5">System Role Mapping</th>
            <th className="p-4 px-5">Onboarding Date</th>
            <th className="p-4 px-5 text-center">Status</th>
            <th className="p-4 px-5 text-center">Operational Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40 font-medium text-slate-300">
          {targetAccounts.map(account => (
            <tr key={account.id} className="hover:bg-slate-800/20 transition-colors">
              <td className="p-4 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 font-bold font-mono text-xs">
                    {account.name ? account.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </div>
                  <div>
                    <span className="text-white font-semibold block text-sm">{account.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" /> {account.email}
                    </span>
                  </div>
                </div>
              </td>

              <td className="p-4 px-5">
                <div className="flex items-center gap-1.5 text-slate-200 text-sm">
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">{account.role}</span>
                </div>
              </td>

              <td className="p-4 px-5 font-mono text-xs text-slate-400">
                {account.joined}
              </td>

              <td className="p-4 px-5 text-center">
                {account.status === 'Active' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold font-mono rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3 h-3" /> SUSPENDED
                  </span>
                )}
              </td>

              <td className="p-4 px-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => toggleAccountStatus(account.id)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-semibold border transition-colors",
                      account.status === 'Active'
                        ? "bg-slate-800 border-slate-700 hover:bg-rose-950/30 hover:border-rose-950/60 hover:text-rose-400 text-slate-300"
                        : "bg-indigo-600 border-transparent hover:bg-indigo-500 text-white"
                    )}
                  >
                    {account.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                  <Button 
                    onClick={() => deleteAccount(account.id)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {targetAccounts.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                No profiles mapped to this structural group.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex relative overflow-x-hidden font-sans antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col h-full",
          "lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-white">
            AR<span className="text-indigo-500">Smart</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-400 hover:bg-slate-800 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'manage accounts', label: 'Manage Accounts', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-medium text-sm",
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate">{adminName}</p>
              <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-500 hover:text-rose-400 shrink-0 h-8 w-8"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                router.push('/')
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-slate-900/40 border-b border-slate-800 sticky top-0 z-40 shrink-0 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden shrink-0 text-slate-400 hover:bg-slate-800"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative w-full max-w-xs hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input placeholder="Global search index..." className="w-full pl-9 h-9 bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus-visible:ring-indigo-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
              <Link href="/" target="_self" className="sm:target-blank">
                <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <Eye className="h-4 w-4 mr-0 sm:mr-2 text-indigo-400" />
                  <span className="hidden sm:inline">View Live Store</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0F172A]">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">System Architecture Overview</h1>
                    <p className="text-sm text-slate-400">Aggregated tracking records for retail analytics and active engine logs.</p>
                  </div>
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-full sm:w-40 h-9 bg-slate-900 border-slate-800 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map(stat => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={stat.title} className="bg-slate-900/60 border-slate-800 shadow-sm backdrop-blur-sm">
                        <CardContent className="p-5 flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50">
                              <IconComponent className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className={cn(
                              "flex items-center gap-0.5 text-xs font-bold font-mono px-1.5 py-0.5 rounded",
                              stat.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                            )}>
                              {stat.change}
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-2xl font-bold tracking-tight text-white truncate">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mt-0.5 truncate">{stat.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 bg-slate-900/60 border-slate-800 shadow-sm backdrop-blur-sm">
                    <CardHeader className="p-5">
                      <CardTitle className="text-base font-semibold text-white">Revenue Inflow Timeline</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Monthly conversion margins mapped over active billing cycles.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="h-48 sm:h-60 flex items-end justify-between gap-2 pt-4">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                          <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-slate-800 rounded-t relative overflow-hidden h-full flex flex-col justify-end">
                              <div 
                                className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all cursor-pointer rounded-t"
                                style={{ height: `${45 + (i * 9)}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium font-mono">{month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/60 border-slate-800 shadow-sm backdrop-blur-sm">
                    <CardHeader className="p-5">
                      <CardTitle className="text-base font-semibold text-white">Top Augmented Products</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Most engaged models inside spatial interfaces.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="space-y-4">
                        {products && products.filter(p => p.isBestseller).slice(0, 4).map((product, i) => (
                          <div key={product.id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800/30 transition-colors">
                            <span className="text-xs font-mono font-bold text-slate-600 w-4">{i + 1}</span>
                            <div className="w-10 h-10 rounded bg-slate-800 overflow-hidden border border-slate-700/60 shrink-0">
                              <img src={product.images?.[0] || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-200 truncate">{product.name}</p>
                              <p className="text-xs text-slate-400 font-mono">{product.reviews || 0} spatial interactions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-900/60 border-slate-800 shadow-sm overflow-hidden backdrop-blur-sm">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-semibold text-white">Recent Store Operations</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Live feed monitoring client execution payloads.</CardDescription>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                          <th className="p-4 px-5">Order ID</th>
                          <th className="p-4 px-5">Customer Profile</th>
                          <th className="p-4 px-5">Units</th>
                          <th className="p-4 px-5 text-right">Total Net</th>
                          <th className="p-4 px-5 text-center">Fulfillment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 font-medium text-slate-300">
                        {recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-4 px-5 font-mono text-xs text-slate-400 font-bold">{order.id}</td>
                            <td className="p-4 px-5 text-white font-semibold">{order.customer}</td>
                            <td className="p-4 px-5 font-mono text-xs text-slate-400">{order.products} elements</td>
                            <td className="p-4 px-5 text-right font-mono text-white font-bold">{formatPrice(order.total)}</td>
                            <td className="p-4 px-5 text-center">
                              <Badge className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border bg-transparent", getOrderStatusColor(order.status))}>
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'manage accounts' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">System Access Control</h1>
                    <p className="text-sm text-slate-400">Configure client profiles, worker assignments, and localized visibility parameters.</p>
                  </div>
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 text-sm shadow-md"
                  >
                    <UserPlus className="w-4 h-4" /> Provision Account
                  </Button>
                </div>

                <Tabs defaultValue="users" className="w-full space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                    <TabsList className="bg-slate-950 border border-slate-800/80">
                      <TabsTrigger value="users" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-sm px-4">
                        Users ({clientAccounts.length})
                      </TabsTrigger>
                      <TabsTrigger value="workers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium text-sm px-4">
                        Workers ({workerAccounts.length})
                      </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input 
                        placeholder="Search profiles by identifier keywords..." 
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        className="w-full pl-9 h-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600" 
                      />
                    </div>
                  </div>

                  <TabsContent value="users" className="m-0">
                    <Card className="bg-slate-900/60 border-slate-800 shadow-sm overflow-hidden backdrop-blur-sm">
                      <div className="p-5 border-b border-slate-800">
                        <CardTitle className="text-base font-semibold text-white">Website Clients</CardTitle>
                        <CardDescription className="text-xs text-slate-400">Registered platform accounts executing general customer workflows.</CardDescription>
                      </div>
                      {renderAccountTable(clientAccounts)}
                    </Card>
                  </TabsContent>

                  <TabsContent value="workers" className="m-0">
                    <Card className="bg-slate-900/60 border-slate-800 shadow-sm overflow-hidden backdrop-blur-sm">
                      <div className="p-5 border-b border-slate-800">
                        <CardTitle className="text-base font-semibold text-white">Website Workers</CardTitle>
                        <CardDescription className="text-xs text-slate-400">Internal enterprise staff maintaining operations, logistics, and campaigns.</CardDescription>
                      </div>
                      {renderAccountTable(workerAccounts)}
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="text-indigo-400 w-5 h-5" /> Provision Profile Mapping
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Deploy system handles directly into the active registration registers.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProvisionAccount}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Full Identity Name</label>
                  <Input 
                    required
                    name="username"
                    placeholder="User Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Contact Routing Email</label>
                  <Input 
                    required
                    name="email"
                    type="email"
                    placeholder="user@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Security Authorization Key (Password)</label>
                  <Input 
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Communications Pipeline (Phone Number)</label>
                  <Input 
                    required
                    name="phoneNumber"
                    type="tel"
                    placeholder="+213 XXXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">System Security Role</label>
                  <select 
                    name="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
                  >
                    <option value="USER">User (Client)</option>
                    <option value="MARKETING MANAGER">Marketing Manager</option>
                    <option value="STOCK">Stock Manager</option>
                    <option value="DELIVERY">Delivery Personnel</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Abort
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Commit Entry
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}