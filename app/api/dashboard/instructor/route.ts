import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course, CourseReview } from "@/lib/models/mongodb/course"
import { Webinar, WebinarRegistration } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const instructorId = session.user.id

    // Get instructor data
    const instructor = await User.findById(instructorId).select("courses webinars rating reviews students").lean()

    // Get instructor's courses
    const courses = await Course.find({ instructorId }).sort({ createdAt: -1 }).lean()

    // Calculate total revenue
    let totalRevenue = 0
    for (const course of courses) {
      totalRevenue += course.price * course.students
    }

    // Get upcoming webinars
    const upcomingWebinars = await Webinar.find({
      instructorId,
      status: "scheduled",
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3)
      .lean()

    // Get webinar registrations
    for (const webinar of upcomingWebinars) {
      const registrations = await WebinarRegistration.countDocuments({
        webinarId: webinar._id,
        status: "registered",
      })
      webinar.registrations = registrations
    }

    // Get latest reviews
    const latestReviews = await CourseReview.find({
      courseId: { $in: instructor.courses },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("userId", "firstName lastName avatar")
      .populate("courseId", "title")
      .lean()

    // Get recent activity
    const recentActivity = []

    // Add new enrollments
    const courses3Days = await Course.find({
      instructorId,
      updatedAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // Last 3 days
    }).lean()

    for (const course of courses3Days) {
      recentActivity.push({
        type: "enrollment",
        title: "New Course Enrollment",
        description: `New student enrolled in '${course.title}'`,
        time: course.updatedAt,
        userAvatar: "/placeholder.svg?height=48&width=48",
      })
    }

    // Add new reviews
    const reviews3Days = await CourseReview.find({
      courseId: { $in: instructor.courses },
      createdAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // Last 3 days
    })
      .populate("userId", "firstName lastName avatar")
      .populate("courseId", "title")
      .lean()

    for (const review of reviews3Days) {
      recentActivity.push({
        type: "review",
        title: "New Review",
        description: `${review.userId.firstName} ${review.userId.lastName} left a ${review.rating}-star review on '${review.courseId.title}'`,
        time: review.createdAt,
        userAvatar: review.userId.avatar || "/placeholder.svg?height=48&width=48",
      })
    }

    // Add webinar registrations
    const registrations3Days = await WebinarRegistration.find({
      webinarId: { $in: instructor.webinars },
      registeredAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // Last 3 days
    })
      .populate("webinarId", "title")
      .lean()

    for (const registration of registrations3Days) {
      recentActivity.push({
        type: "webinar_registration",
        title: "Webinar Registration",
        description: `New student registered for '${registration.webinarId.title}' webinar`,
        time: registration.registeredAt,
        userAvatar: "/placeholder.svg?height=48&width=48",
      })
    }

    // Sort by time
    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    // Prepare dashboard data
    const dashboardData = {
      stats: {
        totalCourses: instructor.courses.length,
        totalStudents: instructor.students,
        totalWebinars: instructor.webinars.length,
        totalRevenue,
        averageRating: instructor.rating,
      },
      courses,
      upcomingWebinars,
      latestReviews,
      recentActivity: recentActivity.slice(0, 5), // Get only the 5 most recent activities
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching instructor dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
