import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Quiz from "@/lib/models/mongodb/quiz"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const quiz = await Quiz.findById(params.id).populate("moduleId", "title")

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ quiz })
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

    const quiz = await Quiz.findByIdAndUpdate(params.id, { ...data }, { new: true })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ quiz })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const quiz = await Quiz.findByIdAndDelete(params.id)

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  })
}
