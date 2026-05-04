'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="font-serif text-2xl font-bold text-foreground">
              AR<span className="text-accent">Smart</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Transforming your shopping experience with cutting-edge Augmented Reality. 
              Visualize furniture in your space before you buy.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products?category=living-room" className="hover:text-accent transition-colors">Living Room</Link></li>
              <li><Link href="/products?category=bedroom" className="hover:text-accent transition-colors">Bedroom</Link></li>
              <li><Link href="/products?category=dining" className="hover:text-accent transition-colors">Dining</Link></li>
              <li><Link href="/products?category=office" className="hover:text-accent transition-colors">Home Office</Link></li>
              <li><Link href="/products?category=lighting" className="hover:text-accent transition-colors">Lighting</Link></li>
            </ul>
          </div>

          {/* AR Column */}
          <div>
            <h4 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-xs">AR Experience</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/ar-experience" className="hover:text-accent transition-colors">Try AR</Link></li>
              <li><Link href="/ar-experience#how-it-works" className="hover:text-accent transition-colors">How It Works</Link></li>
              <li><Link href="/ar-experience#compatible-devices" className="hover:text-accent transition-colors">Compatible Devices</Link></li>
              <li><Link href="/ar-experience#faq" className="hover:text-accent transition-colors">AR FAQ</Link></li>
            </ul>
          </div>

          {/* Service Column */}
          <div>
            <h4 className="font-semibold mb-5 text-foreground uppercase tracking-wider text-xs">Customer Service</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping Info</Link></li>
              <li><Link href="/track" className="hover:text-accent transition-colors">Track Your Order</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-6">
          
          {/* Social Media - Responsive alignment */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background border border-border text-muted-foreground transition-all hover:text-white hover:bg-[#1877F2] active:scale-95"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background border border-border text-muted-foreground transition-all hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] active:scale-95"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>

            {/* X (Twitter) */}
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background border border-border text-muted-foreground transition-all hover:text-white hover:bg-black active:scale-95"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background border border-border text-muted-foreground transition-all hover:text-white hover:bg-[#FF0000] active:scale-95"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright - Responsive alignment */}
          <div className="text-sm text-muted-foreground order-1 md:order-2 text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} ARSmart. All rights reserved.</p>
          </div>
          
        </div>
      </div>
    </footer>
  )
}	