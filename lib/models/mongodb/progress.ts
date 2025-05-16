import mongoose, { Schema, type Document } from "mongoose"

export interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId
  completed: boolean
  completedAt?: Date
  timeSpent: number // in seconds
}

export interface IQuizAttempt {
  quizId: mongoose.Types.ObjectId
  score: number
  answers: number[]
  completed: boolean
  completedAt?: Date
  timeSpent: number // in seconds
}

export interface ISimulationProgress {
  simulationId: mongoose.Types.ObjectId
  completed: boolean
  completedAt?: Date
  finalCapital: number
  transactions: {
    date: Date
    type: "buy" | "sell"
    symbol: string
    quantity: number
    price: number
  }[]
}

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId
  modules: IModuleProgress[]
  quizzes: IQuizAttempt[]
  simulations: ISimulationProgress[]
  lastActivity: Date
}

const ProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modules: [
      {
        moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        timeSpent: { type: Number, default: 0 }, // in seconds
      },
    ],
    quizzes: [
      {
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, default: 0 },
        answers: [{ type: Number }],
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        timeSpent: { type: Number, default: 0 }, // in seconds
      },
    ],
    simulations: [
      {
        simulationId: { type: Schema.Types.ObjectId, ref: "Simulation", required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        finalCapital: { type: Number },
        transactions: [
          {
            date: { type: Date, required: true },
            type: { type: String, enum: ["buy", "sell"], required: true },
            symbol: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.models.Progress || mongoose.model<IProgress>("Progress", ProgressSchema)
