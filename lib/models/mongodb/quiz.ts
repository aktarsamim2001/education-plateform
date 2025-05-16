import mongoose, { Schema, type Document } from "mongoose"

export interface IQuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface IQuiz extends Document {
  title: string
  description: string
  questions: IQuizQuestion[]
  moduleId?: mongoose.Types.ObjectId
  timeLimit?: number
  passingScore: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const QuizSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        explanation: { type: String, required: true },
      },
    ],
    moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
    timeLimit: { type: Number }, // in minutes
    passingScore: { type: Number, default: 70 }, // percentage
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)
