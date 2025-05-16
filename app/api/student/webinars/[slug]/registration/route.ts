import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findOne({ slug })

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is registered for this webinar
    const registration = await WebinarRegistration.findOne({
      webinarId: webinar._id,
      userId: session.user.id,
    })

    if (!registration) {
      return NextResponse.json({ error: "Not registered for this webinar" }, { status: 404 })
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error("Error checking webinar registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
