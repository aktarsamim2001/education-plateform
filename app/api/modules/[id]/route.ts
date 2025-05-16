import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Module from "@/lib/models/mongodb/module"
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

    const module = await Module.findOne({
      _id: params.id,
      isPublished: true,
    })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

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

    // Check if module exists in progress
    const moduleIndex = progress.modules.findIndex((m) => m.moduleId.toString() === params.id)

    if (moduleIndex === -1) {
      progress.modules.push({
        moduleId: params.id,
        completed: false,
        timeSpent: 0,
      })
    }

    progress.lastActivity = new Date()
    await progress.save()

    return NextResponse.json({ module })
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { timeSpent, completed } = await req.json()

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

    // Update module progress
    const moduleIndex = progress.modules.findIndex((m) => m.moduleId.toString() === params.id)

    if (moduleIndex === -1) {
      progress.modules.push({
        moduleId: params.id,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        timeSpent: timeSpent || 0,
      })
    } else {
      progress.modules[moduleIndex].timeSpent += timeSpent || 0

      if (completed && !progress.modules[moduleIndex].completed) {
        progress.modules[moduleIndex].completed = true
        progress.modules[moduleIndex].completedAt = new Date()
      }
    }

    progress.lastActivity = new Date()
    await progress.save()

    return NextResponse.json({ success: true })
  })
}
