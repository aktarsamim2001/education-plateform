import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "upcoming"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (level) {
      query.level = level
    }

    if (status) {
      query.status = status
    } else {
      // By default, show upcoming and live webinars
      query.status = { $in: ["upcoming", "live"] }
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Build sort
    let sortOptions = {}
    if (sort === "upcoming") {
      sortOptions = { startDate: 1 }
    } else if (sort === "popular") {
      sortOptions = { registeredAttendees: -1 }
    } else if (sort === "price-low") {
      sortOptions = { price: 1 }
    } else if (sort === "price-high") {
      sortOptions = { price: -1 }
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query with pagination
    const webinars = await Webinar.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("instructorId", "firstName lastName avatar")
      .lean()

    // Get total count for pagination
    const total = await Webinar.countDocuments(query)

    return NextResponse.json({
      webinars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching webinars:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "instructor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const webinarData = await request.json()

    await dbConnect()

    // Create slug from title
    const slug = webinarData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Check if slug already exists
    const existingWebinar = await Webinar.findOne({ slug })
    if (existingWebinar) {
      return NextResponse.json({ error: "Webinar with similar title already exists" }, { status: 409 })
    }

    // Create new webinar
    const webinar = await Webinar.create({
      ...webinarData,
      slug,
      instructorId: session.user.id,
    })

    return NextResponse.json({ webinar }, { status: 201 })
  } catch (error) {
    console.error("Error creating webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
