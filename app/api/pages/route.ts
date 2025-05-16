import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Page } from "@/lib/models/mongodb/page"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "published"

    const pages = await Page.find({ status }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ success: true, data: pages })
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await request.json()

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: data.slug })
    if (existingPage) {
      return NextResponse.json({ success: false, error: "A page with this slug already exists" }, { status: 400 })
    }

    const page = await Page.create({
      ...data,
      author: session.user.id,
    })

    return NextResponse.json({ success: true, data: page }, { status: 201 })
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ success: false, error: "Failed to create page" }, { status: 500 })
  }
}
