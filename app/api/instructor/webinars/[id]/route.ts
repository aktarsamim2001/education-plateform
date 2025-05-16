import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"
import { User } from "@/lib/models/mongodb/user"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const webinar = await Webinar.findOne({
      _id: params.id,
      instructorId: user._id,
    })

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    return NextResponse.json({ webinar })
  } catch (error) {
    console.error("Error fetching webinar:", error)
    return NextResponse.json({ error: "Failed to fetch webinar" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Generate slug from title if title is updated
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
    }

    // Parse date and time
    if (data.date && data.time) {
      data.date = new Date(`${data.date}T${data.time}`)
    } else if (data.dateTime) {
      data.dateTime = new Date(data.dateTime)
      data.date = data.dateTime
    }
}
\
