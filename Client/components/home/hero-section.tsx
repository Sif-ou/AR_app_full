'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { useState } from 'react'

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-living-room.jpg"
          alt="Modern living room with furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            New AR Experience Available
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance">
            See it in your space{' '}
            <span className="text-accent">before</span> you buy
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            Experience the future of furniture shopping. Use augmented reality to visualize 
            products in your home, try them virtually, and shop with complete confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base group"
              asChild
            >
              <Link href="/ar-experience">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Try AR Experience
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border/50">
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">AR Products</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating 3D Preview Card */}
      <div className="hidden lg:block absolute right-8 bottom-12 bg-card rounded-2xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-right-8 duration-700">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
          <img 
            src="/products/sofa-1.jpg"
            alt="Sofa in AR preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
              AR Ready
            </span>
          </div>
        </div>
        <h3 className="font-medium text-sm">Nordica 3-Seater Sofa</h3>
        <p className="text-muted-foreground text-sm">View in your room with AR</p>
      </div>
    </section>
  )
}
