import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, data } = await req.json()

    if (!type || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let emailOptions

    switch (type) {
      case "welcome":
        emailOptions = emailTemplates.welcome(data.name)
        break
      case "course_enrollment":
        emailOptions = emailTemplates.courseEnrollment(data.name, data.courseName)
        break
      case "webinar_reminder":
        emailOptions = emailTemplates.webinarReminder(data.name, data.webinarName, data.date, data.time, data.link)
        break
      case "password_reset":
        emailOptions = emailTemplates.passwordReset(data.name, data.resetLink)
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const success = await sendEmail({
      to: data.email,
      subject: emailOptions.subject,
      html: emailOptions.html,
    })

    if (success) {
      return NextResponse.json({ message: "Email sent successfully" })
    } else {
      throw new Error("Failed to send email")
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
