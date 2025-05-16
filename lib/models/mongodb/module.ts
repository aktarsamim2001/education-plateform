import mongoose, { Schema, type Document } from "mongoose"

export interface IModule extends Document {
  title: string
  description: string
  content: string
  videoUrl?: string
  attachments?: string[]
  order: number
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  createdBy: mongoose.Types.ObjectId
}

const ModuleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    attachments: [{ type: String }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema)
