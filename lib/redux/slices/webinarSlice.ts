import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Webinar } from "@/lib/models/webinar"

interface WebinarState {
  webinars: Webinar[]
  registeredWebinars: Webinar[]
  currentWebinar: Webinar | null
  isLoading: boolean
  error: string | null
}

const initialState: WebinarState = {
  webinars: [],
  registeredWebinars: [],
  currentWebinar: null,
  isLoading: false,
  error: null,
}

const webinarSlice = createSlice({
  name: "webinars",
  initialState,
  reducers: {
    setWebinars: (state, action: PayloadAction<Webinar[]>) => {
      state.webinars = action.payload
      state.isLoading = false
      state.error = null
    },
    setRegisteredWebinars: (state, action: PayloadAction<Webinar[]>) => {
      state.registeredWebinars = action.payload
      state.isLoading = false
      state.error = null
    },
    setCurrentWebinar: (state, action: PayloadAction<Webinar>) => {
      state.currentWebinar = action.payload
      state.isLoading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setWebinars, setRegisteredWebinars, setCurrentWebinar, setLoading, setError } = webinarSlice.actions
export const webinarReducer = webinarSlice.reducer
