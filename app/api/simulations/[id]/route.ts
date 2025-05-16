import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Simulation from "@/lib/models/mongodb/simulation"
import Progress from "@/lib/models/mongodb/progress"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const simulation = await Simulation.findOne({
      _id: params.id,
      isPublished: true,
    })

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json({ simulation })
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { finalCapital, transactions, completed } = await req.json()

    // Update user progress
    let progress = await Progress.findOne({ userId: session.user.id })

    if (!progress) {
      progress = new Progress({
        userId: session.user.id,
        modules: [],
        quizzes: [],
        simulations: [],
      })
    }

    // Update simulation progress
    const simulationIndex = progress.simulations.findIndex((s) => s.simulationId.toString() === params.id)

    if (simulationIndex === -1) {
      progress.simulations.push({
        simulationId: params.id,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        finalCapital,
        transactions,
      })
    } else {
      // Only update if capital is better
      if (finalCapital > progress.simulations[simulationIndex].finalCapital) {
        progress.simulations[simulationIndex].finalCapital = finalCapital
        progress.simulations[simulationIndex].transactions = transactions
      }

      if (completed && !progress.simulations[simulationIndex].completed) {
        progress.simulations[simulationIndex].completed = true
        progress.simulations[simulationIndex].completedAt = new Date()
      }
    }

    progress.lastActivity = new Date()
    await progress.save()

    return NextResponse.json({ success: true })
  })
}
