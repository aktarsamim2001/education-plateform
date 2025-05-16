import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Course } from "@/lib/models/course"

interface CourseState {
  courses: Course[]
  enrolledCourses: Course[]
  currentCourse: Course | null
  isLoading: boolean
  error: string | null
}

const initialState: CourseState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
}

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
      state.isLoading = false
      state.error = null
    },
    setEnrolledCourses: (state, action: PayloadAction<Course[]>) => {
      state.enrolledCourses = action.payload
      state.isLoading = false
      state.error = null
    },
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload
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

export const { setCourses, setEnrolledCourses, setCurrentCourse, setLoading, setError } = courseSlice.actions
export const courseReducer = courseSlice.reducer
