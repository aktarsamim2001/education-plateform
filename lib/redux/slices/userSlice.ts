import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  enrolledCourses?: number
  completedCourses?: number
  webinarsAttended?: number
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
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
    clearUserProfile: (state) => {
      state.profile = null
    },
  },
})

export const { setUserProfile, setLoading, setError, clearUserProfile } = userSlice.actions
export const userReducer = userSlice.reducer
