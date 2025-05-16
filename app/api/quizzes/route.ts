import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Quiz from "@/lib/models/mongodb/quiz"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const moduleId = req.nextUrl.searchParams.get("moduleId")

    const query: any = { isPublished: true }
    if (moduleId) {
      query.moduleId = moduleId
    }

    const quizzes = await Quiz.find(query).select("-questions.correctAnswer -questions.explanation")

    return NextResponse.json({ quizzes })
  })
}
