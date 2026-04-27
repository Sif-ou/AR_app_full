import Link from 'next/link'
import { categories } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export function CategoriesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed to transform every room in your home
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              href={`/products?category=${category.id}`}
              className={`group relative overflow-hidden rounded-xl ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`aspect-square ${index === 0 ? 'md:aspect-[2/1.2]' : ''}`}>
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className={`font-serif font-bold text-white mb-1 ${
                  index === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
                }`}>
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm hidden md:block mb-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>{category.productCount} products</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
