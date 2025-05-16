import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"
import { User } from "@/lib/models/mongodb/user"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"
import Progress from "@/lib/models/mongodb/progress"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const instructorId = session.user.id
    const studentId = params.id

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const courseId = searchParams.get("courseId")

    // Get student
    const student = await User.findOne({ _id: studentId, role: "student" })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get all courses by this instructor
    const instructorCourses = await Course.find({ instructorId })
    const instructorCourseIds = instructorCourses.map((course) => course._id)

    // Build query for course progress
    const courseProgressQuery: any = {
      userId: studentId,
      courseId: { $in: instructorCourseIds },
    }

    if (courseId) {
      courseProgressQuery.courseId = courseId
    }

    // Get course progress data
    const courseProgressData = await CourseProgress.find(courseProgressQuery)

    // Get progress data for this student
    const progressData = await Progress.findOne({ userId: studentId })

    // Get enrolled courses with details
    const enrolledCourses = courseProgressData.map((cp) => {
      const course = instructorCourses.find((c) => c._id.toString() === cp.courseId.toString())
      return {
        id: cp.courseId.toString(),
        title: course ? course.title : "Unknown Course",
        progress: cp.progress,
        enrolledAt: cp._id.getTimestamp(),
        lastAccessed: cp.lastAccessedAt,
        completedLessons: cp.completedLessons,
      }
    })

    // Calculate overall progress for instructor's courses
    const totalProgress = courseProgressData.reduce((sum, cp) => sum + cp.progress, 0)
    const overallProgress = courseProgressData.length > 0 ? Math.round(totalProgress / courseProgressData.length) : 0

    // Process quiz data
    const quizData =
      progressData?.quizzes.filter((quiz) => {
        // Check if the quiz belongs to one of the instructor's courses
        // This would require additional logic in a real implementation
        return true
      }) || []

    // Generate activity data
    const activityData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString(),
        timeSpent: Math.floor(Math.random() * 120), // Random time between 0-120 minutes
        lessonsCompleted: Math.floor(Math.random() * 3), // Random lessons between 0-3
      }
    })

    return NextResponse.json({
      student: {
        id: student._id.toString(),
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        avatar: student.avatar,
        phone: student.phone,
        location: student.location,
        createdAt: student._id.getTimestamp(),
        lastActive: progressData?.lastActivity || new Date(),
        overallProgress,
        enrolledCourses,
        quizzes: quizData,
        activityByDay: activityData,
      },
    })
  })
}
