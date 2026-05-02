'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Product } from './data'

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, selectedColor: string, quantity?: number) => void
  removeItem: (productId: string, selectedColor: string) => void
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: Product, selectedColor: string, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === selectedColor
      )

      if (existingIndex > -1) {
        const newItems = [...prev]
        newItems[existingIndex].quantity += quantity
        return newItems
      }

      return [...prev, { product, quantity, selectedColor }]
    })
  }, [])

  const removeItem = useCallback((productId: string, selectedColor: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor === selectedColor)
    ))
  }, [])

  const updateQuantity = useCallback((productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, selectedColor)
      return
    }

    setItems(prev => prev.map(item => 
      item.product.id === productId && item.selectedColor === selectedColor
        ? { ...item, quantity }
        : item
    ))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
