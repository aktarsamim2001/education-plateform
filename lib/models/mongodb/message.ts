import mongoose, { Schema, type Document, type Model } from "mongoose"

// Define interfaces
export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

// Define schema
const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Create model
export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)

// Conversation Schema
export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  lastMessage: mongoose.Types.ObjectId
  unreadCount: {
    userId: mongoose.Types.ObjectId
    count: number
  }[]
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCount: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
)

// Create model
export const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)
