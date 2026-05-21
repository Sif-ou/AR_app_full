'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const BASE_URL = 'https://ar-app-back-end.onrender.com'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  quickReplies?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm **JACK**, your Smart Retail Assistant. How can I help you design your space today?",
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

    // Add user message to UI
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Send the entire conversation history to the backend
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          {
            role: 'user',
            parts: [{ text: messageText }]
          }
        ])
      })

      if (!response.ok) throw new Error(`Server Error: ${response.status}`)

      const botReply = await response.text()
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: botReply }])
    } catch (error) {
      console.error("Error:", error)
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: "Server connection failed." }])
    } finally {
      setIsTyping(false)
    }
}
  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className={cn(
          "fixed z-50 bg-card border border-border flex flex-col transition-all duration-300 shadow-2xl",
          isExpanded 
            ? "inset-0 md:inset-6 md:rounded-xl" 
            : "bottom-0 right-0 w-full h-[90vh] rounded-t-2xl sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:max-h-[85vh] sm:rounded-xl"
        )}>
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <h3 className="font-semibold text-sm">JACK Engine</h3>
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
                  <div className={cn(
                    "rounded-xl px-4 py-2 inline-block max-w-[90%] text-sm shadow-sm text-left whitespace-pre-line break-words", 
                    m.role === 'assistant' ? "bg-muted text-foreground" : "bg-accent text-accent-foreground"
                  )}>
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="mb-1">{children}</p>,
                        h3: ({ children }) => <h3 className="font-bold text-accent mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                        a: ({ href, children }) => (
                          <Link 
                            href={href || '/products'} 
                            onClick={() => setIsOpen(false)}
                            className="block mt-2 w-full text-center bg-accent text-accent-foreground rounded-lg py-2 text-xs font-bold hover:opacity-90 shadow-sm"
                          >
                            {children}
                          </Link>
                        )
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                  {m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.quickReplies.map(r => (
                        <button key={r} onClick={() => handleSend(r)} className="text-[10px] px-2 py-1 rounded-full border bg-background hover:bg-muted transition-colors">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))} 
            {isTyping && <div className="text-xs text-muted-foreground animate-pulse px-12">JACK is thinking ...</div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="p-4 border-t flex gap-2">
            <Input 
              ref={inputRef}
              placeholder="Ask JACK about furniture..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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