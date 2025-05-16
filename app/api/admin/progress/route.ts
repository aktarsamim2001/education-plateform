import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Progress from "@/lib/models/mongodb/progress"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")

    let query = {}
    if (userId) {
      query = { userId }
    }

    const progress = await Progress.find(query)
      .populate("userId", "name email")
      .populate("modules.moduleId", "title")
      .populate("quizzes.quizId", "title")
      .populate("simulations.simulationId", "title")

    return NextResponse.json({ progress })
  })
}
