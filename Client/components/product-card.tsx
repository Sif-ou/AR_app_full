'use client'

import Link from 'next/link'
import { Product } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/lib/wishlist-context'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)

  const { addItem, setIsOpen } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const liked = isInWishlist(product.id)

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

    addItem(product, product.colors[selectedColorIndex].name)

    toast.success(`${product.name} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => setIsOpen(true)
      }
    })
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wasLiked = liked
    toggleWishlist(product.id)
    toast.success(wasLiked ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link href={`/products/${product.id}`}>
      <article
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-xl active:scale-[0.98] lg:active:scale-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <img
            src={product.images[isHovered && product.images[1] ? 1 : 0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.isNew && (
              <Badge className="bg-foreground text-background border-none shadow-sm text-[10px] md:text-xs">New</Badge>
            )}
            {product.isBestseller && (
              <Badge variant="secondary" className="shadow-sm text-[10px] md:text-xs">Bestseller</Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-accent text-accent-foreground border-none shadow-sm text-[10px] md:text-xs">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* AR Support Indicator */}
          {product.arEnabled && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3">
              <span className="inline-flex items-center gap-1 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                <Sparkles className="h-3 w-3 text-accent" />
                AR
              </span>
            </div>
          )}

          {/* Quick Action Overlay - Hidden on touch devices, shown on hover for desktop */}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent transition-all duration-300 hidden lg:flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            )}
          >
            <Button
              size="sm"
              className="flex-1 shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="px-3 shadow-lg"
              onClick={handleFavorite}
            >
              <Heart className={cn('h-4 w-4 transition-colors', liked && 'fill-accent text-accent')} />
            </Button>
          </div>
          
          {/* Mobile-only Quick Like Button */}
          <button 
            onClick={handleFavorite}
            className="lg:hidden absolute bottom-2 right-2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-sm active:scale-90 transition-transform"
          >
             <Heart className={cn('h-4 w-4', liked && 'fill-accent text-accent')} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3 md:p-5">
          {/* Color Selectors */}
          {variant === 'default' && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.slice(0, 4).map((color, index) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColorIndex(index)
                  }}
                  className={cn(
                    'w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-all ring-offset-background',
                    selectedColorIndex === index
                      ? 'border-foreground ring-2 ring-foreground/20 scale-110'
                      : 'border-transparent hover:scale-110'
                  )}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.name}`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              {product.category.replace('-', ' ')}
            </p>
            <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-bold text-base md:text-lg text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-[11px] md:text-xs font-bold bg-muted/30 px-2 py-1 rounded-md">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}