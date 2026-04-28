'use client'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import Link from 'next/link'
import { useState, useEffect } from 'react' // Added useEffect
import { Menu, Search, ShoppingBag, User, X, ChevronDown, Moon, Sun } from 'lucide-react' // Added Moon/Sun icons
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes' // Added useTheme

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, setIsOpen } = useCart()
  const { totalWishlistItems } = useWishlist()
  // Theme logic
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch (ensures icons only show after client-side load)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        

        {/* Main header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/products" className="text-lg font-medium hover:text-accent transition-colors">
                  All Products
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <hr className="my-4" />
                <Link href="/ar-experience" className="text-lg font-medium text-accent hover:text-accent/80 transition-colors">
                  AR Experience
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              AR<span className="text-accent">Smart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors py-6">
                Shop
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 w-[600px] bg-card rounded-lg shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6">
                <div className="grid grid-cols-3 gap-6">
                  {categories.map(category => (
                    <Link 
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="group/item"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.productCount} products</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">
              All Products
            </Link>
            <Link href="/ar-experience" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
              AR Experience
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
             
              <form onSubmit={handleSearch} className="relative ml-4">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    
    <Input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9 w-[180px] focus:w-[220px] transition-all duration-200 "
    />
  </form>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Dark Mode Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {mounted && (theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Account */}
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

{/* NEW: Wishlist Button */}
  <Link href="/wishlist">
    <Button variant="ghost" size="icon" className="relative">
      <Heart className="h-5 w-5" />
      {totalWishlistItems > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
          {totalWishlistItems}
        </span>
      )}
      <span className="sr-only">Wishlist</span>
    </Button>
  </Link>


            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            
          </div>
        </div>
      </div>
    </header>
  )
}