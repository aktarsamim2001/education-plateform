import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db-connect"
import { BlogModel } from "@/lib/models/mongodb/blog"
import { UserModel } from "@/lib/models/mongodb/user"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await UserModel.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const blog = await BlogModel.findOne({
      _id: params.id,
      author: user._id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await UserModel.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Check if blog exists and belongs to the instructor
    const existingBlog = await BlogModel.findOne({
      _id: params.id,
      author: user._id,
    })

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Update publishedAt if status is changing to published
    if (data.status === "published" && existingBlog.status !== "published") {
      data.publishedAt = new Date()
    }

    // Update the blog
    const updatedBlog = await BlogModel.findByIdAndUpdate(params.id, { ...data }, { new: true })

    return NextResponse.json({ blog: updatedBlog })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await UserModel.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if blog exists and belongs to the instructor
    const blog = await BlogModel.findOne({
      _id: params.id,
      author: user._id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Delete the blog
    await BlogModel.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
