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

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const studentId = params.id

    // Get student
    const student = await User.findById(studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get all courses
    const courses = await Course.find({})

    // Get progress data for the student
    const studentProgress = await Progress.findOne({ userId: studentId })

    // Get course progress data
    const studentCourseProgress = await CourseProgress.find({ userId: studentId })

    // Process data for response
    const progressData = studentProgress || {
      modules: [],
      quizzes: [],
      simulations: [],
      lastActivity: new Date(),
    }

    // Calculate overall progress
    const totalModules = progressData.modules.length
    const completedModules = progressData.modules.filter((m) => m.completed).length
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

    // Calculate quiz scores
    const quizScores = progressData.quizzes.map((q) => q.score)
    const averageQuizScore =
      quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0

    // Calculate time spent
    const totalTimeSpent = progressData.modules.reduce((total, module) => total + module.timeSpent, 0)

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

    // Generate mock activity data - in a real app, this would come from actual activity logs
    const activityByDay = Array.from({ length: 30 }, (_, i) => {
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
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        enrolledCourses: studentCourseProgress.length,
        completedCourses: studentCourseProgress.filter((cp) => cp.progress === 100).length,
        overallProgress,
        lastActive: progressData.lastActivity,
        totalTimeSpent,
        quizScores: {
          average: averageQuizScore,
          highest: Math.max(...quizScores, 0),
          lowest: quizScores.length > 0 ? Math.min(...quizScores) : 0,
          total: progressData.quizzes.length,
          passed: progressData.quizzes.filter((q) => q.score >= 70).length,
        },
        courseProgress,
        activityByDay,
      },
    })
  })
}
