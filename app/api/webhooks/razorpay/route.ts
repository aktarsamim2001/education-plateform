import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import { Notification } from "@/lib/models/mongodb/notification"

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const body = await request.text()

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Process webhook event
    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      await dbConnect()

      const payment = event.payload.payment.entity
      const orderId = payment.order_id

      // Fetch order details
      const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
          ).toString("base64")}`,
        },
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order details")
      }

      const order = await orderResponse.json()

      // Process based on order notes
      if (order.notes && order.notes.productId && order.notes.productType && order.notes.userId) {
        const { productId, productType, userId, productName } = order.notes

        if (productType === "course") {
          // Update user's enrolled courses
          await User.findByIdAndUpdate(userId, {
            $addToSet: { enrolledCourses: productId },
          })

          // Update course's student count
          await Course.findByIdAndUpdate(productId, {
            $inc: { students: 1 },
          })

          // Create course progress
          await CourseProgress.create({
            userId,
            courseId: productId,
            progress: 0,
          })

          // Create notification
          await Notification.create({
            userId,
            title: "Course Enrollment Successful",
            message: `You have successfully enrolled in ${productName}`,
            type: "course",
            link: `/student/courses/${productId}`,
          })
        } else if (productType === "webinar") {
          // Create webinar registration
          await WebinarRegistration.create({
            webinarId: productId,
            userId,
            paymentId: payment.id,
            paymentStatus: "completed",
          })

          // Update user's registered webinars
          await User.findByIdAndUpdate(userId, {
            $addToSet: { registeredWebinars: productId },
          })

          // Update webinar's attendee count
          await Webinar.findByIdAndUpdate(productId, {
            $inc: { registeredAttendees: 1 },
          })

          // Create notification
          await Notification.create({
            userId,
            title: "Webinar Registration Successful",
            message: `You have successfully registered for ${productName}`,
            type: "webinar",
            link: `/student/webinars/${productId}`,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
