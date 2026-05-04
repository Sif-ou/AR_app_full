'use client'

import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/data'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header - Improved for mobile center-alignment */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold tracking-widest uppercase text-[10px] md:text-xs">
              <Sparkles className="h-3 w-3" />
              Curated for you
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
              Featured Collection
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Discover our most loved pieces, handpicked for exceptional quality and design.
            </p>
          </div>
          
          <Button variant="ghost" className="hidden md:flex group hover:bg-transparent p-0 font-bold" asChild>
            <Link href="/products" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* 
            Responsive Layout Logic:
            - Mobile: Horizontal scroll (Snap Carousel)
            - Desktop: Standard Grid 
        */}
        <div className="relative group">
          <div className={cn(
            // Mobile: flex-nowrap + overflow-x-auto
            // Desktop: grid + md:overflow-visible
            "flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-8 md:pb-0",
            "overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          )}>
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Subtle Mobile Scroll Indicator */}
          <div className="flex md:hidden justify-center gap-1 mt-2">
            {products.slice(0, 4).map((_, i) => (
              <div key={i} className={cn("h-1 rounded-full bg-accent/20", i === 0 ? "w-4 bg-accent" : "w-1")} />
            ))}
          </div>
        </div>

        {/* Mobile-only CTA (Visible only when grid stacks) */}
        <div className="mt-10 md:hidden">
          <Button className="w-full h-12 rounded-xl font-bold" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}