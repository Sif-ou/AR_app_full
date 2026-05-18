'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
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
  Lock,
  Loader2,
  Maximize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// TS interface representing your Spring Boot Entity structure
interface Product {
  id: number;
  name: string;
  quantity: number;
  category: string;
  description: string;
  heigh: number;
  width: number;
  depth: number;
}

export default function StockDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('inventory')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Dynamic API state definitions
  const [inventory, setInventory] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  // --- ROLE AND SECURITY VERIFICATION ---
  useEffect(() => {
    const mockUser = {
      isAuthenticated: true, 
      roles: ["STOCK"] 
    }
    const hasStockAccess = mockUser.isAuthenticated && mockUser.roles.includes("STOCK");
    setIsAuthorized(hasStockAccess)
  }, [])

  // --- FETCH PRODUCTS FROM RENDER BACKEND ---
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('https://ar-app-back-end.onrender.com/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to retrieve inventory database updates.')
        }
        
        const data = await response.json()
        setInventory(data)
        setFetchError(null)
      } catch (err: any) {
        setFetchError(err.message || 'Something went wrong fetching data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [isAuthorized])

  const handleSignOut = () => {
    localStorage.clear()     
    router.replace('/')      
  }

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-[#121212]" />
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 font-sans antialiased">
        <Card className="bg-zinc-900 border-none ring-1 ring-white/10 p-8 max-w-sm text-center shadow-2xl">
          <div className="inline-flex p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold text-white mb-2">Access Denied</CardTitle>
          <CardDescription className="text-zinc-400 text-sm mb-6">
            You lack inventory control clearance. This layout requires an active session with 
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

  // Filter backend products dynamically via frontend search bar
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Helper utility to calculate UI badge parameters based on SQL quantity limits
  const getStockStatus = (qty: number) => {
    if (qty === 0) return { label: 'Out of Stock', color: 'text-red-500' };
    if (qty <= 5) return { label: 'Low Stock', color: 'text-amber-500' };
    return { label: 'In Stock', color: 'text-green-400' };
  }

  return (
    <div className="min-h-screen bg-[#121212] flex overflow-x-hidden text-slate-200">
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
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/5" onClick={() => setSidebarOpen(false)}>
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

          <div className="p-4 border-t border-white/5 bg-zinc-900/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">S</div>
                <div className="truncate">
                  <p className="text-sm font-medium text-white truncate">Stock Manager</p>
                  <p className="text-[11px] text-zinc-500 font-mono">ID-8849</p>
                </div>
              </div>
              <button onClick={handleSignOut} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all focus:outline-none">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-zinc-950 p-4 flex items-center justify-between border-b border-white/5 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-white hover:bg-white/5">
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-bold text-md tracking-tight flex items-center gap-2 text-white">
            <Layers className="text-blue-500 h-4 w-4" /> AR<span className="text-blue-500">Stock</span>
          </span>
          <div className="w-6 h-6" />
        </header>

        <main className="p-4 sm:p-6 space-y-6">
          {activeTab === 'inventory' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Stock</h1>
                  <p className="text-sm text-zinc-400">Monitor quantities, dimensions, and categories linked to your live Render database.</p>
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
                    placeholder="Search by item title or category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-900 border-white/10 text-white placeholder-zinc-500 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                </div>
                <Button variant="outline" className="border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* API Loading / Error / Grid Layout Handling */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-sm animate-pulse">Synchronizing with Render application services...</p>
                </div>
              ) : fetchError ? (
                <div className="flex flex-col items-center justify-center py-12 bg-red-500/5 rounded-xl border border-red-500/10 p-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                  <p className="text-white font-semibold mb-1">Database Sync Error</p>
                  <p className="text-xs text-zinc-400 max-w-sm">{fetchError}</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/30 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-sm">No live items matched your search text options.</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredInventory.map(item => {
                    const status = getStockStatus(item.quantity);
                    return (
                      <Card key={item.id} className="bg-zinc-900 border-none ring-1 ring-white/5 overflow-hidden transition-all hover:ring-white/10 shadow-xl flex flex-col justify-between">
                        <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          
                          {/* Categorization Headers */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono font-medium text-zinc-500">ID: #{item.id}</span>
                              <Badge className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800 border-none text-[10px] uppercase font-bold">{item.category}</Badge>
                            </div>
                            <h3 className="font-bold text-base text-white line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-zinc-400 line-clamp-2 min-h-[2rem] leading-relaxed">{item.description || "No item description configured."}</p>
                          </div>

                          {/* Dimensions & Physical Metrics Block */}
                          <div className="bg-zinc-950/50 rounded-lg p-2.5 border border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                            <div className="flex items-center gap-1"><Maximize2 className="h-3 w-3 text-blue-500" /> Dim:</div>
                            <div>{item.heigh || 0}H × {item.width || 0}W × {item.depth || 0}D cm</div>
                          </div>

                          {/* Live Inventory Status Metrics */}
                          <div className="border-t border-white/5 pt-3 mt-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Metrics Status</p>
                                <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Quantity</p>
                                <span className={cn("text-sm font-bold flex items-center justify-end gap-1", status.color)}>
                                  {item.quantity === 0 ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                  {item.quantity} units
                                </span>
                              </div>
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
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