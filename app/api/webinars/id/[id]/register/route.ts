import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import User from "@/lib/models/mongodb/user"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { createRazorpayOrder } from "@/lib/services/razorpay-service"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findById(id)

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is already registered
    const existingRegistration = await WebinarRegistration.findOne({
      webinarId: id,
      userId: session.user.id,
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this webinar" }, { status: 409 })
    }

    // If webinar is free, register directly
    if (webinar.isFree || webinar.price === 0) {
      // Create registration
      await WebinarRegistration.create({
        webinarId: id,
        userId: session.user.id,
        status: "registered",
      })

      // Update user's registered webinars
      await User.findByIdAndUpdate(session.user.id, {
        $push: { registeredWebinars: id },
      })

      // Update webinar's attendee count
      await Webinar.findByIdAndUpdate(id, {
        $inc: { attendees: 1 },
      })

      return NextResponse.json({ message: "Registered successfully" })
    } else {
      // For paid webinars, create a Razorpay order
      const order = await createRazorpayOrder({
        amount: webinar.price * 100,
        currency: "INR",
        receipt: `webinar_${id}_${session.user.id}`,
        notes: {
          webinarId: id,
          userId: session.user.id,
          type: "webinar",
        },
      })

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      })
    }
  } catch (error) {
    console.error("Error registering for webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
