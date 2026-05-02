'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { products, categories } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SlidersHorizontal, Search, X, Grid3X3, LayoutGrid, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'


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

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  useEffect(() => {
    const category = searchParams.get('category')
    if (category && categories.find(c => c.id === category)) {
      setSelectedCategories([category])
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        return matchesSearch && matchesCategory && matchesPrice
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'newest') return b.isNew ? 1 : -1
        return 0
      })
  }, [searchQuery, selectedCategories, priceRange, sortBy])

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 5000])
    setSearchQuery('')
  }

  const isFiltered = selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 5000

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
                Showing {filteredProducts.length} of {products.length} items
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
                  {/* --- PRO FILTER WINDOW START --- */}
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <SheetHeader className="text-left">
                      <SheetTitle className="text-xl font-bold italic tracking-tight">Refine Collection</SheetTitle>
                    </SheetHeader>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive h-8 px-2">
                      <RotateCcw className="mr-2 h-3 w-3" /> Reset
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                    {/* Category Section with Buttons */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => {
                          const isActive = selectedCategories.includes(category.id);
                          return (
                            <button
                              key={category.id}
                              onClick={() => {
                                if (isActive) {
                                  setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                                } else {
                                  setSelectedCategories([...selectedCategories, category.id])
                                }
                              }}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200",
                                isActive 
                                  ? "bg-primary text-red-500 border-primary shadow-md shadow-primary/20 scale-[0.98]" 
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

                    {/* Pro Price Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Price Range</h3>
                        <Badge variant="secondary" className="font-mono text-primary bg-primary/5 border-primary/10">
                          ${priceRange[0]} — ${priceRange[1]}
                        </Badge>
                      </div>
                      
                      <div className="px-2">
                        <Slider 
                          defaultValue={[0, 5000]} 
                          max={5000} 
                          step={100} 
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="py-4"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Minimum</p>
                          <p className="text-sm font-bold font-mono text-slate-700">${priceRange[0]}</p>
                        </div>
                        <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground/60">Maximum</p>
                          <p className="text-sm font-bold font-mono text-slate-700">${priceRange[1]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t mt-auto">
                    <Button 
                      className="w-full h-12 rounded-2xl text-md font-bold shadow-lg shadow-primary/25 transition-transform active:scale-95" 
                      onClick={() => setIsFilterSheetOpen(false)}
                    >
                      Show {filteredProducts.length} Products
                    </Button>
                  </div>
                  {/* --- PRO FILTER WINDOW END --- */}
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200 bg-white shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50">
              <div className="rounded-full bg-white p-8 mb-6 shadow-xl border border-slate-100">
                <Search className="h-12 w-12 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">No products found</h2>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Try adjusting your filters or price range to find what you're looking for.</p>
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

// Helper icons needed
function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  )
}