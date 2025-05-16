export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "student" | "instructor" | "admin"
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: "student"
  enrolledCourses: string[] // Course IDs
  registeredWebinars: string[] // Webinar IDs
  completedLessons: string[] // Lesson IDs
  certificates: string[] // Certificate IDs
}

export interface Instructor extends User {
  role: "instructor"
  expertise: string[]
  courses: string[] // Course IDs
  webinars: string[] // Webinar IDs
  rating: number
  reviews: number
  students: number
}

export interface Admin extends User {
  role: "admin"
  permissions: string[]
}
