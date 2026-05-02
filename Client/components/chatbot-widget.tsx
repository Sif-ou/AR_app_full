'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { products } from '@/lib/data'
import { 
  MessageCircle, X, Send, Sparkles, Maximize2, Minimize2, Bot, User 
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 1. Setup your Render URL (Use Environment Variable for Vercel)
const access_bot = process.env.NEXT_PUBLIC_access_bot || 'http://localhost:8080';

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
    content: "Hello! I'm your AR Shopping Assistant. How can I help you today?",
    quickReplies: ['Show me sofas', 'I need help with AR', 'What\'s on sale?']
  }
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // 2. The Updated handleSend Function
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

    try {
      // Constructing GET request for your Spring Boot Controller
      const url = new URL(`${access_bot}/api/chat`);
      url.searchParams.append('prompt', messageText);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Network error');

      const botReply = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        products: [], // You can map products here if your backend sends them
        quickReplies: []
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the server. Render might be sleeping!"
      }])
    } finally {
      setIsTyping(false)
    }
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

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3", message.role === 'user' && "flex-row-reverse")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", message.role === 'assistant' ? "bg-accent/10" : "bg-muted")}>
                  {message.role === 'assistant' ? <Bot className="h-4 w-4 text-accent" /> : <User className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className={cn("flex-1 space-y-3", message.role === 'user' && "flex flex-col items-end")}>
                  <div className={cn("rounded-xl px-4 py-2 max-w-[85%] whitespace-pre-line shadow-sm", message.role === 'assistant' ? "bg-muted" : "bg-accent text-accent-foreground")}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.quickReplies && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {message.quickReplies.map(reply => (
                        <button key={reply} onClick={() => handleSend(reply)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors shadow-sm">
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
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Bot className="h-4 w-4 text-accent" /></div>
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
          </div>
        </div>
      )}
    </>
  )
}