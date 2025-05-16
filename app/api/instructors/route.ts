import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const expertise = searchParams.get("expertise")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "popular"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "9")

    await dbConnect()

    // Build query
    const query: any = { role: "instructor" }

    if (expertise && expertise !== "all") {
      query.expertise = expertise
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort
    let sortOptions = {}
    if (sort === "popular") {
      sortOptions = { students: -1 }
    } else if (sort === "rating") {
      sortOptions = { rating: -1 }
    } else if (sort === "courses") {
      sortOptions = { "courses.length": -1 }
    } else if (sort === "students") {
      sortOptions = { students: -1 }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const instructors = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select("firstName lastName avatar bio expertise rating reviews students courses")

    const total = await User.countDocuments(query)
    const pages = Math.ceil(total / limit)

    return NextResponse.json({ instructors, total, pages })
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
