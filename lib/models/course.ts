export interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  category: string
  level: "beginner" | "intermediate" | "advanced" | "all-levels"
  price: number
  discountPrice?: number
  thumbnail: string
  instructorId: string
  lessons: Lesson[]
  requirements: string[]
  objectives: string[]
  rating: number
  reviews: number
  students: number
  duration: string // Total duration in hours
  status: "draft" | "pending" | "published" | "archived"
  isFeatured: boolean
  isBestseller: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: number // Duration in minutes
  videoUrl?: string
  content?: string
  resources?: Resource[]
  isPreview: boolean
  order: number
}

export interface Resource {
  id: string
  title: string
  type: "pdf" | "video" | "link" | "file"
  url: string
  size?: string
}

export interface CourseReview {
  id: string
  courseId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface CourseProgress {
  userId: string
  courseId: string
  completedLessons: string[] // Lesson IDs
  lastAccessedLesson: string // Lesson ID
  progress: number // Percentage
  startedAt: Date
  lastAccessedAt: Date
}
