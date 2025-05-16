import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { BlogPost } from "@/lib/models/mongodb/blog"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const post = await BlogPost.findOneAndUpdate(
      { slug: params.slug, status: "published" },
      { $inc: { views: 1 } }, // Increment view count
      { new: true },
    )
      .populate("author", "firstName lastName avatar bio")
      .lean()

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const post = await BlogPost.findOne({ slug })

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postData = await req.json()

    // Update post
    const updatedPost = await BlogPost.findOneAndUpdate({ slug }, postData, { new: true })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const post = await BlogPost.findOne({ slug })

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete post
    await BlogPost.findOneAndDelete({ slug })

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
