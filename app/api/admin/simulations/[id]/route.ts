import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Simulation from "@/lib/models/mongodb/simulation"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const simulation = await Simulation.findById(params.id)

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json({ simulation })
  })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()

    const simulation = await Simulation.findByIdAndUpdate(params.id, { ...data }, { new: true })

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json({ simulation })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const simulation = await Simulation.findByIdAndDelete(params.id)

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  })
}
