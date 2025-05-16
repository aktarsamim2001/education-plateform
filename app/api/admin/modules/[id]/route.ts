import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Module from "@/lib/models/mongodb/module"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const module = await Module.findById(params.id)

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({ module })
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

    const module = await Module.findByIdAndUpdate(params.id, { ...data }, { new: true })

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({ module })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const module = await Module.findByIdAndDelete(params.id)

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  })
}
