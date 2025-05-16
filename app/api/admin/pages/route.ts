import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import mongoose from "mongoose"

// Define Page schema if not already defined elsewhere
let Page
try {
  Page = mongoose.model("Page")
} catch {
  const PageSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
      },
      content: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["standard", "landing", "custom"],
        default: "standard",
      },
      status: {
        type: String,
        enum: ["published", "draft", "archived"],
        default: "draft",
      },
      seo: {
        title: String,
        description: String,
        keywords: [String],
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    },
  )

  Page = mongoose.model("Page", PageSchema)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get all pages
    const pages = await Page.find({}).sort({ updatedAt: -1 }).lean()

    // Format the data for the frontend
    const formattedPages = pages.map((page) => ({
      id: page._id.toString(),
      title: page.title,
      slug: page.slug,
      type: page.type,
      status: page.status,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }))

    return NextResponse.json({ pages: formattedPages })
  } catch (error) {
    console.error("Error fetching pages for admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const pageData = await req.json()

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: pageData.slug })
    if (existingPage) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 400 })
    }

    // Add creator info
    pageData.createdBy = session.user.id

    // Create new page
    const newPage = new Page(pageData)
    await newPage.save()

    return NextResponse.json(
      {
        message: "Page created successfully",
        page: newPage,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
