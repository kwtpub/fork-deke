import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  slug: string
  categorySlug: string
  image: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'nexu_cart'

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const initialState: CartState = { items: loadCart() }

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 })
      }
      saveCart(state.items)
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveCart(state.items)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
        saveCart(state.items)
      }
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
