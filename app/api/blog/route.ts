import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { BlogPost } from "@/lib/models/mongodb/blog"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = { status: "published" }

    if (category && category !== "all") {
      query.category = category
    }

    if (tag) {
      query.tags = tag
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort
    let sortOptions = {}
    if (sort === "newest") {
      sortOptions = { publishedAt: -1 }
    } else if (sort === "oldest") {
      sortOptions = { publishedAt: 1 }
    } else if (sort === "popular") {
      sortOptions = { views: -1 }
    } else if (sort === "trending") {
      sortOptions = { likes: -1 }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query with pagination
    const posts = await BlogPost.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("author", "firstName lastName avatar")
      .lean()

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "instructor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postData = await request.json()

    await dbConnect()

    // Create slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ error: "Post with similar title already exists" }, { status: 409 })
    }

    // Create new post
    const post = await BlogPost.create({
      ...postData,
      slug,
      author: session.user.id,
      publishedAt: postData.status === "published" ? new Date() : null,
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
