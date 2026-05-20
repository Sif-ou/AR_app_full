import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { WishlistProvider } from '@/lib/wishlist-context'
import { GoogleAuthProvider } from "@/components/GoogleAuthProvider"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'AR Smart Retail | Immersive Shopping Experience',
  description: 'Experience the future of shopping with augmented reality.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* We place GoogleAuthProvider at the top level so your whole app has access to it */}
        <GoogleAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <WishlistProvider>
                <main className="min-h-screen w-full overflow-x-hidden">
                  {children}
                </main>
                <Toaster />
              </WishlistProvider>
            </CartProvider>

            {process.env.NODE_ENV === 'production' && <Analytics />}
          </ThemeProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  )
}