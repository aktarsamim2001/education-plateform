import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course } from "@/lib/models/mongodb/course"
import { Webinar } from "@/lib/models/mongodb/webinar"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get("timeRange") || "30days"

    await dbConnect()

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7)
        break
      case "30days":
        startDate.setDate(now.getDate() - 30)
        break
      case "90days":
        startDate.setDate(now.getDate() - 90)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get previous period for comparison
    const previousPeriodStart = new Date(startDate)
    const previousPeriodEnd = new Date(startDate)

    switch (timeRange) {
      case "7days":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7)
        break
      case "30days":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)
        break
      case "90days":
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 90)
        break
      case "year":
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1)
        break
      default:
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)
    }

    // Get total users
    const totalUsers = await User.countDocuments()
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } })
    const previousPeriodUsers = await User.countDocuments({
      createdAt: { $gte: previousPeriodStart, $lt: startDate },
    })

    // Calculate user growth percentage
    const userGrowthPercentage =
      previousPeriodUsers > 0 ? Math.round(((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100) : 100

    // Get total courses and webinars
    const totalCourses = await Course.countDocuments({ status: "published" })
    const newCourses = await Course.countDocuments({
      status: "published",
      createdAt: { $gte: startDate },
    })
    const previousPeriodCourses = await Course.countDocuments({
      status: "published",
      createdAt: { $gte: previousPeriodStart, $lt: startDate },
    })

    // Calculate course growth percentage
    const courseGrowthPercentage =
      previousPeriodCourses > 0 ? Math.round(((newCourses - previousPeriodCourses) / previousPeriodCourses) * 100) : 100

    // Get webinar data
    const totalWebinars = await Webinar.countDocuments({ status: { $in: ["completed", "live"] } })
    const newWebinars = await Webinar.countDocuments({
      status: { $in: ["completed", "live"] },
      date: { $gte: startDate },
    })
    const previousPeriodWebinars = await Webinar.countDocuments({
      status: { $in: ["completed", "live"] },
      date: { $gte: previousPeriodStart, $lt: startDate },
    })

    // Calculate webinar growth percentage
    const webinarGrowthPercentage =
      previousPeriodWebinars > 0
        ? Math.round(((newWebinars - previousPeriodWebinars) / previousPeriodWebinars) * 100)
        : 100

    // Calculate revenue (this would typically come from a payment model)
    // For this example, we'll use a simplified calculation
    const courses = await Course.find({ status: "published" }).lean()
    let totalRevenue = 0

    for (const course of courses) {
      totalRevenue += course.price * course.students
    }

    // Mock revenue growth for demonstration
    const revenueGrowthPercentage = 15

    // Prepare analytics data
    const analyticsData = {
      revenue: {
        total: totalRevenue,
        change: revenueGrowthPercentage,
        data: [], // This would be time-series data for charts
      },
      users: {
        total: totalUsers,
        change: userGrowthPercentage,
        data: [], // This would be time-series data for charts
      },
      courses: {
        total: totalCourses,
        change: courseGrowthPercentage,
        data: [], // This would be time-series data for charts
      },
      webinars: {
        total: totalWebinars,
        change: webinarGrowthPercentage,
        data: [], // This would be time-series data for charts
      },
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
