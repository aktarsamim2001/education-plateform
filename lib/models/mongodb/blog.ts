import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define interfaces
export interface IBlogPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  author: mongoose.Types.ObjectId
  category: string
  tags: string[]
  coverImage: string
  readTime: number
  status: string
  isFeatured: boolean
  views: number
  likes: number
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

// Define schema
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    coverImage: { type: String, required: true },
    readTime: { type: Number, default: 5 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true },
)

// Create model
export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)

// Blog Comment Schema
export interface IBlogComment extends Document {
  postId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  parentId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BlogCommentSchema = new Schema<IBlogComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "BlogComment" },
  },
  { timestamps: true },
)

// Create model
export const BlogComment: Model<IBlogComment> =
  mongoose.models.BlogComment || mongoose.model<IBlogComment>("BlogComment", BlogCommentSchema)
