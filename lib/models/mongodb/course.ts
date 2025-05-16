import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define interfaces
export interface ICourse extends Document {
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  price: number
  discountPrice?: number
  duration: string
  level: string
  category: string
  instructorId: mongoose.Types.ObjectId
  modules: {
    title: string
    description?: string
    lessons: {
      title: string
      description?: string
      videoUrl?: string
      content?: string
      duration: number
      isPreview: boolean
      order: number
    }[]
  }[]
  requirements: string[]
  objectives: string[]
  rating: number
  reviews: number
  students: number
  status: string
  isFeatured: boolean
  isBestseller: boolean
  createdAt: Date
  updatedAt: Date
}

// Define schema
const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modules: [
      {
        title: { type: String, required: true },
        description: { type: String },
        lessons: [
          {
            title: { type: String, required: true },
            description: { type: String },
            videoUrl: { type: String },
            content: { type: String },
            duration: { type: Number, required: true },
            isPreview: { type: Boolean, default: false },
            order: { type: Number, required: true },
          },
        ],
      },
    ],
    requirements: [{ type: String }],
    objectives: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Create model
export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)

// Course Progress Schema
export interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  completedLessons: string[]
  lastAccessedAt: Date
  progress: number
  quizScores: {
    quizId: string
    score: number
    maxScore: number
    completedAt: Date
  }[]
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: String }],
    lastAccessedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    quizScores: [
      {
        quizId: { type: String, required: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, required: true },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

// Create unique compound index
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Create model
export const CourseProgress: Model<ICourseProgress> =
  mongoose.models.CourseProgress || mongoose.model<ICourseProgress>("CourseProgress", CourseProgressSchema)

// Course Review Schema
export interface ICourseReview extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const CourseReviewSchema = new Schema<ICourseReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
)

// Create unique compound index
CourseReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Create model
export const CourseReview: Model<ICourseReview> =
  mongoose.models.CourseReview || mongoose.model<ICourseReview>("CourseReview", CourseReviewSchema)
