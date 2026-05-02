'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Smartphone, RotateCcw, Maximize2, CheckCircle2, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Point Your Camera',
    description: 'Simply aim your device at any flat surface in your room'
  },
  {
    icon: Maximize2,
    title: 'Place & Resize',
    description: 'Position furniture exactly where you want it, scale to fit'
  },
  {
    icon: RotateCcw,
    title: 'Rotate & Explore',
    description: 'View from every angle, change colors and materials'
  },
  {
    icon: CheckCircle2,
    title: 'Shop with Confidence',
    description: 'Know exactly how it looks before you buy'
  }
]

export function ARFeatureSection() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-accent text-sm font-semibold tracking-wider uppercase mb-4">
              Augmented Reality
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Try before you buy with immersive AR
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              No more guessing if that sofa will fit or if that lamp matches your decor. 
              Our AR technology lets you see furniture in your actual space, at actual size, 
              before making a decision.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/ar-experience">
                  Launch AR Experience
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products?ar=true">
                  Browse AR Products
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img 
                src="/ar-phone.jpg"
                alt="AR furniture visualization"
                className="w-full h-full object-cover"
              />
              
              {/* Floating UI Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* AR Overlay Effect */}
              <div className="absolute top-8 left-8 right-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-700">AR Active</span>
                  </div>
                  <p className="text-xs text-gray-600">Viewing: Nordica Sofa</p>
                </div>
              </div>

              {/* Product Info Card */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Nordica 3-Seater</h4>
                    <span className="text-accent font-bold">$1,299</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {['#9CA3AF', '#1E3A5F', '#2D5A27'].map(color => (
                        <span 
                          key={color}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Fits your space perfectly</span>
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-accent" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-accent" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent" />
            </div>

            {/* Background Decoration */}
            <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-accent/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
