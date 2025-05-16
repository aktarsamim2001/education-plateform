import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db-connect"
import { BlogPost } from "@/lib/models/mongodb/blog"
import { User } from "@/lib/models/mongodb/user"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const blogs = await BlogPost.find({ author: user._id }).sort({ createdAt: -1 })

    return NextResponse.json({ blogs })
  } catch (error) {
    console.error("Error fetching instructor blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Check if slug already exists
    const existingBlog = await BlogPost.findOne({ slug })
    if (existingBlog) {
      return NextResponse.json({ error: "Blog post with similar title already exists" }, { status: 409 })
    }

    // Create new blog post
    const blog = new BlogPost({
      ...data,
      slug,
      author: user._id,
      status: data.status || "draft", // Default to draft if not specified
      publishedAt: data.status === "published" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await blog.save()

    return NextResponse.json({ blog }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
