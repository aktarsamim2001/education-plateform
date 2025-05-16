import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import { verifyRazorpayPayment, fetchRazorpayOrder } from "@/lib/services/razorpay-service"
import { Notification } from "@/lib/models/mongodb/notification"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification details" }, { status: 400 })
    }

    // Verify signature
    const isValid = verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Get order details
    const order = await fetchRazorpayOrder(razorpay_order_id)

    // Process enrollment based on order notes
    if (order.notes && order.notes.productId && order.notes.productType) {
      await dbConnect()

      const { productId, productType, productName } = order.notes

      // Update user's enrollments
      if (productType === "course") {
        // Update user's enrolled courses
        await User.findByIdAndUpdate(session.user.id, {
          $addToSet: { enrolledCourses: productId },
        })

        // Update course's student count
        await Course.findByIdAndUpdate(productId, {
          $inc: { students: 1 },
        })

        // Create course progress
        await CourseProgress.create({
          userId: session.user.id,
          courseId: productId,
          progress: 0,
        })

        // Create notification
        await Notification.create({
          userId: session.user.id,
          title: "Course Enrollment Successful",
          message: `You have successfully enrolled in ${productName}`,
          type: "course",
          link: `/student/courses/${productId}`,
        })
      } else if (productType === "webinar") {
        // Create webinar registration
        await WebinarRegistration.create({
          webinarId: productId,
          userId: session.user.id,
          paymentId: razorpay_payment_id,
          paymentStatus: "completed",
        })

        // Update user's registered webinars
        await User.findByIdAndUpdate(session.user.id, {
          $addToSet: { registeredWebinars: productId },
        })

        // Update webinar's attendee count
        await Webinar.findByIdAndUpdate(productId, {
          $inc: { registeredAttendees: 1 },
        })

        // Create notification
        await Notification.create({
          userId: session.user.id,
          title: "Webinar Registration Successful",
          message: `You have successfully registered for ${productName}`,
          type: "webinar",
          link: `/student/webinars/${productId}`,
        })
      }
    }

    return NextResponse.json({ success: true, orderId: razorpay_order_id, paymentId: razorpay_payment_id })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
