import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Progress from "@/lib/models/mongodb/progress"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const progress = await Progress.findById(params.id)
      .populate("userId", "name email")
      .populate("modules.moduleId", "title")
      .populate("quizzes.quizId", "title")
      .populate("simulations.simulationId", "title")

    if (!progress) {
      return NextResponse.json({ error: "Progress not found" }, { status: 404 })
    }

    return NextResponse.json({ progress })
  })
}
