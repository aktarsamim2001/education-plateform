import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const price = searchParams.get("price")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = { status: "published" }

    if (category) {
      query.category = category
    }

    if (level) {
      query.level = level
    }

    if (price) {
      if (price === "free") {
        query.price = 0
      } else if (price === "paid") {
        query.price = { $gt: 0 }
      } else if (price === "under-50") {
        query.price = { $gt: 0, $lte: 50 }
      } else if (price === "50-100") {
        query.price = { $gt: 50, $lte: 100 }
      } else if (price === "100-200") {
        query.price = { $gt: 100, $lte: 200 }
      } else if (price === "over-200") {
        query.price = { $gt: 200 }
      }
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Build sort
    let sortOptions = {}
    if (sort === "newest") {
      sortOptions = { createdAt: -1 }
    } else if (sort === "oldest") {
      sortOptions = { createdAt: 1 }
    } else if (sort === "price-low") {
      sortOptions = { price: 1 }
    } else if (sort === "price-high") {
      sortOptions = { price: -1 }
    } else if (sort === "rating") {
      sortOptions = { rating: -1 }
    } else if (sort === "popularity") {
      sortOptions = { students: -1 }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query with pagination
    const courses = await Course.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("instructorId", "firstName lastName avatar")
      .lean()

    // Get total count for pagination
    const total = await Course.countDocuments(query)

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "instructor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseData = await request.json()

    await dbConnect()

    // Create slug from title
    const slug = courseData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug })
    if (existingCourse) {
      return NextResponse.json({ error: "Course with similar title already exists" }, { status: 409 })
    }

    // Create new course
    const course = await Course.create({
      ...courseData,
      slug,
      instructorId: session.user.id,
      status: session.user.role === "admin" ? "published" : "pending", // Auto-publish if admin
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
