'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type WishlistItemId = string | number

type WishlistContextType = {
  wishlist: WishlistItemId[]
  toggleWishlist: (productId: WishlistItemId) => void
  isInWishlist: (productId: WishlistItemId) => boolean
  totalWishlistItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItemId[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist_items')
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse wishlist', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (productId: WishlistItemId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const isInWishlist = (productId: WishlistItemId) => {
    return wishlist.includes(String(productId))
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}