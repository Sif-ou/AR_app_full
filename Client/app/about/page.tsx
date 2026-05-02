'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Leaf, Truck, Shield, Heart } from 'lucide-react'

const values = [
  {
    icon: Leaf,
    title: 'Sustainable Design',
    description: 'We prioritize eco-friendly materials and sustainable manufacturing processes to minimize our environmental impact.'
  },
  {
    icon: Truck,
    title: 'Direct to You',
    description: 'By cutting out middlemen, we deliver premium furniture at fair prices directly to your doorstep.'
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Every piece undergoes rigorous quality testing. We stand behind our products with comprehensive warranties.'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'From AR previews to white-glove delivery, we are dedicated to making your experience exceptional.'
  }
]

const team = [
  { name: 'Sarah ', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Ahmed', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Djamila', role: 'CTO', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { name: 'Youcef', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' }
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Reimagining how you furnish your home
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We believe everyone deserves beautiful, quality furniture. Our mission is to make 
                shopping for your home as inspiring and seamless as the spaces we help you create.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
                  Our Story
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Born from a simple frustration
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    In 2019, our founders faced the same challenge millions encounter: buying furniture 
                    online without knowing how it would look or fit in their space. After countless 
                    returns and disappointments, they decided there had to be a better way.
                  </p>
                  <p>
                    That frustration sparked ARFURN. We combined cutting-edge augmented reality 
                    technology with thoughtfully designed, sustainably made furniture to create a 
                    shopping experience that finally makes sense.
                  </p>
                  <p>
                    Today, we serve over 50,000 happy customers who have used our AR technology 
                    to visualize more than 500 products in their actual spaces before buying.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src="/hero-living-room.jpg"
                    alt="Beautiful living room with ARFURN furniture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-6 max-w-[200px]">
                  <p className="text-3xl font-bold text-accent">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy customers worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
                Our Values
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                What drives us forward
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-card rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
                Our Team
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Meet the people behind ARFURN
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 w-32 h-32 mx-auto">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your space?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
              Explore our collection and use AR to see how our furniture looks in your home.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
