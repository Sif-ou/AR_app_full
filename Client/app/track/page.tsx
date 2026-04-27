'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, MapPin, CheckCircle2, Search } from 'lucide-react'

const mockOrder = {
  id: 'ORD-2024-001',
  status: 'in-transit',
  estimatedDelivery: 'April 15, 2024',
  items: [
    { name: 'Nordica 3-Seater Sofa', quantity: 1, price: 1299 }
  ],
  timeline: [
    { status: 'Order Placed', date: 'April 8, 2024', completed: true },
    { status: 'Processing', date: 'April 9, 2024', completed: true },
    { status: 'Shipped', date: 'April 10, 2024', completed: true },
    { status: 'In Transit', date: 'April 11, 2024', completed: true, current: true },
    { status: 'Out for Delivery', date: 'Pending', completed: false },
    { status: 'Delivered', date: 'Pending', completed: false }
  ],
  shipping: {
    carrier: 'ARFURN Express',
    trackingNumber: 'ARF1234567890',
    address: '123 Main Street, Apt 4B, New York, NY 10001'
  }
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [trackedOrder, setTrackedOrder] = useState<typeof mockOrder | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setTrackedOrder(mockOrder)
      setIsSearching(false)
    }, 1000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order number to see the current status of your delivery
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter order number (e.g., ORD-2024-001)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <>Searching...</>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Status */}
          {trackedOrder && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{trackedOrder.id}</CardTitle>
                      <CardDescription>
                        Estimated delivery: {trackedOrder.estimatedDelivery}
                      </CardDescription>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      In Transit
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Timeline */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {trackedOrder.timeline.map((step, index) => (
                        <div key={step.status} className="relative flex gap-4">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? step.current 
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-green-500 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.completed && !step.current ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : step.status === 'In Transit' ? (
                              <Truck className="h-4 w-4" />
                            ) : step.status === 'Delivered' ? (
                              <MapPin className="h-4 w-4" />
                            ) : (
                              <Package className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <p className={`font-medium ${step.current ? 'text-accent' : ''}`}>
                              {step.status}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{trackedOrder.shipping.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium font-mono">{trackedOrder.shipping.trackingNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{trackedOrder.shipping.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {trackedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Need help with your order?
            </p>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
