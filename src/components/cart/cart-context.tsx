"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  getProductById,
  type CartItem,
  type Product,
} from "@/data/checkout"

type PersistedCartItem = {
  productId: string
  quantity: number
}

type CartContextValue = {
  hydrated: boolean
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (product: Product) => void
  incrementItem: (productId: string) => void
  decrementItem: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const storageKey = "pay4-cart"

const CartContext = createContext<CartContextValue | null>(null)

function hydrateCartItems(value: string | null): CartItem[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value) as PersistedCartItem[]

    return parsed.flatMap((entry) => {
      const product = getProductById(entry.productId)

      if (!product || entry.quantity < 1) {
        return []
      }

      return [{ product, quantity: entry.quantity }]
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(hydrateCartItems(window.localStorage.getItem(storageKey)))
    setHydrated(true)
  }, [])

  useEffect(() => {
    const persisted: PersistedCartItem[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }))

    window.localStorage.setItem(storageKey, JSON.stringify(persisted))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    return {
      hydrated,
      items,
      itemCount,
      subtotal,
      addItem(product) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id)

          if (!existing) {
            return [...current, { product, quantity: 1 }]
          }

          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })
      },
      incrementItem(productId) {
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        )
      },
      decrementItem(productId) {
        setItems((current) =>
          current.flatMap((item) => {
            if (item.product.id !== productId) {
              return [item]
            }

            if (item.quantity <= 1) {
              return []
            }

            return [{ ...item, quantity: item.quantity - 1 }]
          })
        )
      },
      removeItem(productId) {
        setItems((current) =>
          current.filter((item) => item.product.id !== productId)
        )
      },
      clearCart() {
        setItems([])
      },
    }
  }, [hydrated, items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}
