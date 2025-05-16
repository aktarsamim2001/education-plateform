import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define interfaces
export interface IWebinar extends Document {
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  price: number
  discountPrice?: number
  startDate: Date
  endDate: Date
  duration: number
  instructorId: mongoose.Types.ObjectId
  category: string
  level: string
  status: string
  isFeatured: boolean
  maxAttendees: number
  registeredAttendees: number
  recordingUrl?: string
  resources?: {
    title: string
    url: string
    type: string
  }[]
  createdAt: Date
  updatedAt: Date
}

// Define schema
const WebinarSchema = new Schema<IWebinar>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    status: { type: String, enum: ["upcoming", "live", "completed", "cancelled"], default: "upcoming" },
    isFeatured: { type: Boolean, default: false },
    maxAttendees: { type: Number, default: 100 },
    registeredAttendees: { type: Number, default: 0 },
    recordingUrl: { type: String },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true }, // pdf, slides, code, etc.
      },
    ],
  },
  { timestamps: true },
)

// Create model
export const Webinar: Model<IWebinar> = mongoose.models.Webinar || mongoose.model<IWebinar>("Webinar", WebinarSchema)

// Webinar Registration Schema
export interface IWebinarRegistration extends Document {
  webinarId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  paymentId?: string
  paymentStatus: string
  attended: boolean
  feedback?: {
    rating: number
    comment: string
  }
  createdAt: Date
  updatedAt: Date
}

const WebinarRegistrationSchema = new Schema<IWebinarRegistration>(
  {
    webinarId: { type: Schema.Types.ObjectId, ref: "Webinar", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: String },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    attended: { type: Boolean, default: false },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  },
  { timestamps: true },
)

// Create unique compound index
WebinarRegistrationSchema.index({ webinarId: 1, userId: 1 }, { unique: true })

// Create model
export const WebinarRegistration: Model<IWebinarRegistration> =
  mongoose.models.WebinarRegistration ||
  mongoose.model<IWebinarRegistration>("WebinarRegistration", WebinarRegistrationSchema)
