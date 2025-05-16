export interface Webinar {
  id: string
  title: string
  slug: string
  description: string
  date: Date
  duration: number // Duration in minutes
  instructorId: string
  platform: "zoom" | "meet" | "teams" | "other"
  meetingLink?: string
  meetingId?: string
  passcode?: string
  price: number
  isFree: boolean
  thumbnail: string
  category: string
  status: "scheduled" | "live" | "completed" | "cancelled"
  recordingUrl?: string
  resources?: Resource[]
  attendees: number
  createdAt: Date
  updatedAt: Date
}

export interface Resource {
  id: string
  title: string
  type: "pdf" | "video" | "link" | "file"
  url: string
  size?: string
}

export interface WebinarRegistration {
  id: string
  webinarId: string
  userId: string
  status: "registered" | "attended" | "no-show" | "cancelled"
  registeredAt: Date
  reminderSent: boolean
  feedbackSubmitted: boolean
}

export interface WebinarFeedback {
  id: string
  webinarId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
}
