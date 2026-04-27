'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Check, 
  Lock,
  Package
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useEffect } from "react"
type Step = 'information' | 'shipping' | 'payment'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<Step>('information')
  const [isProcessing, setIsProcessing] = useState(false)

  // Form states
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('US')
  const [phone, setPhone] = useState('')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [saveInfo, setSaveInfo] = useState(true)
  const [cardNumber, setCardNumber] = useState("")
  
const [expiry, setExpiry] = useState("")
const [cvv, setCvv] = useState("")
const [cardName, setCardName] = useState("")
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isValidName = (value: string) =>
  /[a-zA-Z]/.test(value) && value.trim().length > 0
useEffect(() => {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      if (data.country_code) {
        setCountry(data.country_code)
      }
    })
    .catch(() => {})
}, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const shippingCost = shippingMethod === 'express' ? 19.99 : totalPrice >= 99 ? 0 : 9.99
  const tax = totalPrice * 0.08 // 8% tax
  const finalTotal = totalPrice + shippingCost + tax

  const steps: { id: Step; label: string }[] = [
    { id: 'information', label: 'Information' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' }
  ]

  const handleContinue = () => {
    if (currentStep === 'information') {
      if (!email || !firstName || !lastName || !address || !city || !zipCode) {
  toast.error('Please fill in all required fields')
  return
}

if (!isValidEmail(email)) {
  toast.error('Please enter a valid email')
  return
}

if (!isValidName(firstName) || !isValidName(lastName)) {
  toast.error('Name must contain at least one letter')
  return
}
if (!/^\d{8,15}$/.test(phone)) {
  toast.error('Phone number must be 8–15 digits')
  return
}
if (!/^\d{4,10}$/.test(zipCode)) {
  toast.error('Please enter a valid ZIP code')
  return
}
if (!/^[a-zA-Z\s]{2,50}$/.test(city)) {
  toast.error('Please enter a valid city')
  return
}
if (!/^[a-zA-Z\s]{2,50}$/.test(state)) {
  toast.error('Please enter a valid state')
  return
}
if (!/^[a-zA-Z0-9\s,.-]{5,100}$/.test(address.trim())) {
  toast.error('Please enter a valid address')
  return
}
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment')
    }
  }

 const handlePlaceOrder = async () => {
  const cleanCard = cardNumber.replace(/\s/g, "")

  if (
    cleanCard.length !== 16 ||
    cvv.length < 3 ||
    expiry.length !== 7 ||
    !cardName
  ) {
    toast.error("Please enter valid payment details")
    return
  }

  setIsProcessing(true)

  await new Promise(resolve => setTimeout(resolve, 2000))

  clearCart()
  router.push('/checkout/success')
}

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to your cart to checkout</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* Header */}
      <header className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl font-bold">
              AR<span className="text-accent">Smart</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep === step.id 
                      ? "bg-accent text-accent-foreground"
                      : steps.findIndex(s => s.id === currentStep) > index
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={cn(
                    "text-sm hidden sm:block",
                    currentStep === step.id ? "font-medium" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 sm:w-24 h-px mx-4",
                    steps.findIndex(s => s.id === currentStep) > index
                      ? "bg-green-500"
                      : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {currentStep === 'information' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <Checkbox 
                              checked={saveInfo}
                              onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                            />
                            <span className="text-sm">Email me with news and offers</span>
                          </label>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input 
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input 
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input 
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Input 
                                id="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zipCode" >ZIP Code</Label>
                              <Input 
                                id="zipCode"
                                value={zipCode}
                                onChange={(e) => {
                                    setZipCode(e.target.value.replace(/\D/g, ""))
                                }}
                                maxLength={10}
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="US">United States</SelectItem>
                                  <SelectItem value="CA">Algeria</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone (optional)</Label>
                            <Input 
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => {const onlyNumbers=e.target.value.replace(/\D/g, "");
                                setPhone(onlyNumbers);
                              }}
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                          </div>
                        </div>
                      </div>

                      <Button size="lg" className="w-full" onClick={handleContinue}>
                        Continue to Shipping
                      </Button>
                    </div>
                  )}

                  {currentStep === 'shipping' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                          <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="standard" id="standard" />
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-muted-foreground">5-7 business days</p>
                              </div>
                            </div>
                            <span className="font-medium">
                              {totalPrice >= 99 ? 'Free' : '$9.99'}
                            </span>
                          </label>
                          <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary mt-3">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="express" id="express" />
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-muted-foreground">2-3 business days</p>
                              </div>
                            </div>
                            <span className="font-medium">$19.99</span>
                          </label>
                        </RadioGroup>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep('information')}
                        >
                          Back
                        </Button>
                        <Button size="lg" className="flex-1" onClick={handleContinue}>
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Payment</h2>
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Credit Card</span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>Card Number</Label>
                              <Input placeholder="1234 5678 9012 3456"
                               maxLength={19}
                               inputMode="numeric"
                               value={cardNumber}
                               onChange={(e) => {
                               let value = e.target.value.replace(/\D/g, ""); 
                               value = value.replace(/(.{4})/g, "$1 ").trim(); 
                               setCardNumber(value);
                             }} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Expiry Date</Label>
                                <Input 
                                placeholder="MM / YY"
                                inputMode="numeric"
                                maxLength={7}
                                value={expiry}
                                onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");

    
                                value = value.slice(0, 4);

    
                                if (value.length >= 1) {
                                let month = value.slice(0, 2);

                                if (month.length === 1) {
        
                                 if (parseInt(month) > 1) {
                                  value = "0" + month;
                                                         }
                                 }

                                 if (month.length === 2) {
                                  let m = parseInt(month);
                                  if (m === 0) value = "01" + value.slice(2);
                                   if (m > 12) value = "12" + value.slice(2);
                                  }
                                  }

    
                                 if (value.length >= 3) {
                                  value = value.slice(0, 2) + " / " + value.slice(2);
                                 }

                                 setExpiry(value);
                                 }}
                                />
                              </div>
                              <div>
                                <Label>CVV</Label>
                                <Input 
                                placeholder="123"
                                maxLength={4}
                                inputMode="numeric"
                                value={cvv}
                                onChange={(e) => {
                                   const value = e.target.value.replace(/\D/g, "") 
                                   setCvv(value)
                                   }}
                                
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Name on Card</Label>
                              <Input 
                              placeholder="Hamid" 
                              value={cardName}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
                                setCardName(value)
                                }}
                              
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep('shipping')}
                        >
                          Back
                        </Button>
                        <Button 
                          size="lg" 
                          className="flex-1" 
                          onClick={handlePlaceOrder}
                          disabled={
                            isProcessing ||
                            !cardNumber ||
                            !expiry ||
                            !cvv ||
                            !cardName
                          }
                        >
                          {isProcessing ? 'Processing...' : `Pay ${formatPrice(finalTotal)}`}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div 
                        key={`${item.product.id}-${item.selectedColor}`}
                        className="flex gap-3"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground text-background text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.selectedColor}</p>
                        </div>
                        <p className="font-medium text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>

                  {/* Trust badges */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $99</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Secure SSL encrypted payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
