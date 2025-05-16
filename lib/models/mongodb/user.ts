import mongoose, { Schema, type Document, type Model } from "mongoose"
import { hash } from "bcryptjs"

// Define interfaces
export interface IUser extends Document {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "student" | "instructor" | "admin"
  avatar?: string
  bio?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  enrolledCourses: mongoose.Types.ObjectId[]
  completedCourses: mongoose.Types.ObjectId[]
  registeredWebinars: mongoose.Types.ObjectId[]
  wishlist: mongoose.Types.ObjectId[]
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
  emailVerified: boolean
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Define schema
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
      required: true,
    },
    avatar: { type: String },
    bio: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    completedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    registeredWebinars: [{ type: Schema.Types.ObjectId, ref: "Webinar" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    socialLinks: {
      website: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    this.password = await hash(this.password, 10)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Create model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
