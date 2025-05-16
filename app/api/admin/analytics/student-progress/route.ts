import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"
import { User } from "@/lib/models/mongodb/user"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import Progress from "@/lib/models/mongodb/progress"

export async function GET(req: NextRequest) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const courseId = searchParams.get("courseId")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    // Build query
    const query: any = {}

    if (courseId) {
      query["courseProgress.courseId"] = courseId
    }

    if (fromDate && toDate) {
      query.lastActivity = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      }
    }

    // Get all students with role "student"
    const students = await User.find({ role: "student" })

    // Get all courses
    const courses = await Course.find({})

    // Get progress data for all students
    const progressData = await Progress.find(query)

    // Get course progress data
    const courseProgressData = await CourseProgress.find({})

    // Process data for response
    const studentProgressData = students.map((student) => {
      const studentProgress = progressData.find((p) => p.userId.toString() === student._id.toString()) || {
        modules: [],
        quizzes: [],
        simulations: [],
        lastActivity: new Date(),
      }

      const studentCourseProgress = courseProgressData.filter((cp) => cp.userId.toString() === student._id.toString())

      // Calculate overall progress
      const totalModules = studentProgress.modules.length
      const completedModules = studentProgress.modules.filter((m) => m.completed).length
      const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

      // Calculate quiz scores
      const quizScores = studentProgress.quizzes.map((q) => q.score)
      const averageQuizScore =
        quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0

      // Calculate time spent
      const totalTimeSpent = studentProgress.modules.reduce((total, module) => total + module.timeSpent, 0)

      // Get course progress details
      const courseProgress = studentCourseProgress.map((cp) => {
        const course = courses.find((c) => c._id.toString() === cp.courseId.toString())
        return {
          courseId: cp.courseId.toString(),
          courseTitle: course ? course.title : "Unknown Course",
          progress: cp.progress,
          lastAccessed: cp.lastAccessedAt,
          timeSpent: Math.round(cp.completedLessons.length * 15), // Estimate 15 minutes per lesson
        }
      })

      return {
        id: student._id.toString(),
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        enrolledCourses: studentCourseProgress.length,
        completedCourses: studentCourseProgress.filter((cp) => cp.progress === 100).length,
        overallProgress,
        lastActive: studentProgress.lastActivity,
        totalTimeSpent,
        quizScores: {
          average: averageQuizScore,
          highest: Math.max(...quizScores, 0),
          lowest: quizScores.length > 0 ? Math.min(...quizScores) : 0,
          total: studentProgress.quizzes.length,
          passed: studentProgress.quizzes.filter((q) => q.score >= 70).length,
        },
        courseProgress,
        // Mock activity data - in a real app, this would come from actual activity logs
        activityByDay: Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return {
            date: date.toISOString(),
            timeSpent: Math.floor(Math.random() * 120), // Random time between 0-120 minutes
            lessonsCompleted: Math.floor(Math.random() * 3), // Random lessons between 0-3
          }
        }),
      }
    })

    // Calculate overall stats
    const totalStudents = students.length
    const activeStudents = progressData.filter((p) => {
      const lastActivity = new Date(p.lastActivity)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastActivity >= thirtyDaysAgo
    }).length

    const averageProgress =
      studentProgressData.length > 0
        ? Math.round(
            studentProgressData.reduce((sum, student) => sum + student.overallProgress, 0) / studentProgressData.length,
          )
        : 0

    const averageTimeSpent =
      studentProgressData.length > 0
        ? Math.round(
            studentProgressData.reduce((sum, student) => sum + student.totalTimeSpent, 0) / studentProgressData.length,
          )
        : 0

    const totalEnrolledCourses = studentProgressData.reduce((sum, student) => sum + student.enrolledCourses, 0)
    const totalCompletedCourses = studentProgressData.reduce((sum, student) => sum + student.completedCourses, 0)
    const completionRate =
      totalEnrolledCourses > 0 ? Math.round((totalCompletedCourses / totalEnrolledCourses) * 100) : 0

    const averageQuizScore =
      studentProgressData.length > 0
        ? Math.round(
            studentProgressData.reduce((sum, student) => sum + student.quizScores.average, 0) /
              studentProgressData.length,
          )
        : 0

    // Calculate course engagement
    const courseEngagement = courses.map((course) => {
      const enrollments = courseProgressData.filter((cp) => cp.courseId.toString() === course._id.toString()).length
      const courseProgressItems = courseProgressData.filter((cp) => cp.courseId.toString() === course._id.toString())
      const averageProgress =
        courseProgressItems.length > 0
          ? Math.round(courseProgressItems.reduce((sum, cp) => sum + cp.progress, 0) / courseProgressItems.length)
          : 0
      const averageTimeSpent =
        courseProgressItems.length > 0
          ? Math.round(
              courseProgressItems.reduce((sum, cp) => sum + cp.completedLessons.length * 15, 0) /
                courseProgressItems.length,
            )
          : 0

      return {
        courseId: course._id.toString(),
        courseTitle: course.title,
        enrollments,
        averageProgress,
        averageTimeSpent,
      }
    })

    // Generate mock activity over time data
    const activityOverTime = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString(),
        activeUsers: Math.floor(Math.random() * (totalStudents / 2) + totalStudents / 3), // Random number of active users
        lessonsCompleted: Math.floor(Math.random() * 50), // Random number of lessons completed
        timeSpent: Math.floor(Math.random() * 1000), // Random time spent in minutes
      }
    })

    return NextResponse.json({
      students: studentProgressData,
      stats: {
        totalStudents,
        activeStudents,
        averageProgress,
        averageTimeSpent,
        completionRate,
        averageQuizScore,
        courseEngagement,
        activityOverTime,
      },
    })
  })
}
