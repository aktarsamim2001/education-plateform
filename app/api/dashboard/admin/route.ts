import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course } from "@/lib/models/mongodb/course"
import { Webinar } from "@/lib/models/mongodb/webinar"
import { BlogPost } from "@/lib/models/mongodb/blog"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get total users count
    const totalUsers = await User.countDocuments()
    const totalStudents = await User.countDocuments({ role: "student" })
    const totalInstructors = await User.countDocuments({ role: "instructor" })

    // Get total courses count
    const totalCourses = await Course.countDocuments()
    const publishedCourses = await Course.countDocuments({ status: "published" })
    const pendingCourses = await Course.countDocuments({ status: "pending" })

    // Get total webinars count
    const totalWebinars = await Webinar.countDocuments()
    const upcomingWebinars = await Webinar.countDocuments({
      status: "scheduled",
      date: { $gte: new Date() },
    })

    // Get total blog posts count
    const totalPosts = await BlogPost.countDocuments()
    const publishedPosts = await BlogPost.countDocuments({ status: "published" })

    // Calculate total revenue
    const courses = await Course.find({ status: "published" }).lean()
    let totalRevenue = 0
    for (const course of courses) {
      totalRevenue += course.price * course.students
    }

    // Get pending approvals
    const pendingApprovalCourses = await Course.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("instructorId", "firstName lastName")
      .lean()

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email role avatar createdAt")
      .lean()

    // Get popular courses
    const popularCourses = await Course.find({ status: "published" })
      .sort({ students: -1 })
      .limit(5)
      .populate("instructorId", "firstName lastName")
      .lean()

    // Prepare dashboard data
    const dashboardData = {
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        pendingCourses,
        totalWebinars,
        upcomingWebinars,
        totalPosts,
        publishedPosts,
        totalRevenue,
      },
      pendingApprovals: pendingApprovalCourses,
      recentUsers,
      popularCourses,
      platformStats: [
        {
          name: "Course Completion Rate",
          value: "68%",
          percentage: 68,
        },
        {
          name: "Student Satisfaction",
          value: "4.7/5",
          percentage: 94,
        },
        {
          name: "Instructor Retention",
          value: "92%",
          percentage: 92,
        },
        {
          name: "Platform Uptime",
          value: "99.9%",
          percentage: 99.9,
        },
        {
          name: "Mobile Usage",
          value: "45%",
          percentage: 45,
        },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
