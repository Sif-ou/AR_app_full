import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { Toaster } from '@/components/ui/sonner'
// 1. Import your ThemeProvider
import { ThemeProvider } from '@/components/theme-provider'
import { WishlistProvider } from '@/lib/wishlist-context'


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
    // 2. Added suppressHydrationWarning here
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
     <body className="font-sans antialiased">
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <CartProvider>
      <WishlistProvider>

        <main className="min-h-screen w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
    {children}
  </main>
        <Toaster />

      </WishlistProvider>
    </CartProvider>

    {process.env.NODE_ENV === 'production' && <Analytics />}
  </ThemeProvider>
</body>
    </html>
  )
}