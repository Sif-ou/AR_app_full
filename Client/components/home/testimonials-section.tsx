'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    content: "The AR feature completely changed how I shop for furniture. I was hesitant about buying a large sectional online, but seeing it in my actual living room gave me the confidence to make the purchase. It fits perfectly!",
    author: "sara",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5
  },
  {
    id: 2,
    content: "Absolutely incredible technology. I spent hours trying different furniture pieces in my bedroom using AR. The visualization is so realistic that what I ordered looked exactly as expected when it arrived.",
    author: "hamida capitain",
    role: "Ali",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5
  },
  {
    id: 3,
    content: "As someone who struggles with visualizing spaces, this app is a game-changer. The chatbot helped me choose the perfect color scheme, and the AR let me see it all come together. 10/10 experience!",
    author: "djamila",
    role: "First-time Buyer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5
  },
  {
    id: 4,
    content: "We furnished our entire new apartment using AR Smart Retail. The ability to try furniture before buying eliminated all the stress. Plus, the quality of everything we ordered exceeded expectations.",
    author: "aymen",
    role: "New Homeowners",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            What our customers say
          </h2>
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <Quote className="h-12 w-12 text-accent/30 absolute -top-2 -left-2" />

            {/* Content */}
            <div className="text-center px-8 md:px-16">
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-balance">
                {current.content}
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <img
                  src={current.image}
                  alt={current.author}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold">{current.author}</p>
                  <p className="text-sm text-background/70">{current.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mt-4">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="border-background/30 text-background hover:bg-background/10 hover:text-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                      ? 'w-8 bg-accent'
                      : 'bg-background/30 hover:bg-background/50'
                    }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="border-background/30 text-background hover:bg-background/10 hover:text-background"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
