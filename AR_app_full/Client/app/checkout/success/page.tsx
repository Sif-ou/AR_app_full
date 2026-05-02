import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Package, Truck, Mail } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const orderNumber = `AR${Date.now().toString().slice(-8)}`

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Thank you for your order!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your order has been successfully placed and is being processed.
            </p>

            {/* Order Details Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-mono font-semibold">{orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Status Steps */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Order Confirmed</p>
                    <p className="text-xs text-muted-foreground">Email sent</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">1-2 days</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Shipping</p>
                    <p className="text-xs text-muted-foreground">5-7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What&apos;s Next */}
            <div className="bg-card rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold mb-4">What&apos;s Next?</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll receive an email confirmation shortly with your order details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Once your order ships, we&apos;ll send you tracking information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use our AR feature to visualize more products while you wait</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/track">Track Your Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
