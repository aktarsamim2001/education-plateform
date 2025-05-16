import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import { WebinarRegistration } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id

    // Get user data
    const user = await User.findById(userId)
      .select("enrolledCourses registeredWebinars completedLessons certificates")
      .lean()

    // Get course progress
    const courseProgress = await CourseProgress.find({ userId })
      .populate({
        path: "courseId",
        select: "title thumbnail lessons",
      })
      .sort({ lastAccessedAt: -1 })
      .lean()

    // Get upcoming webinars
    const upcomingWebinars = await WebinarRegistration.find({
      userId,
      status: "registered",
    })
      .populate({
        path: "webinarId",
        select: "title date thumbnail instructorId",
        populate: {
          path: "instructorId",
          select: "firstName lastName avatar",
        },
      })
      .sort({ "webinarId.date": 1 })
      .limit(3)
      .lean()

    // Calculate total hours learned
    let hoursLearned = 0
    for (const progress of courseProgress) {
      const course = await Course.findById(progress.courseId)
      for (const lessonId of progress.completedLessons) {
        const lesson = course.lessons.find((l) => l._id.toString() === lessonId.toString())
        if (lesson) {
          hoursLearned += lesson.duration / 60 // Convert minutes to hours
        }
      }
    }

    // Get recommended courses based on enrolled categories
    const enrolledCourses = await Course.find({ _id: { $in: user.enrolledCourses } }).select("category")
    const categories = enrolledCourses.map((course) => course.category)

    const recommendedCourses = await Course.find({
      _id: { $nin: user.enrolledCourses },
      category: { $in: categories },
      status: "published",
    })
      .sort({ rating: -1 })
      .limit(2)
      .populate("instructorId", "firstName lastName avatar")
      .lean()

    // Get recent activity
    const recentActivity = []

    // Add recent course progress
    const recentProgress = await CourseProgress.find({ userId })
      .sort({ lastAccessedAt: -1 })
      .limit(3)
      .populate({
        path: "courseId",
        select: "title thumbnail",
      })
      .lean()

    for (const progress of recentProgress) {
      recentActivity.push({
        type: "course_progress",
        title: "Continued Learning",
        description: progress.courseId.title,
        time: progress.lastAccessedAt,
        image: progress.courseId.thumbnail,
      })
    }

    // Add recent webinar registrations
    const recentRegistrations = await WebinarRegistration.find({ userId })
      .sort({ registeredAt: -1 })
      .limit(3)
      .populate({
        path: "webinarId",
        select: "title thumbnail",
      })
      .lean()

    for (const registration of recentRegistrations) {
      recentActivity.push({
        type: "webinar_registration",
        title: "Registered for Webinar",
        description: registration.webinarId.title,
        time: registration.registeredAt,
        image: registration.webinarId.thumbnail,
      })
    }

    // Sort by time
    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    // Prepare dashboard data
    const dashboardData = {
      stats: {
        enrolledCourses: user.enrolledCourses.length,
        webinarsAttended: user.registeredWebinars.length,
        hoursLearned: Math.round(hoursLearned * 10) / 10, // Round to 1 decimal place
        certificates: user.certificates.length,
      },
      courseProgress,
      upcomingWebinars,
      recommendedCourses,
      recentActivity: recentActivity.slice(0, 3), // Get only the 3 most recent activities
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching student dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
