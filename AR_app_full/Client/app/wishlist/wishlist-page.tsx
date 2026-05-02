'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useWishlist } from '@/lib/wishlist-context'
import { products } from '@/lib/data' // This imports your array from data.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function WishlistPage() {
  const { wishlist } = useWishlist()
  
  // This filters your data.tsx products based on IDs stored in context
  const wishlistProducts = products.filter(product => 
    wishlist.includes(product.id)
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistProducts.length} items</p>
        </div>
        
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save your favorite furniture to see them here!</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}