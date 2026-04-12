import { configureStore } from '@reduxjs/toolkit'
import { productSlice } from '@entities/product'
import { cartSlice } from '@features/cart/model/cartSlice'

export const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    cart: cartSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
