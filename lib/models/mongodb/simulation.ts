import mongoose, { Schema, type Document } from "mongoose"

export interface IStockData {
  symbol: string
  name: string
  initialPrice: number
  priceHistory: { date: Date; price: number }[]
  news: { date: Date; headline: string; impact: number }[]
}

export interface ISimulation extends Document {
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number // in days
  initialCapital: number
  stocks: IStockData[]
  objectives: string[]
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
}

const SimulationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: Number, required: true }, // in days
    initialCapital: { type: Number, required: true },
    stocks: [
      {
        symbol: { type: String, required: true },
        name: { type: String, required: true },
        initialPrice: { type: Number, required: true },
        priceHistory: [
          {
            date: { type: Date },
            price: { type: Number },
          },
        ],
        news: [
          {
            date: { type: Date },
            headline: { type: String },
            impact: { type: Number }, // -10 to 10, negative is bad news
          },
        ],
      },
    ],
    objectives: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Simulation || mongoose.model<ISimulation>("Simulation", SimulationSchema)
