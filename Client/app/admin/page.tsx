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

// Explicitly define the database mapping layout to satisfy TypeScript
interface Account {
  id: number;
  username: string;
  email: string;
  phoneNumber: number;
  active: boolean;
  roleName: string;
}

// Mock data for dashboard analytics
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

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Live Database Accounts States
  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountSearch, setAccountSearch] = useState('')
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(true)

  // Modal State Form Control
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('User')
  const [newPassword, setNewPassword] = useState('')
  const [newPhone, setNewPhone] = useState('')
  
  const [adminName, setAdminName] = useState('Admin User')
  const [adminEmail, setAdminEmail] = useState('admin@Gmail.com')

  // Fetch live profiles out of PostgreSQL database
  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://ar-app-back-end.onrender.com/api/admin/accounts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch database profiles: ${response.status}`);
      }

      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Database compilation retrieve failure:", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Submission handler talking to Spring Boot endpoints
  const handleProvisionAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newName || !newEmail || !newPassword || !newPhone) {
      alert("Please populate all administrative mapping fields.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://ar-app-back-end.onrender.com/api/admin/add/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          username: newName,
          email: newEmail,
          password: newPassword,
          phoneNumber: Number(newPhone), 
          role: newRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "An error occurred during account routing provisioning.");
        return;
      }

      alert(data.message);
      
      // Reset State parameters & refresh database stream
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setNewRole('User');
      setIsModalOpen(false);
      
      fetchAccounts();

    } catch (error) {
      console.error("Network communication failure:", error);
      alert("Could not reach administrative server systems.");
    }
  }

  // Toggle active / suspended account system states
  const toggleAccountStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const nextStatus = !currentStatus; 

      const response = await fetch(`https://ar-app-back-end.onrender.com/api/admin/status/${userId}?active=${nextStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server status change failure: ${response.status}`);
      }

      const data = await response.json();
      console.log("Status updated successfully:", data);

      fetchAccounts();

    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Could not update account status.");
    }
  };

  const deleteAccount = (id: number) => {
    if (confirm('Are you sure you want to completely revoke access and delete this entity?')) {
      // Logic for deleting from database can go here. For now, filter locally:
      setAccounts(prev => prev.filter(acc => acc.id !== id))
    }
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
      
      fetchAccounts();

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

  const filteredAccounts = accounts.filter(acc => 
    (acc.username || '').toLowerCase().includes(accountSearch.toLowerCase()) || 
    (acc.email || '').toLowerCase().includes(accountSearch.toLowerCase()) ||
    (acc.roleName || '').toLowerCase().includes(accountSearch.toLowerCase())
  )

  const clientAccounts = filteredAccounts.filter(acc => acc.roleName === 'CLIENT')
  const workerAccounts = filteredAccounts.filter(acc => acc.roleName !== 'CLIENT')

  const renderAccountTable = (targetAccounts: Account[]) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="bg-slate-800/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
            <th className="p-4 px-5">Administrative Entity</th>
            <th className="p-4 px-5">System Role Mapping</th>
            <th className="p-4 px-5">Phone Number</th>
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
                    {account.username ? account.username.split('_').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="text-white font-semibold block text-sm">{account.username}</span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" /> {account.email}
                    </span>
                  </div>
                </div>
              </td>

              <td className="p-4 px-5">
                <div className="flex items-center gap-1.5 text-slate-200 text-sm">
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">{account.roleName}</span>
                </div>
              </td>

              <td className="p-4 px-5 font-mono text-xs text-slate-400">
                {account.phoneNumber || 'N/A'}
              </td>

              <td className="p-4 px-5 text-center">
                {account.active ? (
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
                    onClick={() => toggleAccountStatus(account.id, account.active)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-semibold border transition-colors",
                      account.active 
                        ? "bg-slate-800 border-slate-700 hover:bg-rose-950/30 hover:border-rose-950/60 text-slate-300"
                        : "bg-indigo-600 border-transparent hover:bg-indigo-500 text-white"
                    )}
                  >
                    {account.active ? 'Suspend' : 'Reactivate'}
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

      {/* Sidebar Navigation Context */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <Shield className="h-6 w-6 text-indigo-500" />
            <span>AR <span className="text-indigo-400">Smart</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'accounts', label: 'User Accounts', icon: Users },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/10" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-lg mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold font-mono text-sm border border-slate-700/50">
              AD
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">{adminName}</h4>
              <p className="text-xs text-slate-500 truncate font-mono">{adminEmail}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            className="w-full border-slate-800 bg-slate-900/40 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 text-slate-400 justify-start gap-2"
          >
            <LogOut className="h-4 w-4 text-slate-500 hover:text-rose-400" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Panel Frame Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-white capitalize tracking-wide hidden sm:block">
              {activeTab === 'overview' ? 'Operational Hub Overview' : 'System Registry Access Control'}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <Card key={i} className="bg-slate-900 border-slate-800/80 shadow-md">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{stat.title}</p>
                          <h3 className="text-2xl font-bold text-white font-mono">{stat.value}</h3>
                        </div>
                        <div className="p-3 bg-slate-800/60 rounded border border-slate-700/40 text-indigo-400">
                          <Icon className="h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 bg-slate-900 border-slate-800/80 shadow-xl">
                  <CardHeader className="border-b border-slate-800/60 bg-slate-950/20 p-5 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-white">Recent System Transactions</CardTitle>
                      <CardDescription className="text-xs text-slate-400 mt-0.5">Live e-commerce product flow data logs.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-800/30 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                            <th className="p-4 px-5">Order ID</th>
                            <th className="p-4 px-5">Customer Handle</th>
                            <th className="p-4 px-5 text-center">Volume</th>
                            <th className="p-4 px-5 text-right">Aggregate</th>
                            <th className="p-4 px-5 text-center">Routing Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30 font-medium text-slate-300">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-800/10 transition-colors">
                              <td className="p-4 px-5 font-mono text-xs font-bold text-indigo-400">{order.id}</td>
                              <td className="p-4 px-5 text-white font-semibold text-sm">{order.customer}</td>
                              <td className="p-4 px-5 text-center font-mono text-xs">{order.products} items</td>
                              <td className="p-4 px-5 text-right font-mono text-white text-sm">{formatPrice(order.total)}</td>
                              <td className="p-4 px-5 text-center">
                                <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold font-mono tracking-wide uppercase rounded border", getOrderStatusColor(order.status))}>
                                  {order.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800/80 shadow-xl">
                  <CardHeader className="border-b border-slate-800/60 bg-slate-950/20 p-5">
                    <CardTitle className="text-base font-bold text-white">Catalog Summary Metrics</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">Asset distributions inside the repository mapping.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 font-medium">
                    <div className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><ShoppingCart className="w-4 h-4" /></div>
                        <div>
                          <span className="text-sm font-semibold text-white block">Active Catalog Items</span>
                          <span className="text-[11px] text-slate-500 font-mono">Live retail items</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold font-mono text-white">{products.length}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><LayoutDashboard className="w-4 h-4" /></div>
                        <div>
                          <span className="text-sm font-semibold text-white block">Categorical Sort Vectors</span>
                          <span className="text-[11px] text-slate-500 font-mono">Database distinct keys</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold font-mono text-white">{categories.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800/80 shadow-md">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    placeholder="Search accounts via identifiers, endpoints, parameters..." 
                    className="pl-10 bg-slate-950 border-slate-800 focus-visible:ring-indigo-600 text-slate-200 text-sm h-10 rounded-lg placeholder:text-slate-600"
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/10 text-sm h-10 gap-2 px-4 shrink-0">
                  <UserPlus className="w-4 h-4" /> Provision Account
                </Button>
              </div>

              {isLoadingAccounts ? (
                <div className="p-12 text-center text-slate-500 text-sm animate-pulse">
                  Streaming secure real-time accounts architecture...
                </div>
              ) : (
                <Card className="bg-slate-900 border-slate-800/80 shadow-2xl overflow-hidden">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-5 pt-4 bg-slate-950/20 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <TabsList className="bg-slate-950 border border-slate-800/60 p-1 rounded-lg self-start mb-3 sm:mb-0">
                        <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs px-4 py-1.5 font-semibold">System Registry ({filteredAccounts.length})</TabsTrigger>
                        <TabsTrigger value="clients" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs px-4 py-1.5 font-semibold">Clients ({clientAccounts.length})</TabsTrigger>
                        <TabsTrigger value="workers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs px-4 py-1.5 font-semibold">Staff & Operations ({workerAccounts.length})</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="m-0 border-0 outline-none">{renderAccountTable(filteredAccounts)}</TabsContent>
                    <TabsContent value="clients" className="m-0 border-0 outline-none">{renderAccountTable(clientAccounts)}</TabsContent>
                    <TabsContent value="workers" className="m-0 border-0 outline-none">{renderAccountTable(workerAccounts)}</TabsContent>
                  </Tabs>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Account Provisioning Modal Overlay Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-slate-950/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-400" /> Provision Operational Account
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 mt-0.5">Commit new cryptographic identities to PostgreSQL context.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white h-8 w-8 rounded-md" onClick={() => setIsModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleProvisionAccount}>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Profile Username</label>
                  <Input 
                    required
                    placeholder="e.g., mohamed_delivery" 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-indigo-600 text-sm h-10"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Electronic Mail Routing Interface</label>
                  <Input 
                    required
                    type="email"
                    placeholder="e.g., delivery@arsmart.com" 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-indigo-600 text-sm h-10"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">System Security Cryptographic Credentials</label>
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-indigo-600 text-sm h-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Contact Parameter String (Integer Schema)</label>
                  <Input 
                    required
                    type="tel"
                    placeholder="e.g., 2137701234" 
                    className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-700 focus-visible:ring-indigo-600 text-sm h-10"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">System Role Authorization Scope</label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200 focus:ring-indigo-600 text-sm h-10">
                      <SelectValue placeholder="Assign Role Structure" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800 text-slate-300">
                      <SelectItem value="CLIENT" className="focus:bg-indigo-600 focus:text-white text-sm">CLIENT (User)</SelectItem>
                      <SelectItem value="ADMIN" className="focus:bg-indigo-600 focus:text-white text-sm">ADMIN (Full Authority)</SelectItem>
                      <SelectItem value="DELIVERY" className="focus:bg-indigo-600 focus:text-white text-sm">DELIVERY (Logistics Operations)</SelectItem>
                      <SelectItem value="STOCK" className="focus:bg-indigo-600 focus:text-white text-sm">STOCK (Warehouse & Inventory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60 mt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800/60 h-10 font-semibold text-sm px-4">
                    Abort
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 h-10 font-bold text-sm px-5">
                    Provision Entry
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}