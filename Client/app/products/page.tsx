'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SlidersHorizontal, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

// Static lookup fallback for UI filter layout selections
import { categories } from '@/lib/data' 

const RENDER_BACKEND_URL = 'https://ar-app-back-end.onrender.com' 

type SortOption = 'featured' | 'alpha-asc' | 'alpha-desc' | 'qty-high' | 'qty-low'

// TypeScript definitions mapping directly to your Spring Boot Entities
interface ColorEntity {
  id: number;
  name: string;
  hexCode: string;
}

interface MediaEntity {
  id: number;
  static_image: string;
  model_3d: string | null;
}

interface VariantEntity {
  id: number;
  name: string;
  sku: string;
  percentage: number;
  quantity: number;
  description: string | null;
  color_id?: ColorEntity; // Maps via getColor_id JSON serialization
  medias: MediaEntity[];
}

interface ProductEntity {
  id: number;
  name: string;
  quantity: number;
  category: string;
  description: string | null;
  heigh: number;
  width: number;
  depth: number;
  variants: VariantEntity[];
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground animate-pulse">Initializing AR Gallery...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()

  // State Management typed to match your backend model structure
  const [dbProducts, setDbProducts] = useState<ProductEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [qtyRange, setQtyRange] = useState([0, 500]) // Replaced price with product quantity since price is omitted in Java files
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Fetch live records from your Spring Boot Render Backend
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${RENDER_BACKEND_URL}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error(`Server tracking issue: Status ${response.status}`)
        }
        
        const data = await response.json()
        setDbProducts(data)
      } catch (err: any) {
        console.error("Failed to fetch products from Render:", err)
        setError(err.message || "Failed to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category && categories.find(c => c.id === category)) {
      setSelectedCategories([category])
    }
  }, [searchParams])

  // Compute Filters and Sorting locally on your entity structural tree
  const filteredProducts = useMemo(() => {
    return dbProducts
      .filter(product => {
        const productName = product.name ? String(product.name) : ''
        const productDesc = product.description ? String(product.description) : ''
        const productCategory = product.category ? String(product.category) : ''
        const productQty = typeof product.quantity === 'number' ? product.quantity : 0

        const matchesSearch = 
          productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          productDesc.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory.toLowerCase())
        const matchesQty = productQty >= qtyRange[0] && productQty <= qtyRange[1]
        
        return matchesSearch && matchesCategory && matchesQty
      })
      .sort((a, b) => {
        if (sortBy === 'alpha-asc') return a.name.localeCompare(b.name)
        if (sortBy === 'alpha-desc') return b.name.localeCompare(a.name)
        if (sortBy === 'qty-high') return (b.quantity || 0) - (a.quantity || 0)
        if (sortBy === 'qty-low') return (a.quantity || 0) - (b.quantity || 0)
        return 0 // Featured keeps the database ordering
      })
  }, [dbProducts, searchQuery, selectedCategories, qtyRange, sortBy])

  const clearFilters = () => {
    setSelectedCategories([])
    setQtyRange([0, 500])
    setSearchQuery('')
  }

  const isFiltered = selectedCategories.length > 0 || qtyRange[0] !== 0 || qtyRange[1] !== 500

  // Helper parsing logic transformation to format backend data for the custom ProductCard UI component safely
  const adaptProductForCard = (product: ProductEntity) => {
    // Falls back safely if variants list array arrives empty
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null
    const firstMedia = firstVariant && firstVariant.medias && firstVariant.medias.length > 0 ? firstVariant.medias[0] : null

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '',
      // Since your entity lacks "price", we substitute with dimensions or default placeholders dynamically
      price: 299, 
      rating: 4.8,
      // Extracted deeply from Variant -> Media array structures
      image: firstMedia?.static_image || '/placeholder-furniture.jpg', 
      model3d: firstMedia?.model_3d || undefined,
      isNew: product.quantity > 20,
      dimensions: `${product.width}W x ${product.depth}D x ${product.heigh}H cm`
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <CartDrawer />
      
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Furniture Collection</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {loading 
                  ? 'Syncing with product inventory...' 
                  : `Showing ${filteredProducts.length} of ${dbProducts.length} items`}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 h-10 rounded-xl border-slate-200 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 h-10 rounded-xl border-slate-200 bg-white shadow-sm relative">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {isFiltered && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <SheetHeader className="text-left">
                      <SheetTitle className="text-xl font-bold italic tracking-tight">Refine Collection</SheetTitle>
                    </SheetHeader>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive h-8 px-2">
                      <RotateCcw className="mr-2 h-3 w-3" /> Reset
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                    {/* Categories UI Block */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => {
                          const isActive = selectedCategories.includes(category.id.toLowerCase());
                          return (
                            <button
                              key={category.id}
                              onClick={() => {
                                const catId = category.id.toLowerCase()
                                if (isActive) {
                                  setSelectedCategories(selectedCategories.filter(id => id !== catId))
                                } else {
                                  setSelectedCategories([...selectedCategories, catId])
                                }
                              }}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200",
                                isActive 
                                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[0.98]" 
                                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                              <span className="font-medium">{category.name}</span>
                              <div className={cn(
                                "h-2 w-2 rounded-full transition-colors",
                                isActive ? "bg-white" : "bg-slate-200"
                              )} />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Quantity Available Slider Block */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Stock Availability</h3>
                        <Badge variant="secondary" className="font-mono text-primary bg-primary/5 border-primary/10">
                          {qtyRange[0]} — {qtyRange[1]} units
                        </Badge>
                      </div>
                      
                      <div className="px-2">
                        <Slider 
                          defaultValue={[0, 500]} 
                          max={500} 
                          step={10} 
                          value={qtyRange}
                          onValueChange={setQtyRange}
                          className="py-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t mt-auto">
                    <Button 
                      className="w-full h-12 rounded-2xl text-md font-bold shadow-lg shadow-primary/25" 
                      onClick={() => setIsFilterSheetOpen(false)}
                    >
                      Show Products
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] h-10 rounded-xl border-slate-200 bg-white shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="alpha-asc">Name: A to Z</SelectItem>
                  <SelectItem value="alpha-desc">Name: Z to A</SelectItem>
                  <SelectItem value="qty-high">Stock: High to Low</SelectItem>
                  <SelectItem value="qty-low">Stock: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-destructive/10 text-destructive text-sm text-center border border-destructive/20">
              {error} — Verify your Render instance is active and CORS constraints are open.
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="h-80 bg-slate-200/60 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const cardProps = adaptProductForCard(product);
                return (
                  <ProductCard key={cardProps.id} product={cardProps as any} />
                );
              })}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50">
              <div className="rounded-full bg-white p-8 mb-6 shadow-xl border border-slate-100">
                <Search className="h-12 w-12 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">No products found</h2>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Try adjusting your filters or stock values.</p>
              <Button variant="default" onClick={clearFilters} className="mt-8 rounded-xl px-10 h-11">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <ChatbotWidget />
      <Footer />
    </div>
  )
}

function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  )
}