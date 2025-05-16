import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Quiz from "@/lib/models/mongodb/quiz"
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

    const quiz = await Quiz.findOne({
      _id: params.id,
      isPublished: true,
    }).select("-questions.correctAnswer -questions.explanation")

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ quiz })
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { answers, timeSpent } = await req.json()

    // Get quiz with correct answers
    const quiz = await Quiz.findById(params.id)

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Calculate score
    let correctAnswers = 0
    const results = quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer
      if (isCorrect) correctAnswers++

      return {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      }
    })

    const score = (correctAnswers / quiz.questions.length) * 100
    const passed = score >= quiz.passingScore

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

    // Update quiz progress
    const quizIndex = progress.quizzes.findIndex((q) => q.quizId.toString() === params.id)

    if (quizIndex === -1) {
      progress.quizzes.push({
        quizId: params.id,
        score,
        answers,
        completed: true,
        completedAt: new Date(),
        timeSpent: timeSpent || 0,
      })
    } else {
      // Only update if score is better
      if (score > progress.quizzes[quizIndex].score) {
        progress.quizzes[quizIndex].score = score
        progress.quizzes[quizIndex].answers = answers
      }
      progress.quizzes[quizIndex].completed = true
      progress.quizzes[quizIndex].completedAt = new Date()
      progress.quizzes[quizIndex].timeSpent += timeSpent || 0
    }

    progress.lastActivity = new Date()
    await progress.save()

    return NextResponse.json({
      score,
      passed,
      results,
    })
  })
}
