import { configureStore } from "@reduxjs/toolkit"
import { cartReducer } from "./slices/cartSlice"
import { userReducer } from "./slices/userSlice"
import { courseReducer } from "./slices/courseSlice"
import { webinarReducer } from "./slices/webinarSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    courses: courseReducer,
    webinars: webinarReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
