'use client'
import { useWishlist } from '@/lib/wishlist-context' 
import { useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { ProductCard } from '@/components/product-card'
import ARViewer from '@/components/ar-viewer'
import { getProductById, products } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  Shield, 
  Minus, 
  Plus, 
  Sparkles,
  Check,
  ZoomIn
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const product = getProductById(resolvedParams.id)
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAROpen, setIsAROpen] = useState(false)
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isFavorited = product ? isInWishlist(product.id) : false
  const [isZoomed, setIsZoomed] = useState(false)
  const { addItem, setIsOpen } = useCart()

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewsList, setReviewsList] = useState<any[]>([])
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  })

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.comment) {
      toast.error('Please fill all fields')
      return
    }

    const review = {
      ...newReview,
      id: Date.now()
    }

    setReviewsList([review, ...reviewsList])
    setIsReviewOpen(false)

    setNewReview({
      name: '',
      rating: 5,
      comment: ''
    })

    toast.success('Review added!')
  }

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem(product, product.colors[selectedColor].name, quantity)
    toast.success(`${product.name} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => setIsOpen(true)
      }
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-3">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span className="mx-2">/</span>
              <Link 
                href={`/products?category=${product.category}`} 
                className="hover:text-foreground transition-colors capitalize"
              >
                {product.category.replace('-', ' ')}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in",
                  isZoomed && "cursor-zoom-out"
                )}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img 
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300",
                    isZoomed && "scale-150"
                  )}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-foreground text-background">New</Badge>
                  )}
                  {product.isBestseller && (
                    <Badge variant="secondary">Bestseller</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-accent text-accent-foreground">
                      Sale -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* AR Badge */}
                {product.arEnabled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAROpen(true)
                    }}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-background transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">View in AR</span>
                  </button>
                )}

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full">
                  <ZoomIn className="h-5 w-5" />
                </div>

                {/* Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedImageIndex(prev => 
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedImageIndex(prev => 
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImageIndex === index 
                          ? "border-accent" 
                          : "border-transparent hover:border-muted-foreground"
                      )}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Header */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground capitalize mb-1">
                  {product.category.replace('-', ' ')}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  {product.inStock ? (
                    <span className="text-green-600 text-sm flex items-center gap-1">
                      <Check className="h-4 w-4" /> In Stock
                    </span>
                  ) : (
                    <span className="text-red-600 text-sm">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Colors */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">
                  Color: {product.colors[selectedColor].name}
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                        selectedColor === index 
                          ? "border-foreground scale-110" 
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === index && (
                        <Check className={cn(
                          "h-5 w-5",
                          color.hex === '#FFFFFF' || color.hex === '#F5F5F5' || color.hex === '#F5F5DC' || color.hex === '#E8E8E8'
                            ? "text-foreground" 
                            : "text-white"
                        )} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={cn("h-5 w-5", isFavorited && "fill-accent text-accent")} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* AR Button */}
              {product.arEnabled && (
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full mb-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsAROpen(true)}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  View in Your Space with AR
                </Button>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders over $99</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">10-year frame</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="dimensions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Dimensions
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
                >
                  Reviews ({product.reviews + reviewsList.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="py-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Materials</h3>
                    <ul className="space-y-2">
                      {product.materials.map(material => (
                        <li key={material} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="h-4 w-4 text-accent" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Features</h3>
                    <ul className="space-y-2">
                      {product.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="h-4 w-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dimensions" className="py-6">
                <div className="grid sm:grid-cols-3 gap-6 max-w-md">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Width</p>
                    <p className="text-2xl font-bold">{product.dimensions.width}</p>
                    <p className="text-sm text-muted-foreground">cm</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Height</p>
                    <p className="text-2xl font-bold">{product.dimensions.height}</p>
                    <p className="text-sm text-muted-foreground">cm</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Depth</p>
                    <p className="text-2xl font-bold">{product.dimensions.depth}</p>
                    <p className="text-sm text-muted-foreground">cm</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-6">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                  <div className="text-center md:text-left">
                    <p className="text-5xl font-bold">{product.rating}</p>
                    <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.round(product.rating) ? 'text-yellow-500' : 'text-muted'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.reviews + reviewsList.length} reviews</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsReviewOpen(true)}>
                      Write a Review
                    </Button>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const percentage = stars === 5 ? 75 : stars === 4 ? 18 : stars === 3 ? 5 : 2
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-12">{stars} stars</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {isReviewOpen && (
                  <div className="mb-12 p-6 border rounded-xl bg-secondary/30 space-y-4 max-w-2xl">
                    <h3 className="font-semibold text-lg">Write your review</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="text-2xl transition-transform hover:scale-110"
                            >
                              <span className={star <= newReview.rating ? "text-yellow-500" : "text-muted-foreground/30"}>
                                ★
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      />
                      <textarea
                        placeholder="Share your thoughts about the product..."
                        rows={4}
                        className="w-full bg-background border border-input p-2.5 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-none"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      />
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleSubmitReview}>Submit Review</Button>
                        <Button variant="ghost" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {reviewsList.map((r) => (
                    <div key={r.id} className="border-b border-border pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold block">{r.name}</span>
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < r.rating ? "text-yellow-500 text-sm" : "text-muted text-sm"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Just now</span>
                      </div>
                      <p className="text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-bold mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ChatbotWidget />
      
      {/* AR Viewer Modal */}
      {isAROpen && (
        <ARViewer product={product} onClose={() => setIsAROpen(false)} />
      )}
    </div>
  )
}