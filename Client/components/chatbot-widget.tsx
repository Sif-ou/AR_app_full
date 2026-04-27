'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
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
    content: "Hello! I'm your AR Shopping Assistant. I can help you find the perfect furniture and guide you through our AR experience. What are you looking for today?",
    quickReplies: ['Show me sofas', 'I need help with AR', 'What\'s on sale?']
  }
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // This ensures the view jumps to the bottom whenever a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

const handleSend = async (text?: string) => {
  const messageText = text || inputValue.trim()
  if (!messageText || isTyping) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: messageText
  }
  setMessages(prev => [...prev, userMessage])
  setInputValue('')
  setIsTyping(true)

  try {
    // We use encodeURIComponent to make sure special characters in the prompt don't break the URL
    const response = await fetch(`https://ar-app-back-end.onrender.com/api/chat?prompt=${encodeURIComponent(messageText)}`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Backend failed');

    const botText = await response.text(); // Your controller returns a raw String

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: botText
    }])
  } catch (error) {
    console.error("Error:", error);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I'm having trouble connecting to the server."
    }])
  } finally {
    setIsTyping(false)
  }
}
  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-card rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300",
          isExpanded ? "inset-4 md:inset-8" : "bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shrink-0 bg-card">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-semibold text-sm">AR Assistant</h3>
                <p className="text-[10px] text-green-500 flex items-center gap-1">● Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Fixed Scroll Area */}
          <ScrollArea className="flex-1 w-full min-h-0" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn(
                  "flex gap-3 w-full",
                  message.role === 'user' && "flex-row-reverse"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === 'assistant' ? "bg-accent/10" : "bg-muted"
                  )}>
                    {message.role === 'assistant' ? <Bot className="h-4 w-4 text-accent" /> : <User className="h-4 w-4" />}
                  </div>

                  <div className={cn("flex-1 min-w-0 space-y-2", message.role === 'user' && "flex flex-col items-end")}>
                    <div className={cn(
                      "rounded-2xl px-4 py-2 max-w-[85%] break-words text-sm whitespace-pre-line overflow-hidden",
                      message.role === 'assistant' ? "bg-muted" : "bg-accent text-accent-foreground"
                    )}>
                      {message.content}
                    </div>

                    {message.quickReplies && (
                      <div className="flex flex-wrap gap-2">
                        {message.quickReplies.map(reply => (
                          <button
                            key={reply}
                            onClick={() => handleSend(reply)}
                            disabled={isTyping}
                            className="text-[11px] px-3 py-1 rounded-full border hover:bg-muted transition-colors bg-background disabled:opacity-50"
                          >
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
                  <div className="bg-muted rounded-2xl px-4 py-2 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              
              {/* This div acts as the anchor for the scroll-to-bottom logic */}
              <div ref={messagesEndRef} /> 
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t shrink-0 bg-card">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <Input 
                ref={inputRef}
                placeholder={isTyping ? "Assistant is typing..." : "Ask me anything..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}