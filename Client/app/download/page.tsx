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
                <Link href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-3 h-6 w-6 shrink-0" />
                  <div className="text-left">
                    <h1>Download From The Link</h1>
                  </div>
                </Link>
              </Button>
            </div>

            {/* Right Side: QR Code Capture */}
            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-accent-foreground/20 pt-8 md:pt-0 md:pl-8">
              <h3 className="font-sans text-xl font-semibold mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Scan to Download
              </h3>
              
              {/* QR Code Placeholder Wrapper */}
              <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mb-3">
                {/* Replace this div with an actual <img> tag pointing to your generated QR code SVG/PNG */}
                <div className="w-40 h-40 bg-slate-200 flex items-center justify-center text-slate-500 rounded-lg border-2 border-dashed border-slate-300">
                  <span className="text-xs font-mono font-semibold">[ QR Code Image ]</span>
                </div>
              </div>
              
              <p className="text-xs opacity-70 max-w-[200px]">
                Point your phone camera at the code to instantly download.
              </p>
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