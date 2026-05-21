'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Layers,
  Lock,
  Loader2,
  Palette,
  Combine,
  Image as ImageIcon,
  Trash2,
  Pipette
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface Color {
  id: number;
  name: string;
  hexCode: string;
}

interface Variant {
  id: number;
  product_id?: Product;
  color_id?: Color;
  name: string;
  sku: string;
  percentage: number;
  quantity: number;
  description: string;
}

interface Media {
  id: number;
  variant: Variant;
  static_image: string;
  model_3d: string;
}

const BASE_URL = 'https://ar-app-back-end.onrender.com/api'

export default function StockDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('inventory')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [inventory, setInventory] = useState<Product[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [media, setMedia] = useState<Media[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [productForm, setProductForm] = useState({ name: '', quantity: 0, category: '', description: '', heigh: 0, width: 0, depth: 0 })
  const [colorForm, setColorForm] = useState({ name: '', hexCode: '#3b82f6' })
  const [variantForm, setVariantForm] = useState({ productId: '', colorId: '', name: '', sku: '', percentage: 0, quantity: 0, description: '' })
  const [mediaForm, setMediaForm] = useState({ variantId: '', staticImage: '', model3d: '' })

  const hasFetched = useRef(false)

  const getCleanAuthToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem("token")
    if (!token) return null
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim()
    }
    return token
  }, [])

  const fetchAllData = useCallback(async () => {
    const token = getCleanAuthToken();
    if (!token) {
      setFetchError("No valid authentication token found.");
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const [resProducts, resColors, resVariants, resMedia] = await Promise.all([
        fetch(`${BASE_URL}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/colors`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/variants`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/media`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (resProducts.status === 403 || resColors.status === 403 || resVariants.status === 403 || resMedia.status === 403) {
        localStorage.removeItem("token");
        setFetchError("Access Denied (403): Your token is expired or lacks permissions.");
        setIsAuthorized(false); 
        setIsLoading(false);
        return;
      }

      if (!resProducts.ok || !resColors.ok || !resVariants.ok || !resMedia.ok) {
        throw new Error("One or more server endpoints failed to respond correctly.");
      }

      const productsData = await resProducts.json();
      const colorsData = await resColors.json();
      const variantsData = await resVariants.json();
      const mediaData = await resMedia.json();

      setInventory(Array.isArray(productsData) ? productsData : []);
      setColors(Array.isArray(colorsData) ? colorsData : []);
      setVariants(Array.isArray(variantsData) ? variantsData : []);
      setMedia(Array.isArray(mediaData) ? mediaData : []);
      
      setIsAuthorized(true); 
      
    } catch (error) {
      console.error("Database connection failure:", error);
      setFetchError("Network connection failure or CORS mismatch.");
    } finally {
      setIsLoading(false);
    }
  }, [getCleanAuthToken]);

  useEffect(() => {
    const token = getCleanAuthToken();
    if (!token) {
      setIsAuthorized(false);
      setIsLoading(false);
    } else {
      if (!hasFetched.current) {
        hasFetched.current = true;
        fetchAllData();
      }
    }
  }, [getCleanAuthToken, fetchAllData]);

  const handleDelete = async (endpointTarget: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${endpointTarget.slice(0, -1)}?`)) return;
    
    setDeletingId(id);
    try {
      const token = getCleanAuthToken();
      const res = await fetch(`${BASE_URL}/${endpointTarget}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchAllData();
      } else {
        const errText = await res.text();
        alert(`Deletion failed: ${errText || 'Check database constraints (e.g. references)'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred during deletion.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const token = getCleanAuthToken()
      const res = await fetch(`${BASE_URL}/add/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productForm)
      })
      if (res.ok) {
        setActiveModal(null)
        setProductForm({ name: '', quantity: 0, category: '', description: '', heigh: 0, width: 0, depth: 0 })
        fetchAllData()
      } else alert(await res.text())
    } catch (err) { console.error(err) }
    setIsSubmitting(false)
  }

  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const token = getCleanAuthToken()
      const res = await fetch(`${BASE_URL}/add/colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(colorForm)
      })
      if (res.ok) {
        setActiveModal(null)
        setColorForm({ name: '', hexCode: '#3b82f6' })
        fetchAllData()
      } else alert(await res.text())
    } catch (err) { console.error(err) }
    setIsSubmitting(false)
  }

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const token = getCleanAuthToken()
      const payload = {
        productId: Number(variantForm.productId),
        colorId: Number(variantForm.colorId),
        name: variantForm.name,
        sku: variantForm.sku,
        percentage: Number(variantForm.percentage),
        quantity: Number(variantForm.quantity),
        description: variantForm.description
      }
      const res = await fetch(`${BASE_URL}/variants/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setActiveModal(null)
        setVariantForm({ productId: '', colorId: '', name: '', sku: '', percentage: 0, quantity: 0, description: '' })
        fetchAllData()
      } else alert(await res.text())
    } catch (err) { console.error(err) }
    setIsSubmitting(false)
  }

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const token = getCleanAuthToken()
      const payload = {
        variantId: Number(mediaForm.variantId),
        staticImage: mediaForm.staticImage,
        model3d: mediaForm.model3d
      }
      const res = await fetch(`${BASE_URL}/media/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setActiveModal(null)
        setMediaForm({ variantId: '', staticImage: '', model3d: '' })
        fetchAllData()
      } else alert(await res.text())
    } catch (err) { console.error(err) }
    setIsSubmitting(false)
  }

  const handleSignOut = () => {
    localStorage.clear() 
    setIsAuthorized(false)
    router.push('/account')
  }


  const filteredInventory = inventory.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStockStatus = (qty: number) => {
    if (qty === 0) return { label: 'Out of Stock', color: 'text-red-500' };
    if (qty <= 5) return { label: 'Low Stock', color: 'text-amber-500' };
    return { label: 'In Stock', color: 'text-green-400' };
  }

  return (
    <div className="min-h-screen bg-[#121212] flex overflow-x-hidden text-slate-200">
      {/* --- SIDEBAR --- */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[52] w-64 bg-zinc-950 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <span className="font-bold text-xl tracking-tight flex items-center gap-2 text-white">
              <Layers className="text-blue-500 h-5 w-5" /> AR<span className="text-blue-500">Stock</span>
            </span>
            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'inventory', label: 'Products', icon: Package },
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'variants', label: 'Variants', icon: Combine },
              { id: 'media', label: 'Media Assets', icon: ImageIcon },
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

          <div className="p-4 border-t border-white/5 bg-zinc-950/50">
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left group">
              <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN PANEL --- */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="bg-zinc-950 p-4 flex items-center justify-between border-b border-white/5 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-bold text-md tracking-tight flex items-center gap-2 text-white">
            <Layers className="text-blue-500 h-4 w-4" /> AR<span className="text-blue-500">Stock</span>
          </span>
          <div className="w-6 h-6" />
        </header>

        <main className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight capitalize">{activeTab} Management</h1>
              <p className="text-sm text-zinc-400">Monitor and update your Render database records.</p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500" />
              </div>
              <Button onClick={() => setActiveModal(activeTab)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add {activeTab.slice(0, -1)}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm animate-pulse">Synchronizing with Render application services...</p>
            </div>
          ) : fetchError && isAuthorized === true ? (
            <div className="flex flex-col items-center justify-center py-12 bg-red-500/5 rounded-xl border border-red-500/10 text-center">
              <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
              <p className="text-white font-semibold">Database Sync Error</p>
              <p className="text-xs text-zinc-400 max-w-sm">{fetchError}</p>
            </div>
          ) : (
            <>
              {activeTab === 'inventory' && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredInventory.map(item => {
                    const status = getStockStatus(item.quantity);
                    return (
                      <Card key={item.id} className="bg-zinc-900 border-none ring-1 ring-white/5 shadow-xl flex flex-col relative group">
                        <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <Badge className="bg-zinc-800 text-zinc-400">{item.category}</Badge>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 font-mono">#{item.id}</span>
                              <button 
                                onClick={() => handleDelete('products', item.id)} 
                                disabled={deletingId === item.id}
                                className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                              >
                                {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <h3 className="font-bold text-white text-lg">{item.name}</h3>
                          <p className="text-xs text-zinc-400 flex-1">{item.description}</p>
                          <div className="bg-zinc-950 rounded p-2 text-xs font-mono text-zinc-400">
                            Dim: {item.heigh}H × {item.width}W × {item.depth}D cm
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <span className={cn("text-xs font-bold", status.color)}>{status.label}</span>
                            <span className="text-sm font-bold text-white">{item.quantity} units</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                  {colors.map(color => (
                    <Card key={color.id} className="bg-zinc-900 border-none ring-1 ring-white/5 relative group">
                      <button 
                        onClick={() => handleDelete('colors', color.id)} 
                        disabled={deletingId === color.id}
                        className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 p-1 transition-colors z-10"
                      >
                        {deletingId === color.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                      <CardContent className="p-4 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg" style={{ backgroundColor: color.hexCode }} />
                        <div className="text-center">
                          <p className="font-bold text-white text-sm truncate max-w-[100px]">{color.name}</p>
                          <p className="text-xs text-zinc-500 font-mono">{color.hexCode}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'variants' && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {variants.map(variant => (
                    <Card key={variant.id} className="bg-zinc-900 border-none ring-1 ring-white/5 shadow-xl">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge className="bg-blue-500/10 text-blue-400">SKU: {variant.sku}</Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">ID: #{variant.id}</span>
                            <button 
                              onClick={() => handleDelete('variants', variant.id)} 
                              disabled={deletingId === variant.id}
                              className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                            >
                              {deletingId === variant.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-white">{variant.name}</h3>
                        <p className="text-xs text-zinc-400">{variant.description}</p>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="bg-zinc-950 p-2 rounded text-xs text-zinc-300">
                            <span className="block text-zinc-500">Stock</span> {variant.quantity} units
                          </div>
                          <div className="bg-zinc-950 p-2 rounded text-xs text-zinc-300">
                            <span className="block text-zinc-500">Scale</span> {variant.percentage}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'media' && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {media.map(item => (
                    <Card key={item.id} className="bg-zinc-900 border-none ring-1 ring-white/5 relative group">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img src={item.static_image} alt="Media Asset" className="w-full h-48 object-cover rounded-t-xl" />
                          <button 
                            onClick={() => handleDelete('media', item.id)} 
                            disabled={deletingId === item.id}
                            className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full text-zinc-300 hover:text-red-400 p-2 transition-colors"
                          >
                            {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-sm font-bold text-white truncate">Linked to Variant ID: #{item.variant?.id}</p>
                          <p className="text-xs text-zinc-400 font-mono truncate">Model: {item.model_3d || 'None'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- OVERLAY MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="bg-zinc-950 border border-white/10 w-full max-w-lg shadow-2xl relative">
            <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
            
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 capitalize">Add New {activeModal.slice(0, -1)}</h2>
              
              {activeModal === 'inventory' && (
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Name</label><Input required className="bg-zinc-900 border-white/10 text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Category</label><Input required className="bg-zinc-900 border-white/10 text-white" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Quantity</label><Input type="number" required className="bg-zinc-900 border-white/10 text-white" value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Height</label><Input type="number" className="bg-zinc-900 border-white/10 text-white" value={productForm.heigh} onChange={e => setProductForm({...productForm, heigh: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Width</label><Input type="number" className="bg-zinc-900 border-white/10 text-white" value={productForm.width} onChange={e => setProductForm({...productForm, width: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Depth</label><Input type="number" className="bg-zinc-900 border-white/10 text-white" value={productForm.depth} onChange={e => setProductForm({...productForm, depth: Number(e.target.value)})} /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs text-zinc-400">Description</label><Input className="bg-zinc-900 border-white/10 text-white" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white mt-4">{isSubmitting ? 'Saving...' : 'Save Product'}</Button>
                </form>
              )}

              {/* --- INTERACTIVE VISUAL PALETTE COLOR PICKER --- */}
              {activeModal === 'colors' && (
                <form onSubmit={handleAddColor} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Color Designation Name</label>
                    <Input required placeholder="e.g. Royal Blue" className="bg-zinc-900 border-white/10 text-white" value={colorForm.name} onChange={e => setColorForm({...colorForm, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block">Click Panel to Pick Visual Shade</label>
                    <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-3 rounded-md transition-all">
                      {/* Interactive block input that launches the color dashboard */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/20 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0 cursor-pointer">
                        <input 
                          type="color" 
                          className="absolute inset-0 scale-150 cursor-pointer opacity-100" 
                          value={colorForm.hexCode} 
                          onChange={e => setColorForm({...colorForm, hexCode: e.target.value})} 
                        />
                      </div>
                      
                      {/* Synchronized readout text display box */}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs block text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Hex Code Captured</span>
                        <div className="flex items-center gap-1.5 font-mono text-sm text-white font-semibold">
                          <Pipette className="h-3.5 w-3.5 text-blue-500" />
                          {colorForm.hexCode.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white mt-4 shadow-lg shadow-blue-600/20">{isSubmitting ? 'Saving...' : 'Save New Color Matrix'}</Button>
                </form>
              )}

              {activeModal === 'variants' && (
                <form onSubmit={handleAddVariant} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Select Product</label>
                    <select required className="w-full bg-zinc-900 border border-white/10 text-white p-2 rounded-md" value={variantForm.productId} onChange={e => setVariantForm({...variantForm, productId: e.target.value})}>
                      <option value="">-- Choose Product --</option>
                      {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Select Color</label>
                    <select required className="w-full bg-zinc-900 border border-white/10 text-white p-2 rounded-md" value={variantForm.colorId} onChange={e => setVariantForm({...variantForm, colorId: e.target.value})}>
                      <option value="">-- Choose Color --</option>
                      {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Variant Name</label><Input required className="bg-zinc-900 border-white/10 text-white" value={variantForm.name} onChange={e => setVariantForm({...variantForm, name: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">SKU</label><Input required className="bg-zinc-900 border-white/10 text-white" value={variantForm.sku} onChange={e => setVariantForm({...variantForm, sku: e.target.value})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Scale/Percentage</label><Input type="number" required className="bg-zinc-900 border-white/10 text-white" value={variantForm.percentage} onChange={e => setVariantForm({...variantForm, percentage: Number(e.target.value)})} /></div>
                    <div className="space-y-1"><label className="text-xs text-zinc-400">Quantity</label><Input type="number" required className="bg-zinc-900 border-white/10 text-white" value={variantForm.quantity} onChange={e => setVariantForm({...variantForm, quantity: Number(e.target.value)})} /></div>
                  </div>
                  <div className="space-y-1"><label className="text-xs text-zinc-400">Description</label><Input className="bg-zinc-900 border-white/10 text-white" value={variantForm.description} onChange={e => setVariantForm({...variantForm, description: e.target.value})} /></div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white mt-4">{isSubmitting ? 'Saving...' : 'Save Variant'}</Button>
                </form>
              )}

              {activeModal === 'media' && (
                <form onSubmit={handleAddMedia} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Select Variant</label>
                    <select required className="w-full bg-zinc-900 border border-white/10 text-white p-2 rounded-md" value={mediaForm.variantId} onChange={e => setMediaForm({...mediaForm, variantId: e.target.value})}>
                      <option value="">-- Choose Variant --</option>
                      {variants.map(v => <option key={v.id} value={v.id}>{v.name} (SKU: {v.sku})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-xs text-zinc-400">Image URL</label><Input required className="bg-zinc-900 border-white/10 text-white" value={mediaForm.staticImage} onChange={e => setMediaForm({...mediaForm, staticImage: e.target.value})} placeholder="https://..." /></div>
                  <div className="space-y-1"><label className="text-xs text-zinc-400">3D Model URL</label><Input className="bg-zinc-900 border-white/10 text-white" value={mediaForm.model3d} onChange={e => setMediaForm({...mediaForm, model3d: e.target.value})} placeholder="https://..." /></div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white mt-4">{isSubmitting ? 'Saving...' : 'Save Media'}</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}