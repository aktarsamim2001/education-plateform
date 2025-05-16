import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CartItem {
  id: string
  type: "course" | "webinar"
  title: string
  price: number
  image?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Check if item already exists
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id && item.type === action.payload.type,
      )

      if (!existingItem) {
        state.items.push(action.payload)
        state.total += action.payload.price
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; type: "course" | "webinar" }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id && item.type === action.payload.type)

      if (index !== -1) {
        state.total -= state.items[index].price
        state.items.splice(index, 1)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export const cartReducer = cartSlice.reducer
