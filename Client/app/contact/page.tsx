'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // simulate API
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1500)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground">
              Have a question or need help? We're here for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT - INFO */}
            <div className="space-y-6">

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <Mail className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">kaka@arsmart.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <Phone className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+213 555 00 00 00</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">Algeria</p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT - FORM */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Thank u for reaching out - we will get back to you as soon as possible!
                </CardDescription>
              </CardHeader>

              <CardContent>
                {sent ? (
                  <div className="text-center py-10">
                    <p className="text-green-600 font-medium text-lg">
                      ✅ Message sent successfully!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <Input placeholder="Your Name" required />

                    <Input type="email" placeholder="Your Email" required />

                    <Input placeholder="Subject" />

                    <textarea
                      placeholder="Your Message"
                      className="w-full p-3 border rounded-lg h-32 bg-background"
                      required
                    />

                    <Button type="submit" className="w-full">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>

                  </form>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}