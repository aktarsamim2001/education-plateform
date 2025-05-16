import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import User from "@/lib/models/mongodb/user"
import { createRazorpayOrder } from "@/lib/services/razorpay-service"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findOne({ slug: params.slug })

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if webinar is full
    if (webinar.registeredAttendees >= webinar.maxAttendees) {
      return NextResponse.json({ error: "Webinar is full" }, { status: 409 })
    }

    // Check if user is already registered
    const existingRegistration = await WebinarRegistration.findOne({
      webinarId: webinar._id,
      userId: session.user.id,
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this webinar" }, { status: 409 })
    }

    // If webinar is free, register directly
    if (webinar.price === 0) {
      // Create registration
      await WebinarRegistration.create({
        webinarId: webinar._id,
        userId: session.user.id,
        paymentStatus: "completed",
      })

      // Update user's registered webinars
      await User.findByIdAndUpdate(session.user.id, {
        $push: { registeredWebinars: webinar._id },
      })

      // Update webinar's attendee count
      await Webinar.findByIdAndUpdate(webinar._id, {
        $inc: { registeredAttendees: 1 },
      })

      return NextResponse.json({ message: "Registered successfully" })
    } else {
      // For paid webinars, create a Razorpay order
      const finalPrice = webinar.discountPrice || webinar.price

      const order = await createRazorpayOrder({
        amount: finalPrice * 100, // in smallest currency unit (paise)
        currency: "INR",
        receipt: `webinar_${webinar._id}_${session.user.id}`,
        notes: {
          productId: webinar._id.toString(),
          userId: session.user.id,
          productType: "webinar",
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
