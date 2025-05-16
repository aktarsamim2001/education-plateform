import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { BlogPost } from "@/lib/models/mongodb/blog"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get all blog posts with author details
    const posts = await BlogPost.find({}).populate("authorId", "firstName lastName").sort({ createdAt: -1 }).lean()

    // Format the data for the frontend
    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: post.image,
      category: post.category,
      tags: post.tags,
      status: post.status,
      views: post.views,
      likes: post.likes,
      author: post.authorId ? `${post.authorId.firstName} ${post.authorId.lastName}` : "Unknown",
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Error fetching blog posts for admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
