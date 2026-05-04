'use client'

import Link from 'next/link'
import { categories } from '@/lib/data'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CategoriesSection() {
  return (
    <section className="py-12 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header - Improved for mobile spacing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Explore our curated collections designed to transform every room in your home.
            </p>
          </div>
          <Link 
            href="/products" 
            className="text-sm font-semibold flex items-center gap-2 group hover:text-accent transition-colors shrink-0"
          >
            View All Collections
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              href={`/products?category=${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl",
                // Mobile: All items take 1 row
                // Desktop: Index 0 takes 2 cols and 2 rows
                index === 0 ? "sm:col-span-2 sm:row-span-2" : "col-span-1"
              )}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Responsive Gradient - Darker on mobile for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:from-black/60 md:via-transparent" />
              </div>

              {/* Content Layer */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className={cn(
                    "font-serif font-bold text-white mb-1 md:mb-2 leading-tight",
                    index === 0 ? "text-2xl md:text-4xl" : "text-xl"
                  )}>
                    {category.name}
                  </h3>
                  
                  {/* Hide long descriptions on small mobile, show on tablet+ */}
                  <p className={cn(
                    "text-white/80 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block",
                    index === 0 ? "md:max-w-md" : "max-w-xs"
                  )}>
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-white/70 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {category.productCount} Products
                    </span>
                    <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:flex">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}