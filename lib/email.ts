import nodemailer from "nodemailer"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"StockEdu" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for plain text version
      html,
    })
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to StockEdu!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to StockEdu, ${name}!</h1>
        <p>Thank you for joining our platform. We're excited to help you on your journey to mastering the stock market.</p>
        <p>Here are some things you can do to get started:</p>
        <ul>
          <li>Browse our courses and webinars</li>
          <li>Complete your profile</li>
          <li>Join our community</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy learning!</p>
        <p>The StockEdu Team</p>
      </div>
    `,
  }),

  courseEnrollment: (name: string, courseName: string) => ({
    subject: `You're enrolled in ${courseName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Course Enrollment Confirmation</h1>
        <p>Hi ${name},</p>
        <p>You have successfully enrolled in <strong>${courseName}</strong>.</p>
        <p>You can access your course materials from your dashboard. We recommend starting with the first module and progressing through the course at your own pace.</p>
        <p>Happy learning!</p>
        <p>The StockEdu Team</p>
      </div>
    `,
  }),

  webinarReminder: (name: string, webinarName: string, date: string, time: string, link: string) => ({
    subject: `Reminder: ${webinarName} starts soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Webinar Reminder</h1>
        <p>Hi ${name},</p>
        <p>This is a friendly reminder that the webinar <strong>${webinarName}</strong> is starting soon.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>You can join the webinar using the link below:</p>
        <p><a href="${link}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Join Webinar</a></p>
        <p>We look forward to seeing you there!</p>
        <p>The StockEdu Team</p>
      </div>
    `,
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <p><a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>The StockEdu Team</p>
      </div>
    `,
  }),
}
