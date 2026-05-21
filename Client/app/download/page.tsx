import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust path based on your project structure

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Navigation / Header */}
      <header className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl w-full bg-accent text-accent-foreground rounded-3xl p-8 md:p-16 shadow-xl">
          
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
            Experience AR Furniture
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Download our App
          </h1>
          
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-12">
            Bring our entire furniture catalog into your living room with real-time Augmented Reality. Available for iOS and Android.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-2xl mx-auto">
            
            {/* Left Side: Direct Download Links */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="font-sans text-xl font-semibold mb-2 text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
                <Smartphone className="h-5 w-5" />
                Get it on your device
              </h3>

              <Button size="lg" variant="secondary" className="w-full justify-start py-7 px-6 border border-muted" asChild>
                <Link href="https://wormhole.app/3ooWNW#-ncuNyZFujZfdprgFGiZqg" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-3 h-6 w-6 shrink-0" />
                  <div className="text-left">
                    <h1>Download From The Link</h1>
                  </div>
                </Link>
              </Button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer Spacer */}
      <footer className="py-6 text-center text-xs opacity-50">
        &copy; {new Date().getFullYear()} Your Furniture Brand. All rights reserved.
      </footer>
    </div>
  );
}