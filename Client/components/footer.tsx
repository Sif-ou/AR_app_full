import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    // Changed bg-foreground to bg-muted/50 to be theme-aware
    <footer className="bg-muted/50 border-t border-border">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-3 text-foreground">Stay in the loop</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive offers, design inspiration, and AR updates.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                // Updated classes to use theme-aware variables
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products?category=living-room" className="hover:text-accent transition-colors">Living Room</Link></li>
              <li><Link href="/products?category=bedroom" className="hover:text-accent transition-colors">Bedroom</Link></li>
              <li><Link href="/products?category=dining" className="hover:text-accent transition-colors">Dining</Link></li>
              <li><Link href="/products?category=office" className="hover:text-accent transition-colors">Home Office</Link></li>
              <li><Link href="/products?category=outdoor" className="hover:text-accent transition-colors">Outdoor</Link></li>
              <li><Link href="/products?category=lighting" className="hover:text-accent transition-colors">Lighting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">AR Experience</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/ar-experience" className="hover:text-accent transition-colors">Try AR</Link></li>
              <li><Link href="/ar-experience#how-it-works" className="hover:text-accent transition-colors">How It Works</Link></li>
              <li><Link href="/ar-experience#compatible-devices" className="hover:text-accent transition-colors">Compatible Devices</Link></li>
              <li><Link href="/ar-experience#faq" className="hover:text-accent transition-colors">AR FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Customer Service</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/track" className="hover:text-accent transition-colors">Track Your Order</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/sustainability" className="hover:text-accent transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-accent transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="font-serif text-2xl font-bold text-foreground">
              AR<span className="text-accent">Smart</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors text-foreground">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors text-foreground">
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>&copy; 2026 ARSmart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}