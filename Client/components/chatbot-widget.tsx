'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { products } from '@/lib/data' 
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Maximize2,
  Minimize2,
  Bot,
  User 
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Use the Render URL directly to avoid environment variable confusion
const access_bot = 'https://ar-app-back-end.onrender.com'

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // 1. Add User Message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // 2. Build URL with the 'prompt' parameter
      // This matches your @RequestParam("prompt") in Spring Boot
      const params = new URLSearchParams({ prompt: messageText })
      const requestUrl = `${access_bot}/api/chat?${params.toString()}`

      // 3. Execute the Fetch
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`)
      }

      // 4. Get the result from AI_ModelService
      const botReply = await response.text()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        products: [],
        quickReplies: [] 
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Connection Error:", error)
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "I'm having trouble reaching the server. If this is the first message, Render might be waking up (please wait 30s)."
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-card rounded-xl shadow-2xl border border-border flex flex-col transition-all duration-300",
          isExpanded ? "inset-4 md:inset-8" : "bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]"
        )}>
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-semibold text-sm">Assistant</h3>
                <p className="text-[10px] text-green-500">Online</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === 'user' && "flex-row-reverse")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", m.role === 'assistant' ? "bg-accent/10" : "bg-muted")}>
                  {m.role === 'assistant' ? <Bot className="h-4 w-4 text-accent" /> : <User className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className={cn("flex-1", m.role === 'user' && "text-right")}>
                  <div className={cn("rounded-xl px-4 py-2 inline-block max-w-[90%] text-sm shadow-sm", m.role === 'assistant' ? "bg-muted" : "bg-accent text-accent-foreground")}>
                    {m.content}
                  </div>
                  {m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.quickReplies.map(r => (
                        <button key={r} onClick={() => handleSend(r)} className="text-[10px] px-2 py-1 rounded-full border bg-background hover:bg-muted">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-muted-foreground animate-pulse px-12">Assistant is thinking...</div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="p-4 border-t flex gap-2">
            <Input 
              ref={inputRef}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-sm"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}