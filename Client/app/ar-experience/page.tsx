'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { ChatbotWidget } from '@/components/chatbot-widget'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Smartphone, 
  RotateCcw, 
  Maximize2, 
  Camera,
  CheckCircle2,
  ArrowRight,
  Play
} from 'lucide-react'

const steps = [
  {
    icon: Smartphone,
    title: 'Point Your Camera',
    description: 'Open any AR-enabled product and tap "View in AR". Point your phone at a flat surface like a floor or table.'
  },
  {
    icon: Maximize2,
    title: 'Place & Position',
    description: 'Tap to place the furniture in your space. Drag to move it around until you find the perfect spot.'
  },
  {
    icon: RotateCcw,
    title: 'Rotate & Resize',
    description: 'Use intuitive controls to rotate the furniture and adjust its size to see exactly how it fits.'
  },
  {
    icon: Camera,
    title: 'Capture & Share',
    description: 'Take photos of your AR design to share with friends and family or save for later.'
  }
]

const benefits = [
  'See true-to-scale furniture in your actual space',
  'Test different colors and styles instantly',
  'Reduce returns with confident purchases',
  'Share AR photos with friends and family',
  'Works on most modern smartphones',
  'No app download required - works in browser'
]

export default function ARExperiencePage() {
  const arProducts = products.filter(p => p.arEnabled).slice(0, 8)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-secondary" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Augmented Reality Shopping
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                See furniture in your space before you buy
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Our AR technology lets you visualize furniture in your actual room, at actual size. 
                No more guessing if it will fit or match your decor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/products?ar=true">
                    Browse AR Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                 size="lg" 
                 variant="outline"
                 onClick={() => setIsVideoPlaying(true)}
                >
                <Play className="mr-2 h-5 w-5" />
                     Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
{/* 🎥 Video Modal */}
{isVideoPlaying && (
  <div 
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setIsVideoPlaying(false)}
  >
    <div 
      className="relative bg-background p-4 rounded-xl max-w-3xl w-full"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Close Button */}
      <button 
        onClick={() => setIsVideoPlaying(false)}
        className="absolute top-2 right-2 text-white text-lg"
      >
        ✕
      </button>

      {/* YouTube Video */}
      <div className="aspect-video w-full">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/IHbF3nDfBjA?autoplay=1"
          title="Demo Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

    </div>
  </div>
)}
        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AR experience is designed to be intuitive and seamless. Get started in seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                  )}
                  <div className="bg-card rounded-xl p-6 relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                      <step.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Shop with complete confidence
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Our AR technology eliminates the guesswork from furniture shopping. 
                  See exactly how pieces will look and fit in your space before making a purchase.
                </p>
                <ul className="space-y-4">
                  {benefits.map(benefit => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img 
                    src="/ar-phone.jpg"
                    alt="AR visualization of furniture"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* AR UI Overlay */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-foreground">AR Active</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Nordica Sofa</p>
                      <p className="text-sm text-muted-foreground">Fits perfectly in this space</p>
                    </div>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compatible Devices */}
        <section id="compatible-devices" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Compatible Devices
              </h2>
              <p className="text-muted-foreground mb-8">
                Our WebAR technology works on most modern devices without any app download.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div className="bg-card rounded-xl p-6">
                  <h3 className="font-semibold mb-3">iOS Devices</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>iPhone 6S and newer</li>
                    <li>iPad (5th generation) and newer</li>
                    <li>iPad Pro (all models)</li>
                    <li>Safari browser required</li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl p-6">
                  <h3 className="font-semibold mb-3">Android Devices</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>ARCore compatible devices</li>
                    <li>Most devices from 2018 onwards</li>
                    <li>Chrome browser recommended</li>
                    <li>Samsung, Google Pixel, OnePlus, etc.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AR Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                  Try These in AR
                </h2>
                <p className="text-muted-foreground">
                  Popular products with AR visualization
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?ar=true">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {arProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {[
                  {
                    q: 'Do I need to download an app?',
                    a: 'No! Our AR experience works directly in your web browser using WebAR technology. Just tap "View in AR" on any compatible product.'
                  },
                  {
                    q: 'How accurate is the AR sizing?',
                    a: 'Our AR uses real-world measurements, so what you see is true-to-scale. The furniture in AR will match the actual product dimensions within 2-3% accuracy.'
                  },
                  {
                    q: 'Can I see different colors in AR?',
                    a: 'Yes! You can switch between available colors while in AR mode to see how different options look in your space.'
                  },
                  {
                    q: 'Why isn\'t AR working on my device?',
                    a: 'AR requires a compatible device with ARCore (Android) or ARKit (iOS) support. Make sure you\'re using a supported browser and have granted camera permissions.'
                  }
                ].map(faq => (
                  <div key={faq.q} className="bg-card rounded-xl p-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your space?
            </h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              Start exploring our AR-enabled furniture collection and visualize your perfect home today.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
              <Link href="/products?ar=true">
                <Sparkles className="mr-2 h-5 w-5" />
                Start AR Shopping
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
      <ChatbotWidget />
    </div>
  )
}
