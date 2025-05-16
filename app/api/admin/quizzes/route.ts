import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Quiz from "@/lib/models/mongodb/quiz"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const quizzes = await Quiz.find({}).populate("moduleId", "title")

    return NextResponse.json({ quizzes })
  })
}

export async function POST(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()

    const quiz = new Quiz({
      ...data,
      createdBy: session.user.id,
    })

    await quiz.save()

    return NextResponse.json({ quiz }, { status: 201 })
  })
}
