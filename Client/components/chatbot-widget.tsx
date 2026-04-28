'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// Use a standard div for scrolling to prevent the Radix viewport height bug
import { products, categories } from '@/lib/data'
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Maximize2,
  Minimize2,
  Bot,
  User,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: typeof products
  quickReplies?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your AR Shopping Assistant. I can help you find the perfect furniture, answer questions about products, and guide you through our AR experience. What are you looking for today?",
    quickReplies: [
      'Show me sofas',
      'I need help with AR',
      'What\'s on sale?',
      'Recommend something for my living room'
    ]
  }
]

function generateResponse(userMessage: string): Message {
  const lowercaseMessage = userMessage.toLowerCase()
  
  // Product category searches
  if (lowercaseMessage.includes('sofa') || lowercaseMessage.includes('couch')) {
    const sofas = products.filter(p => p.subcategory === 'sofas' || p.name.toLowerCase().includes('sofa'))
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I found ${sofas.length} beautiful sofas for you! Our bestseller is the Nordica 3-Seater Sofa - it's incredibly comfortable and looks stunning in any living room. Would you like to see it in AR?`,
      products: sofas.slice(0, 3),
      quickReplies: ['Show in AR', 'More sofas', 'What colors available?', 'Price range?']
    }
  }

  if (lowercaseMessage.includes('living room')) {
    const livingRoomProducts = products.filter(p => p.category === 'living-room').slice(0, 4)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Great choice! For living rooms, I recommend starting with a focal piece like a sofa, then adding accent chairs and a coffee table. Here are some of our popular living room pieces:",
      products: livingRoomProducts,
      quickReplies: ['Show sofas', 'Coffee tables', 'Lighting options', 'See full collection']
    }
  }

  if (lowercaseMessage.includes('bedroom')) {
    const bedroomProducts = products.filter(p => p.category === 'bedroom').slice(0, 3)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Creating a peaceful bedroom? Our Haven Platform Bed is a customer favorite - it comes with a beautiful tufted headboard. Here are our top bedroom picks:",
      products: bedroomProducts,
      quickReplies: ['Show beds', 'Nightstands', 'Complete the look', 'View in AR']
    }
  }

  if (lowercaseMessage.includes('sale') || lowercaseMessage.includes('discount') || lowercaseMessage.includes('deal')) {
    const saleProducts = products.filter(p => p.originalPrice).slice(0, 4)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great timing! We have ${saleProducts.length} items on sale right now with up to 25% off. Here are some highlights:`,
      products: saleProducts,
      quickReplies: ['Show all deals', 'Sort by discount', 'Free shipping items', 'New arrivals']
    }
  }

  // AR related queries
  if (lowercaseMessage.includes('ar') || lowercaseMessage.includes('augmented reality') || lowercaseMessage.includes('view in room')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Our AR feature lets you see furniture in your actual space before buying! Here's how it works:\n\n1. Find a product with the AR badge\n2. Click 'View in AR'\n3. Point your camera at a flat surface\n4. Place, rotate, and resize the furniture\n\nIt works on most modern smartphones and tablets. Would you like me to show you some AR-enabled products?",
      quickReplies: ['Show AR products', 'How accurate is it?', 'Compatible devices', 'Try now']
    }
  }

  // Budget queries
  if (lowercaseMessage.includes('budget') || lowercaseMessage.includes('cheap') || lowercaseMessage.includes('affordable') || lowercaseMessage.includes('under')) {
    const affordableProducts = products.filter(p => p.price < 500).slice(0, 4)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I understand budget is important! Here are some great options under $500 that don't compromise on quality or style:",
      products: affordableProducts,
      quickReplies: ['Under $300', 'Best value picks', 'Payment plans', 'Free shipping']
    }
  }

  // Style queries
  if (lowercaseMessage.includes('modern') || lowercaseMessage.includes('contemporary')) {
    const modernProducts = products.slice(0, 4)
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Love modern design? Our collection features clean lines, minimalist aesthetics, and quality materials. Here are some contemporary favorites:",
      products: modernProducts,
      quickReplies: ['Minimalist picks', 'Scandinavian style', 'Mix and match', 'Get design help']
    }
  }

  if (lowercaseMessage.includes('scandinavian') || lowercaseMessage.includes('nordic')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Scandinavian design is all about functionality, simplicity, and natural materials. Our Nordica collection embodies these principles beautifully. Key features include light wood tones, organic shapes, and cozy textiles.",
      products: products.slice(0, 3),
      quickReplies: ['Shop Nordica', 'Light wood pieces', 'Cozy textiles', 'Complete the look']
    }
  }

  // Help and support
  if (lowercaseMessage.includes('help') || lowercaseMessage.includes('support')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I'm here to help! I can assist you with:\n\n• Finding the perfect furniture\n• Using our AR visualization\n• Product recommendations\n• Order tracking\n• Returns and exchanges\n\nWhat would you like help with?",
      quickReplies: ['Find furniture', 'Track order', 'Return policy', 'Contact human']
    }
  }

  // Shipping queries
  if (lowercaseMessage.includes('shipping') || lowercaseMessage.includes('delivery')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "We offer free standard shipping on orders over $99! Here are our shipping options:\n\n• Standard: 5-7 business days (Free over $99)\n• Express: 2-3 business days ($19.99)\n\nAll furniture is carefully packaged and delivered to your door. Large items include white-glove delivery service.",
      quickReplies: ['Track my order', 'Delivery times', 'Assembly included?', 'Return policy']
    }
  }

  // Returns
  if (lowercaseMessage.includes('return') || lowercaseMessage.includes('refund')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "We have a 30-day return policy on most items. If you're not completely satisfied, you can return items in their original condition for a full refund. Our AR feature helps reduce returns by letting you see items in your space first!",
      quickReplies: ['Start a return', 'Try AR first', 'Exchange item', 'Contact support']
    }
  }

  // Dimensions/size queries
  if (lowercaseMessage.includes('dimension') || lowercaseMessage.includes('size') || lowercaseMessage.includes('fit')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Great question! Each product page lists detailed dimensions. But here's a pro tip: use our AR feature to see exactly how furniture will fit in your space! It's the most accurate way to check sizing before you buy.",
      quickReplies: ['Try AR now', 'Measure my room', 'Size guide', 'Ask about specific item']
    }
  }

  // Color queries
  if (lowercaseMessage.includes('color') || lowercaseMessage.includes('colour')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Most of our furniture comes in multiple colors! You can see and switch between colors on the product page, and even preview different colors in AR. Popular choices include neutral tones like grey and cream, as well as statement colors like navy and forest green.",
      quickReplies: ['Neutral options', 'Bold colors', 'Match my room', 'See in AR']
    }
  }

  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: "I'd be happy to help you find the perfect piece! Could you tell me more about what you're looking for? For example:\n\n• What room is it for?\n• Any style preferences?\n• Budget range?\n• Specific features you need?",
    quickReplies: ['Living room', 'Bedroom', 'Home office', 'Show bestsellers']
  }
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom logic for native div
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = generateResponse(messageText)
    setMessages(prev => [...prev, response])
    setIsTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-card rounded-xl shadow-2xl border border-border flex flex-col transition-all duration-300",
          isExpanded 
            ? "inset-4 md:inset-8" 
            : "bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">AR Shopping Assistant</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area - Native Scroll for reliability */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'assistant' ? "bg-accent/10" : "bg-muted"
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-accent" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className={cn(
                  "flex-1 space-y-3",
                  message.role === 'user' && "flex flex-col items-end"
                )}>
                  <div className={cn(
                    "rounded-xl px-4 py-2 max-w-[85%] whitespace-pre-line shadow-sm",
                    message.role === 'assistant' ? "bg-muted" : "bg-accent text-accent-foreground"
                  )}>
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.products && message.products.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
                      {message.products.map(product => (
                        <Link key={product.id} href={`/products/${product.id}`}
                          className="flex-shrink-0 w-32 bg-background rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-square bg-muted">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-medium truncate">{product.name}</p>
                            <p className="text-xs text-accent font-semibold">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {message.quickReplies.map(reply => (
                        <button key={reply} onClick={() => handleSend(reply)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm">
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-muted rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border shrink-0 bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <Input 
                ref={inputRef}
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by AR Smart Retail AI
            </p>
          </div>
        </div>
      )}
    </>
  )
}