import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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

    const difficulty = req.nextUrl.searchParams.get("difficulty")

    const query: any = { isPublished: true }
    if (difficulty) {
      query.difficulty = difficulty
    }

    const simulations = await Simulation.find(query)

    return NextResponse.json({ simulations })
  })
}
