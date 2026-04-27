import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { ARFeatureSection } from '@/components/home/ar-feature-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ChatbotWidget } from '@/components/chatbot-widget'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <ARFeatureSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <CartDrawer /> 
      <ChatbotWidget />
    </div>
  )
}
