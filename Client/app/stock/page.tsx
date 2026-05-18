'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  LogOut,
  Layers,
  History,
  TrendingUp,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data for Stock Management
const mockInventory = [
  { id: 'STK-001', name: 'Nordic Oak Dining Table', category: 'Tables', SKU: 'DK-NODT-01', stock: 12, status: 'in-stock', price: '$450' },
  { id: 'STK-002', name: 'Ergonomic Mesh Office Chair', category: 'Chairs', SKU: 'DK-EMOC-04', stock: 3, status: 'low-stock', price: '$180' },
  { id: 'STK-003', name: 'Minimalist Fabric Sofa 3-Seater', category: 'Sofas', SKU: 'DK-MFS3-09', stock: 0, status: 'out-of-stock', price: '$899' },
  { id: 'STK-004', name: 'Industrial Metal Floor Lamp', category: 'Lighting', SKU: 'DK-IMFL-12', stock: 25, status: 'in-stock', price: '$75' },
]

export default function StockDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('inventory')
  const [searchQuery, setSearchQuery] = useState('')
  
  // State to determine if authorization evaluation is completed
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  // --- ROLE AND SECURITY VERIFICATION ---
  useEffect(() => {
    // Replace this mock logic with your persistent user management hook or state if needed
    // e.g., const user = JSON.parse(localStorage.getItem('user'))
    const mockUser = {
      isAuthenticated: true, 
      roles: ["STOCK"] // If you remove "STOCK", it hits the access guard instantly.
    }

    const hasStockAccess = mockUser.isAuthenticated && mockUser.roles.includes("STOCK");
    
    if (!hasStockAccess) {
      setIsAuthorized(false)
    } else {
      setIsAuthorized(true)
    }
  }, [])

  // --- SIGN OUT HANDLER ---
  const handleSignOut = () => {
    localStorage.clear()     // Wipes all local session states
    router.replace('/')      // Redirects away instantly and prevents moving back via browser history
  }

  // Prevent flash or layout shifts while checking roles
  if (isAuthorized === null) {
    return <div className="min-h-screen bg-[#121212]" />
  }

  // --- ACCESS GUARD RENDER ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 font-sans antialiased">
        <Card className="bg-zinc-900 border-none ring-1 ring-white/10 p-8 max-w-sm text-center shadow-2xl">
          <div className="inline-flex p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-white mb-2">Access Denied</CardTitle>
          <CardDescription className="text-zinc-400 text-sm mb-6">
            You are not authenticated or your account lacks inventory control clearance. This layout requires an active session with 
            <code className="text-blue-400 bg-black px-1.5 py-0.5 rounded ml-1 text-xs font-mono">STOCK</code> security permissions.
          </CardDescription>
          <Button 
            onClick={() => router.push('/login')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  // --- STANDARD AUTHORIZED RENDER ---
  return (
    <div className="min-h-screen bg-[#121212] flex overflow-x-hidden text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[51] lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[52] w-64 bg-zinc-950 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <span className="font-bold text-xl tracking-tight flex items-center gap-2 text-white">
              <Layers className="text-blue-500 h-5 w-5" /> AR<span className="text-blue-500">Stock</span>
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/5" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'inventory', label: 'Live Inventory', icon: Package },
              { id: 'logs', label: 'Stock Logs', icon: History },
              { id: 'analytics', label: 'Supply Analytics', icon: TrendingUp },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-medium",
                  activeTab === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Signout Area */}
          <div className="p-4 border-t border-white/5 bg-zinc-900/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                  S
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">Stock Manager</p>
                  <p className="text-[11px] text-zinc-500 font-mono">ID-8849</p>
                </div>
              </div>
              
              {/* Functional Signout Button */}
              <button 
                onClick={handleSignOut} 
                className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all focus:outline-none"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="bg-zinc-950 p-4 flex items-center justify-between border-b border-white/5 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/5"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-bold text-md tracking-tight flex items-center gap-2 text-white">
            <Layers className="text-blue-500 h-4 w-4" /> AR<span className="text-blue-500">Stock</span>
          </span>
          <div className="w-6 h-6" />
        </header>

        {/* Dashboard Actions and Content Views */}
        <main className="p-4 sm:p-6 space-y-6">
          {activeTab === 'inventory' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Stock</h1>
                  <p className="text-sm text-zinc-400">Monitor quantities, SKUs, and items cataloged across local warehouses.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-blue-600/10">
                  <Plus className="h-4 w-4" /> Add Stock Item
                </Button>
              </div>

              {/* Utility Search Controls */}
              <div className="flex gap-3 max-w-md items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                    placeholder="Search by product name or SKU..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-900 border-white/10 text-white placeholder-zinc-500 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                </div>
                <Button variant="outline" className="border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Grid Render of Stock Elements */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {mockInventory
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.SKU.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(item => (
                    <Card key={item.id} className="bg-zinc-900 border-none ring-1 ring-white/5 overflow-hidden transition-all hover:ring-white/10 shadow-xl">
                      <CardContent className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-semibold text-zinc-500">{item.SKU}</span>
                            <Badge className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800 border-none text-[10px] uppercase font-bold">{item.category}</Badge>
                          </div>
                          <h3 className="font-bold text-lg text-white truncate">{item.name}</h3>
                        </div>

                        <div className="flex flex-row xl:items-center justify-between xl:justify-end gap-6 border-t border-white/5 pt-3 xl:border-none xl:pt-0">
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Unit Value</p>
                            <p className="font-semibold text-white">{item.price}</p>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Available Stock</p>
                            <span className={cn(
                              "text-md font-bold flex items-center justify-end gap-1.5",
                              item.status === 'in-stock' && "text-green-400",
                              item.status === 'low-stock' && "text-amber-500",
                              item.status === 'out-of-stock' && "text-red-500"
                            )}>
                              {item.status === 'out-of-stock' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                              {item.stock} units
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </>
          )}

          {activeTab !== 'inventory' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <AlertTriangle className="h-12 w-12 text-zinc-700 mb-4" />
               <h2 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')} View</h2>
               <p className="text-zinc-500 text-sm max-w-xs mx-auto">Connecting data channels... This structural panel is currently being updated with active tracking entries.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}