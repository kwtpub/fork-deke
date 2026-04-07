import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from './productTypes'

interface ProductState {
  currentProduct: Product | null
  loading: boolean
  error: string | null
}

const initialState: ProductState = { currentProduct: null, loading: false, error: null }

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setCurrentProduct(state, action: PayloadAction<Product | null>) {
      state.currentProduct = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload },
  },
})

export const { setCurrentProduct, setLoading, setError } = productSlice.actions
