import mongoose, { Schema, type Document } from "mongoose"

export interface IPage extends Document {
  title: string
  slug: string
  content: string
  description?: string
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
  author?: mongoose.Types.ObjectId
}

const pageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, "Please provide a page title"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide a page slug"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Please provide page content"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

// Create text index for search functionality
pageSchema.index({ title: "text", content: "text", description: "text" })

// Create the model only if it doesn't exist already
export const Page = mongoose.models.Page || mongoose.model<IPage>("Page", pageSchema)
