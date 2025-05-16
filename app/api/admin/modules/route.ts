import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Module from "@/lib/models/mongodb/module"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const modules = await Module.find({}).sort({ order: 1 })

    return NextResponse.json({ modules })
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

    const module = new Module({
      ...data,
      createdBy: session.user.id,
    })

    await module.save()

    return NextResponse.json({ module }, { status: 201 })
  })
}
