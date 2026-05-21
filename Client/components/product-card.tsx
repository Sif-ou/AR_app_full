'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/lib/wishlist-context'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: any 
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  // Accessing variants list from your Java Product entity
  const variants = product.variants || []
  const selectedVariant = variants[selectedColorIndex] || {}
  const liked = isInWishlist(product.id)

  // Calculation: Using product.price as base and applying variant.percentage
  const basePrice = product.price || 0
  const percentage = selectedVariant.percentage || 0
  const finalPrice = basePrice * (1 + (percentage / 100))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, selectedVariant.name)
    toast.success(`${product.name} added to cart`)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please log in')
      router.push('/account')
      return
    }
    toggleWishlist(product.id)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <article className="group relative bg-card rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          {/* Mapping to Media entity: static_image */}
          <img
            src={selectedVariant.medias?.[0]?.static_image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* AR Indicator - Checks Media entity: model_3d */}
          {selectedVariant.medias?.[0]?.model_3d && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg border border-border/50 text-[10px] font-bold">
                <Sparkles className="h-3 w-3 text-accent" /> AR
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <Button size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" /> Add
            </Button>
            <Button size="sm" variant="secondary" onClick={handleFavorite}>
              <Heart className={cn('h-4 w-4', liked && 'fill-accent text-accent')} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {variant === 'default' && (
            <div className="flex items-center gap-1.5 mb-3">
              {variants.map((v: any, index: number) => (
                <button
                  key={v.id}
                  onClick={(e) => { e.preventDefault(); setSelectedColorIndex(index); }}
                  className={cn('w-5 h-5 rounded-full border-2 transition-all', selectedColorIndex === index && 'ring-2 scale-110')}
                  style={{ backgroundColor: v.color?.hexCode || '#ccc' }}
                />
              ))}
            </div>
          )}

          <p className="text-xs uppercase text-muted-foreground">{product.category}</p>
          <h3 className="font-semibold text-base">{product.name}</h3>
          <div className="mt-3 font-bold text-lg">
            {formatPrice(finalPrice)}
          </div>
        </div>
      </article>
    </Link>
  )
}