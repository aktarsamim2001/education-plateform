import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Progress from "@/lib/models/mongodb/progress"
import Module from "@/lib/models/mongodb/module"
import Quiz from "@/lib/models/mongodb/quiz"
import Simulation from "@/lib/models/mongodb/simulation"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get user progress
    let progress = await Progress.findOne({ userId: session.user.id })
      .populate("modules.moduleId", "title")
      .populate("quizzes.quizId", "title")
      .populate("simulations.simulationId", "title")

    if (!progress) {
      progress = new Progress({
        userId: session.user.id,
        modules: [],
        quizzes: [],
        simulations: [],
      })
      await progress.save()
    }

    // Get total counts for completion percentage
    const totalModules = await Module.countDocuments({ isPublished: true })
    const totalQuizzes = await Quiz.countDocuments({ isPublished: true })
    const totalSimulations = await Simulation.countDocuments({ isPublished: true })

    // Calculate completion percentages
    const completedModules = progress.modules.filter((m) => m.completed).length
    const completedQuizzes = progress.quizzes.filter((q) => q.completed).length
    const completedSimulations = progress.simulations.filter((s) => s.completed).length

    const moduleCompletion = totalModules > 0 ? (completedModules / totalModules) * 100 : 0
    const quizCompletion = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0
    const simulationCompletion = totalSimulations > 0 ? (completedSimulations / totalSimulations) * 100 : 0

    // Calculate overall progress
    const overallCompletion = (moduleCompletion + quizCompletion + simulationCompletion) / 3

    return NextResponse.json({
      progress,
      stats: {
        modules: {
          total: totalModules,
          completed: completedModules,
          percentage: moduleCompletion,
        },
        quizzes: {
          total: totalQuizzes,
          completed: completedQuizzes,
          percentage: quizCompletion,
        },
        simulations: {
          total: totalSimulations,
          completed: completedSimulations,
          percentage: simulationCompletion,
        },
        overall: overallCompletion,
      },
    })
  })
}
