import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"
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

    const webinars = await Webinar.find({ instructor: user._id }).sort({ date: 1 })

    return NextResponse.json({ webinars })
  } catch (error) {
    console.error("Error fetching instructor webinars:", error)
    return NextResponse.json({ error: "Failed to fetch webinars" }, { status: 500 })
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
    const existingWebinar = await Webinar.findOne({ slug })
    if (existingWebinar) {
      return NextResponse.json({ error: "Webinar with similar title already exists" }, { status: 409 })
    }

    // Create new webinar
    const webinar = new Webinar({
      ...data,
      slug,
      instructor: user._id,
      status: data.status || "scheduled", // Default to scheduled if not specified
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await webinar.save()

    return NextResponse.json({ webinar }, { status: 201 })
  } catch (error) {
    console.error("Error creating webinar:", error)
    return NextResponse.json({ error: "Failed to create webinar" }, { status: 500 })
  }
}
