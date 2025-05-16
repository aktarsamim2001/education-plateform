import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"
import Progress from "@/lib/models/mongodb/progress"
import { CourseProgress } from "@/lib/models/mongodb/course"

export async function POST(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id
    const { type, data } = await req.json()

    // Update progress based on the type of activity
    switch (type) {
      case "module_complete": {
        const { moduleId, timeSpent } = data

        // Update module progress
        await Progress.findOneAndUpdate(
          { userId, "modules.moduleId": moduleId },
          {
            $set: {
              "modules.$.completed": true,
              "modules.$.completedAt": new Date(),
              "modules.$.timeSpent": timeSpent,
              lastActivity: new Date(),
            },
          },
          { upsert: true },
        )

        // If module doesn't exist, add it
        await Progress.findOneAndUpdate(
          { userId, "modules.moduleId": { $ne: moduleId } },
          {
            $push: {
              modules: {
                moduleId,
                completed: true,
                completedAt: new Date(),
                timeSpent: timeSpent,
              },
            },
            $set: { lastActivity: new Date() },
          },
          { upsert: true },
        )

        break
      }

      case "quiz_complete": {
        const { quizId, score, answers, timeSpent } = data

        // Update quiz progress
        await Progress.findOneAndUpdate(
          { userId, "quizzes.quizId": quizId },
          {
            $set: {
              "quizzes.$.score": score,
              "quizzes.$.answers": answers,
              "quizzes.$.completed": true,
              "quizzes.$.completedAt": new Date(),
              "quizzes.$.timeSpent": timeSpent,
              lastActivity: new Date(),
            },
          },
          { upsert: true },
        )

        // If quiz doesn't exist, add it
        await Progress.findOneAndUpdate(
          { userId, "quizzes.quizId": { $ne: quizId } },
          {
            $push: {
              quizzes: {
                quizId,
                score,
                answers,
                completed: true,
                completedAt: new Date(),
                timeSpent,
              },
            },
            $set: { lastActivity: new Date() },
          },
          { upsert: true },
        )

        break
      }

      case "simulation_complete": {
        const { simulationId, finalCapital, transactions } = data

        // Update simulation progress
        await Progress.findOneAndUpdate(
          { userId, "simulations.simulationId": simulationId },
          {
            $set: {
              "simulations.$.completed": true,
              "simulations.$.completedAt": new Date(),
              "simulations.$.finalCapital": finalCapital,
              "simulations.$.transactions": transactions,
              lastActivity: new Date(),
            },
          },
          { upsert: true },
        )

        // If simulation doesn't exist, add it
        await Progress.findOneAndUpdate(
          { userId, "simulations.simulationId": { $ne: simulationId } },
          {
            $push: {
              simulations: {
                simulationId,
                completed: true,
                completedAt: new Date(),
                finalCapital,
                transactions,
              },
            },
            $set: { lastActivity: new Date() },
          },
          { upsert: true },
        )

        break
      }

      case "lesson_complete": {
        const { courseId, lessonId } = data

        // Update course progress
        await CourseProgress.findOneAndUpdate(
          { userId, courseId },
          {
            $addToSet: { completedLessons: lessonId },
            $set: { lastAccessedAt: new Date() },
          },
          { upsert: true },
        )

        // Calculate and update progress percentage
        const courseProgress = await CourseProgress.findOne({ userId, courseId })

        if (courseProgress) {
          // In a real implementation, you would fetch the total number of lessons
          // from the course and calculate the progress percentage
          const totalLessons = 10 // Example value
          const completedLessons = courseProgress.completedLessons.length
          const progress = Math.round((completedLessons / totalLessons) * 100)

          await CourseProgress.findOneAndUpdate({ userId, courseId }, { $set: { progress } })
        }

        // Update last activity
        await Progress.findOneAndUpdate({ userId }, { $set: { lastActivity: new Date() } }, { upsert: true })

        break
      }

      case "course_access": {
        const { courseId } = data

        // Update last accessed time
        await CourseProgress.findOneAndUpdate(
          { userId, courseId },
          { $set: { lastAccessedAt: new Date() } },
          { upsert: true },
        )

        // Update last activity
        await Progress.findOneAndUpdate({ userId }, { $set: { lastActivity: new Date() } }, { upsert: true })

        break
      }

      default:
        return NextResponse.json({ error: "Invalid progress update type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  })
}
