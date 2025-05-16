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

    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const instructorId = session.user.id

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const courseId = searchParams.get("courseId")
    const studentId = searchParams.get("studentId")

    // Get all courses by this instructor
    const instructorCourses = await Course.find({ instructorId })
    const instructorCourseIds = instructorCourses.map((course) => course._id)

    // Build query for course progress
    const courseProgressQuery: any = {
      courseId: { $in: instructorCourseIds },
    }

    if (courseId) {
      courseProgressQuery.courseId = courseId
    }

    if (studentId) {
      courseProgressQuery.userId = studentId
    }

    // Get course progress data
    const courseProgressData = await CourseProgress.find(courseProgressQuery)

    // Get unique student IDs from course progress
    const studentIds = [...new Set(courseProgressData.map((cp) => cp.userId.toString()))]

    // Get student data
    const students = await User.find({ _id: { $in: studentIds }, role: "student" })

    // Get progress data for these students
    const progressData = await Progress.find({ userId: { $in: studentIds } })

    // Process data for response
    const studentProgressData = students.map((student) => {
      const studentProgress = progressData.find((p) => p.userId.toString() === student._id.toString()) || {
        modules: [],
        quizzes: [],
        simulations: [],
        lastActivity: new Date(),
      }

      const studentCourseProgress = courseProgressData.filter((cp) => cp.userId.toString() === student._id.toString())

      // Get enrolled courses with details
      const enrolledCourses = studentCourseProgress.map((cp) => {
        const course = instructorCourses.find((c) => c._id.toString() === cp.courseId.toString())
        return {
          id: cp.courseId.toString(),
          title: course ? course.title : "Unknown Course",
          progress: cp.progress,
          enrolledAt: cp._id.getTimestamp(),
          lastAccessed: cp.lastAccessedAt,
        }
      })

      // Calculate overall progress for instructor's courses
      const totalProgress = studentCourseProgress.reduce((sum, cp) => sum + cp.progress, 0)
      const overallProgress =
        studentCourseProgress.length > 0 ? Math.round(totalProgress / studentCourseProgress.length) : 0

      return {
        id: student._id.toString(),
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        avatar: student.avatar,
        phone: student.phone,
        location: student.location,
        createdAt: student._id.getTimestamp(),
        lastActive: studentProgress.lastActivity,
        overallProgress,
        enrolledCourses,
      }
    })

    return NextResponse.json({ students: studentProgressData })
  })
}
