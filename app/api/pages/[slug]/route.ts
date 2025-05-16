import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Page } from "@/lib/models/mongodb/page"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const page = await Page.findOne({ slug: params.slug }).lean()

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: page })
  } catch (error) {
    console.error("Error fetching page:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await request.json()

    // Check if slug is being changed and if new slug already exists
    if (data.slug && data.slug !== params.slug) {
      const existingPage = await Page.findOne({ slug: data.slug })
      if (existingPage) {
        return NextResponse.json({ success: false, error: "A page with this slug already exists" }, { status: 400 })
      }
    }

    const updatedPage = await Page.findOneAndUpdate(
      { slug: params.slug },
      { ...data },
      { new: true, runValidators: true },
    )

    if (!updatedPage) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedPage })
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ success: false, error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const deletedPage = await Page.findOneAndDelete({ slug: params.slug })

    if (!deletedPage) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json({ success: false, error: "Failed to delete page" }, { status: 500 })
  }
}
