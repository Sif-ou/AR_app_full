import { useState, useMemo, useEffect, Suspense } from 'react'
import ARViewer from '@/components/ar-viewer'
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


  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <CartDrawer />
      
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Furniture Collection</h1>
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} items
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Category Filter */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Categories</h3>
                      <div className="grid gap-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={category.id} 
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, category.id])
                                } else {
                                  setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                                }
                              }}
                            />
                            <label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <span className="text-xs text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
                      </div>
                      <Slider 
                        defaultValue={[0, 5000]} 
                        max={5000} 
                        step={100} 
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>

                    <Button className="w-full" onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-slate-100 p-6 mb-4">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">
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