'use client'

import Link from 'next/link'
import { Product } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const { addItem, setIsOpen } = useCart()

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
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link href={`/products/${product.id}`}>
      <article 
        className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={product.images[isHovered && product.images[1] ? 1 : 0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-foreground text-background">New</Badge>
            )}
            {product.isBestseller && (
              <Badge variant="secondary">Bestseller</Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-accent text-accent-foreground">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* AR Badge */}
          {product.arEnabled && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full">
                <Sparkles className="h-3 w-3 text-accent" />
                AR
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className={cn(
            "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-accent text-accent")} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Colors */}
          {variant === 'default' && (
            <div className="flex items-center gap-1 mb-2">
              {product.colors.slice(0, 4).map((color, index) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColorIndex(index)
                  }}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all",
                    selectedColorIndex === index 
                      ? "border-foreground scale-110" 
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Name & Category */}
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground capitalize mb-2">
            {product.category.replace('-', ' ')}
          </p>

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
