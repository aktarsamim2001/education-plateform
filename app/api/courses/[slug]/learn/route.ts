import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"
import User from "@/lib/models/mongodb/user"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    await dbConnect()

    // Get course details
    const course = await Course.findOne({ slug }).populate("instructorId", "firstName lastName avatar bio")

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is enrolled in this course
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isEnrolled = user.enrolledCourses.some((courseId) => courseId.toString() === course._id.toString())
    const isInstructor = course.instructorId._id.toString() === session.user.id
    const isAdmin = session.user.role === "admin"

    if (!isEnrolled && !isInstructor && !isAdmin) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 401 })
    }

    // Get user's progress for this course
    const userProgress = user.courseProgress.find((progress) => progress.courseId.toString() === course._id.toString())

    // Format the course data
    const formattedCourse = {
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      description: course.description,
      duration: course.duration,
      modules: course.modules.map((module) => ({
        id: module._id.toString(),
        title: module.title,
        description: module.description,
        lessons: module.lessons.map((lesson) => ({
          id: lesson._id.toString(),
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          content: lesson.content,
          resources: lesson.resources,
          quizzes: lesson.quizzes,
          completed: userProgress?.completedLessons.includes(lesson._id.toString()) || false,
        })),
      })),
      instructor: {
        id: course.instructorId._id.toString(),
        name: `${course.instructorId.firstName} ${course.instructorId.lastName}`,
        avatar: course.instructorId.avatar,
        bio: course.instructorId.bio,
      },
    }

    // Format progress data
    const progress = userProgress
      ? {
          completedLessons: userProgress.completedLessons,
          lastAccessedLesson: userProgress.lastAccessedLesson,
          percentage: calculateProgressPercentage(course, userProgress),
          timeSpent: userProgress.timeSpent || 0,
        }
      : {
          completedLessons: [],
          lastAccessedLesson: null,
          percentage: 0,
          timeSpent: 0,
        }

    return NextResponse.json({ course: formattedCourse, progress })
  } catch (error) {
    console.error("Error fetching course for learning:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate progress percentage
function calculateProgressPercentage(course, userProgress) {
  if (!userProgress) return 0

  let totalLessons = 0
  course.modules.forEach((module) => {
    totalLessons += module.lessons.length
  })

  const completedLessons = userProgress.completedLessons.length
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
}
