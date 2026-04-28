import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    // Changed bg-foreground to bg-muted/50 to be theme-aware
    <footer className="bg-muted/50 border-t border-border">    

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
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
          
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="font-serif text-2xl font-bold text-foreground">
              AR<span className="text-accent">Smart</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6 md:mb-0">
  <div className="flex items-center gap-4 mb-6 md:mb-0">
  
  {/* Facebook */}
  <a 
    href="https://www.facebook.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-background border border-border text-foreground transition-colors hover:text-white hover:bg-[#1877F2]"
  >
    <Facebook className="h-5 w-5" />
  </a>

  {/* Instagram */}
  <a 
    href="https://www.instagram.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-background border border-border text-foreground transition-colors hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500"
  >
    <Instagram className="h-5 w-5" />
  </a>

  {/* X (Twitter) */}
  <a 
    href="https://x.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-background border border-border text-foreground transition-colors hover:text-white hover:bg-muted"
  >
    <Twitter className="h-5 w-5" />
  </a>

  {/* YouTube */}
  <a 
    href="https://www.youtube.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-background border border-border text-foreground transition-colors hover:text-white hover:bg-red-600"
  >
    <Youtube className="h-5 w-5" />
  </a>

</div>
</div>

          <div className="text-sm text-muted-foreground">
            <p>&copy; 2026 ARSmart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}