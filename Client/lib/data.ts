export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  images: string[]
  colors: { name: string; hex: string }[]
  dimensions: { width: number; height: number; depth: number }
  materials: string[]
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
  arEnabled: boolean
  features: string[]
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export const categories: Category[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Comfortable sofas, coffee tables, and entertainment units',
    image: '/categories/living-room.jpg',
    productCount: 156
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Beds, wardrobes, and nightstands for restful sleep',
    image: '/categories/bedroom.jpg',
    productCount: 98
  },
  {
    id: 'dining',
    name: 'Dining',
    description: 'Dining tables, chairs, and storage solutions',
    image: '/categories/dining.jpg',
    productCount: 73
  },
  {
    id: 'office',
    name: 'Home Office',
    description: 'Desks, office chairs, and organization',
    image: '/categories/office.jpg',
    productCount: 64
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Patio furniture and outdoor accessories',
    image: '/categories/outdoor.jpg',
    productCount: 45
  },
  {
    id: 'lighting',
    name: 'Lighting',
    description: 'Lamps, pendants, and ambient lighting',
    image: '/categories/lighting.jpg',
    productCount: 89
  }
]

export const products: Product[] = [
  {
    id: 'nordica-sofa',
    name: 'Nordica 3-Seater Sofa',
    description: 'A timeless Scandinavian sofa with clean lines and exceptional comfort. The solid oak frame and premium fabric upholstery make this piece a lasting addition to any living space.',
    price: 1299,
    originalPrice: 1599,
    category: 'living-room',
    subcategory: 'sofas',
    images: [
      '/products/sofa-1.jpg'
    ],
    colors: [
      { name: 'Light Grey', hex: '#9CA3AF' },
      { name: 'Navy Blue', hex: '#1E3A5F' },
      { name: 'Forest Green', hex: '#2D5A27' },
      { name: 'Cream', hex: '#F5F5DC' }
    ],
    dimensions: { width: 220, height: 85, depth: 95 },
    materials: ['Oak wood frame', 'High-density foam', 'Linen blend fabric'],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    isBestseller: true,
    arEnabled: true,
    features: ['Removable cushion covers', '10-year frame warranty', 'Easy assembly', 'Pet-friendly fabric']
  },
  {
    id: 'aurora-armchair',
    name: 'Aurora Lounge Chair',
    description: 'An elegant lounge chair inspired by mid-century modern design. Perfect for reading corners or as a statement piece in your living room.',
    price: 649,
    category: 'living-room',
    subcategory: 'chairs',
    images: [
      '/products/chair-1.jpg'
    ],
    colors: [
      { name: 'Mustard Yellow', hex: '#D4A017' },
      { name: 'Terracotta', hex: '#C4633A' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    dimensions: { width: 75, height: 95, depth: 80 },
    materials: ['Walnut wood legs', 'Velvet upholstery', 'Foam padding'],
    rating: 4.9,
    reviews: 156,
    inStock: true,
    isNew: true,
    arEnabled: true,
    features: ['Ergonomic design', 'Handcrafted details', 'Swivel base option']
  },
  {
    id: 'minimalist-coffee-table',
    name: 'Oslo Coffee Table',
    description: 'A sleek minimalist coffee table with a beautiful marble top and slender brass legs. The perfect centerpiece for modern living rooms.',
    price: 449,
    category: 'living-room',
    subcategory: 'tables',
    images: [
      '/products/coffee-table-1.jpg'
    ],
    colors: [
      { name: 'White Marble', hex: '#F5F5F5' },
      { name: 'Black Marble', hex: '#2D2D2D' },
      { name: 'Green Marble', hex: '#4A5D4A' }
    ],
    dimensions: { width: 120, height: 45, depth: 60 },
    materials: ['Natural marble top', 'Brass-plated steel legs'],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    arEnabled: true,
    features: ['Genuine marble', 'Anti-scratch pads', 'Easy to clean']
  },
  {
    id: 'haven-bed-frame',
    name: 'Haven Platform Bed',
    description: 'A luxurious upholstered platform bed with a tall, tufted headboard. Create a serene bedroom sanctuary with this elegant centerpiece.',
    price: 1199,
    originalPrice: 1499,
    category: 'bedroom',
    subcategory: 'beds',
    images: [
      '/products/bed-1.jpg'
    ],
    colors: [
      { name: 'Stone Grey', hex: '#8B8B8B' },
      { name: 'Blush Pink', hex: '#E8B4B8' },
      { name: 'Navy', hex: '#1E3A5F' }
    ],
    dimensions: { width: 180, height: 130, depth: 220 },
    materials: ['Solid pine frame', 'Velvet upholstery', 'Metal support slats'],
    rating: 4.8,
    reviews: 312,
    inStock: true,
    isBestseller: true,
    arEnabled: true,
    features: ['No box spring needed', 'Under-bed storage space', 'Easy assembly', 'Noise-free design']
  },
  {
    id: 'serene-nightstand',
    name: 'Serene Nightstand',
    description: 'A beautifully crafted nightstand with soft-close drawers and a warm wood finish. The perfect bedside companion.',
    price: 249,
    category: 'bedroom',
    subcategory: 'storage',
    images: [
      '/products/nightstand-1.jpg'
    ],
    colors: [
      { name: 'Natural Oak', hex: '#D4A574' },
      { name: 'Walnut', hex: '#5D4037' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    dimensions: { width: 50, height: 55, depth: 40 },
    materials: ['Solid oak wood', 'Brass handles', 'Soft-close mechanism'],
    rating: 4.6,
    reviews: 78,
    inStock: true,
    arEnabled: true,
    features: ['Two spacious drawers', 'Cable management hole', 'Anti-tip hardware']
  },
  {
    id: 'harvest-dining-table',
    name: 'Harvest Dining Table',
    description: 'A stunning solid wood dining table that brings warmth and character to your dining space. Seats 6-8 people comfortably.',
    price: 1599,
    category: 'dining',
    subcategory: 'tables',
    images: [
      '/products/table-1.jpg'
    ],
    colors: [
      { name: 'Natural', hex: '#C4A77D' },
      { name: 'Dark Stain', hex: '#3E2723' }
    ],
    dimensions: { width: 200, height: 76, depth: 100 },
    materials: ['Solid acacia wood', 'Metal cross-base'],
    rating: 4.9,
    reviews: 167,
    inStock: true,
    isNew: true,
    arEnabled: true,
    features: ['Seats 6-8', 'Live edge detail', 'Protective lacquer finish']
  },
  {
    id: 'modern-dining-chair',
    name: 'Lena Dining Chair',
    description: 'An elegant dining chair with a curved backrest and comfortable upholstered seat. Set of 2.',
    price: 349,
    category: 'dining',
    subcategory: 'chairs',
    images: [
      '/products/dining-chair-1.jpg'
    ],
    colors: [
      { name: 'Cream', hex: '#F5F5DC' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Camel', hex: '#C19A6B' }
    ],
    dimensions: { width: 52, height: 82, depth: 56 },
    materials: ['Beech wood frame', 'Boucle fabric', 'High-resilience foam'],
    rating: 4.7,
    reviews: 203,
    inStock: true,
    arEnabled: true,
    features: ['Set of 2', 'Stackable', 'Stain-resistant fabric']
  },
  {
    id: 'executive-desk',
    name: 'Executive Standing Desk',
    description: 'A premium height-adjustable desk with built-in cable management and a spacious work surface. Perfect for the modern home office.',
    price: 899,
    originalPrice: 1099,
    category: 'office',
    subcategory: 'desks',
    images: [
      '/products/desk-1.jpg'
    ],
    colors: [
      { name: 'Walnut', hex: '#5D4037' },
      { name: 'White Oak', hex: '#E8DCC4' }
    ],
    dimensions: { width: 160, height: 75, depth: 80 },
    materials: ['Solid wood top', 'Steel frame', 'Electric motor'],
    rating: 4.8,
    reviews: 445,
    inStock: true,
    isBestseller: true,
    arEnabled: true,
    features: ['Electric height adjustment', 'Memory presets', 'Anti-collision system', 'Built-in USB ports']
  },
  {
    id: 'ergonomic-chair',
    name: 'ErgoMax Office Chair',
    description: 'An award-winning ergonomic office chair designed for all-day comfort. Features adjustable lumbar support and breathable mesh back.',
    price: 749,
    category: 'office',
    subcategory: 'chairs',
    images: [
      '/products/office-chair-1.jpg'
    ],
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Grey', hex: '#6B7280' }
    ],
    dimensions: { width: 68, height: 120, depth: 68 },
    materials: ['Aluminum base', 'Mesh fabric', 'Memory foam seat'],
    rating: 4.9,
    reviews: 567,
    inStock: true,
    arEnabled: true,
    features: ['12-year warranty', 'Adjustable armrests', 'Tilt lock mechanism', 'Lumbar support']
  },
  {
    id: 'pendant-light',
    name: 'Celestial Pendant Light',
    description: 'A stunning handblown glass pendant light that creates a warm, ambient glow. Perfect above dining tables or in entryways.',
    price: 329,
    category: 'lighting',
    subcategory: 'pendants',
    images: [
      '/products/pendant-1.jpg'
    ],
    colors: [
      { name: 'Amber', hex: '#FFBF00' },
      { name: 'Smoke', hex: '#708090' },
      { name: 'Clear', hex: '#E8E8E8' }
    ],
    dimensions: { width: 35, height: 40, depth: 35 },
    materials: ['Hand-blown glass', 'Brass hardware'],
    rating: 4.6,
    reviews: 123,
    inStock: true,
    isNew: true,
    arEnabled: true,
    features: ['Dimmable', 'E27 bulb compatible', '150cm adjustable cord']
  },
  {
    id: 'floor-lamp',
    name: 'Arc Floor Lamp',
    description: 'A sculptural arc floor lamp with a marble base and adjustable arm. Creates a dramatic focal point in any room.',
    price: 449,
    category: 'lighting',
    subcategory: 'floor-lamps',
    images: [
      '/products/lamp-1.jpg'
    ],
    colors: [
      { name: 'Brushed Brass', hex: '#D4AF37' },
      { name: 'Matte Black', hex: '#1C1C1C' }
    ],
    dimensions: { width: 100, height: 200, depth: 40 },
    materials: ['Marble base', 'Steel arm', 'Linen shade'],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    arEnabled: true,
    features: ['Foot switch', 'Adjustable arm', 'Weighted base for stability']
  },
  {
    id: 'outdoor-lounge-set',
    name: 'Riviera Outdoor Lounge Set',
    description: 'A complete outdoor lounge set featuring a sofa, two armchairs, and a coffee table. Weather-resistant materials for year-round use.',
    price: 2499,
    originalPrice: 2999,
    category: 'outdoor',
    subcategory: 'lounge',
    images: [
      '/products/outdoor-set-1.jpg'
    ],
    colors: [
      { name: 'Natural Teak', hex: '#CD853F' },
      { name: 'Graphite', hex: '#383838' }
    ],
    dimensions: { width: 250, height: 75, depth: 200 },
    materials: ['Teak wood frame', 'Sunbrella fabric cushions', 'Aluminum accents'],
    rating: 4.8,
    reviews: 76,
    inStock: true,
    arEnabled: true,
    features: ['UV resistant', 'Water-resistant cushions', 'Quick-dry foam', '5-year warranty']
  },
  {
    id: 'modern-bookshelf',
    name: 'Nordic Bookshelf',
    description: 'A minimalist wooden bookshelf with 5 spacious shelves. Perfect for displaying books, plants, and decorative items.',
    price: 399,
    category: 'living-room',
    subcategory: 'storage',
    images: [
      '/products/bookshelf-1.jpg'
    ],
    colors: [
      { name: 'Light Oak', hex: '#D4A574' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Walnut', hex: '#5D4037' }
    ],
    dimensions: { width: 80, height: 180, depth: 35 },
    materials: ['Solid oak wood', 'Metal brackets'],
    rating: 4.7,
    reviews: 145,
    inStock: true,
    arEnabled: true,
    features: ['5 adjustable shelves', 'Wall-mount hardware included', 'Anti-tip straps']
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isBestseller || p.isNew).slice(0, 8)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  )
}
