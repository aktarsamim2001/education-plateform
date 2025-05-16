import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import User from "@/lib/models/mongodb/user"
import { createRazorpayOrder } from "@/lib/services/razorpay-service"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const course = await Course.findOne({ slug: params.slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const user = await User.findById(session.user.id)

    // Check if user is already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    // If course is free, enroll directly
    if (course.price === 0) {
      // Update user's enrolled courses
      await User.findByIdAndUpdate(session.user.id, {
        $push: { enrolledCourses: course._id },
      })

      // Update course's student count
      await Course.findByIdAndUpdate(course._id, {
        $inc: { students: 1 },
      })

      // Create course progress
      await CourseProgress.create({
        userId: session.user.id,
        courseId: course._id,
        progress: 0,
      })

      return NextResponse.json({ message: "Enrolled successfully" })
    } else {
      // For paid courses, create a Razorpay order
      const finalPrice = course.discountPrice || course.price

      const order = await createRazorpayOrder({
        amount: finalPrice * 100, // in smallest currency unit (paise)
        currency: "INR",
        receipt: `course_${course._id}_${session.user.id}`,
        notes: {
          productId: course._id.toString(),
          userId: session.user.id,
          productType: "course",
        },
      })

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      })
    }
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
