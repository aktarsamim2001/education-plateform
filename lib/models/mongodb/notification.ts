import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define interfaces
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  message: string
  type: string
  isRead: boolean
  link?: string
  createdAt: Date
  updatedAt: Date
}

// Define schema
const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true }, // course, webinar, message, system
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true },
)

// Create model
export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
