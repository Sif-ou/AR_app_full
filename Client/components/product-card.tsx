'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/lib/wishlist-context'
import { useRouter } from 'next/navigation'

export function ProductCard({ product, variant = 'default' }: { product: any, variant?: 'default' | 'compact' }) { 
  const [isHovered, setIsHovered] = useState(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const router = useRouter()
  const { addItem, setIsOpen } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  // Get the active variant based on user selection
  const activeVariant = product.variants?.[selectedVariantIndex] || {}
  const liked = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation()
    addItem(product, activeVariant.name)
    toast.success(`${product.name} added to cart`)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!localStorage.getItem('token')) {
      toast.error('Please log in')
      router.push('/account')
      return
    }
    toggleWishlist(product.id)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <article
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <img
            src={activeVariant.medias?.[0]?.static_image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* AR Support */}
          {activeVariant.medias?.[0]?.model_3d && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-background/80 backdrop-blur-md text-foreground">
                <Sparkles className="h-3 w-3 mr-1 text-accent" /> AR
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Variant Color Selectors */}
          <div className="flex items-center gap-2 mb-3">
            {product.variants?.map((v: any, index: number) => (
              <button
                key={v.id}
                onClick={(e) => { e.preventDefault(); setSelectedVariantIndex(index); }}
                className={cn('w-5 h-5 rounded-full border-2', selectedVariantIndex === index ? 'ring-2 ring-offset-1' : '')}
                style={{ backgroundColor: v.color?.hexCode || '#ccc' }}
              />
            ))}
          </div>

          <p className="text-[10px] font-bold uppercase text-muted-foreground">{product.category}</p>
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-lg">${activeVariant.percentage || 0}</span>
            <Button size="sm" onClick={handleAddToCart}><ShoppingBag className="h-4 w-4" /></Button>
          </div>
        </div>
      </article>
    </Link>
  )
}