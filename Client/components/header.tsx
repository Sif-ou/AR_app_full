'use client'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, Search, ShoppingBag, User, X, ChevronDown, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, setIsOpen } = useCart()
  const { totalWishlistItems } = useWishlist()
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

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
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 transition-colors">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="left" 
              className="w-[85%] max-w-[320px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-r border-border/50"
            >
              {/* 1. Sidebar Top Header - Clean Brand Only */}
              <div className="flex items-center p-6 pb-4 border-b border-border/40">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                    AR<span className="text-accent italic">Smart</span>
                  </span>
                </Link>
              </div>

              {/* 2. Scrollable Navigation Area */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 mb-4 px-2">
                    Collections
                  </p>
                  <nav className="space-y-1">
                    <Link 
                      href="/products" 
                      className="group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 hover:bg-accent/10"
                    >
                      <span className="text-base font-medium">All Products</span>
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    
                    {categories.map((category) => (
                      <Link 
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 hover:bg-accent/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                             <img src={category.image} alt="" className="w-full h-full object-cover opacity-90" />
                          </div>
                          <span className="text-base font-medium">{category.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>

              {/* 3. Bottom Footer Section - NEW IMPROVED TOGGLE LOCATION */}
              <div className="p-4 bg-muted/20 border-t border-border/40 space-y-3">
                
                {/* Theme Toggle Button - Integrated Look */}
                <Button
                  variant="outline"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full h-12 justify-between px-4 rounded-2xl bg-background border border-border/50 shadow-sm transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    {mounted && (theme === 'dark' ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-foreground" />
                    ))}
                    <span className="text-sm font-medium">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </div>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors duration-300",
                    theme === 'dark' ? "bg-accent" : "bg-muted"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      theme === 'dark' ? "left-4.5" : "left-0.5"
                    )} />
                  </div>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/account" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-accent/50 transition-all active:scale-[0.98]">
                    <User className="h-5 w-5 mb-1 text-foreground" />
                    <span className="text-xs font-bold text-foreground">Account</span>
                  </Link>
                  <Link href="/wishlist" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:border-accent/50 transition-all active:scale-[0.98]">
                    <Heart className="h-5 w-5 mb-1 text-foreground" />
                    <span className="text-xs font-bold text-foreground">Saved</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              AR<span className="text-accent">Smart</span>
            </span>
          </Link>

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

          {/* Desktop Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:inline-flex"
            >
              {mounted && (theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />)}
            </Button>

            <Link href="/account" className="hidden md:inline-block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/wishlist" className="hidden md:inline-block">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </Button>
            </Link>

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
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}