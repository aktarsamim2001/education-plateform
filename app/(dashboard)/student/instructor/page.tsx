"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Mail, MessageSquare, BookOpen, Video } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useStudentCourses } from "@/lib/react-query/queries"

export default function InstructorPage() {
  const { data: session } = useSession()
  const { data: courses } = useStudentCourses()
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Get unique instructors from enrolled courses
  const instructors = courses
    ? Array.from(
        new Map(
          courses.filter((course) => course.instructor).map((course) => [course.instructor.id, course.instructor]),
        ).values(),
      )
    : []

  const handleSendMessage = async (instructorId: string) => {
    setIsSending(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message sent",
        description: "Your message has been sent to the instructor.",
      })

      setMessageText("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">No instructors found</h2>
        <p className="text-muted-foreground mb-4">Enroll in courses to connect with instructors</p>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Instructors</h1>
        <p className="text-muted-foreground">Connect with the instructors of your enrolled courses.</p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-muted/30">
                <div className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
                    <AvatarFallback>{instructor.name?.charAt(0) || "I"}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{instructor.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{instructor.title || "Stock Market Expert"}</p>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {instructor.specialties?.map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    )) || (
                      <>
                        <Badge variant="outline">Technical Analysis</Badge>
                        <Badge variant="outline">Fundamental Analysis</Badge>
                        <Badge variant="outline">Options Trading</Badge>
                      </>
                    )}
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Students
                      </span>
                      <span>{instructor.students || "5,000+"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        Courses
                      </span>
                      <span>
                        {instructor.courses || courses.filter((c) => c.instructor?.id === instructor.id).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" />
                        Webinars
                      </span>
                      <span>{instructor.webinars || "15+"}</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full">
                    <Button asChild className="w-full">
                      <Link href={`/instructors/${instructor.id}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 p-0">
                <Tabs defaultValue="courses" className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="w-full">
                      <TabsTrigger value="courses" className="flex-1">
                        Courses
                      </TabsTrigger>
                      <TabsTrigger value="contact" className="flex-1">
                        Contact
                      </TabsTrigger>
                      <TabsTrigger value="about" className="flex-1">
                        About
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="courses" className="p-6">
                    <h3 className="text-lg font-medium mb-4">Courses by {instructor.name}</h3>
                    <div className="space-y-4">
                      {courses
                        .filter((course) => course.instructor?.id === instructor.id)
                        .map((course) => (
                          <Card key={course.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                  <Image
                                    src={course.coverImage || "/placeholder.svg?height=64&width=96"}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{course.title}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                                  <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <Badge variant={course.progress?.percentage === 100 ? "success" : "outline"}>
                                        {course.progress?.percentage || 0}% Complete
                                      </Badge>
                                    </span>
                                  </div>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                  <Link href={`/student/courses/${course.slug}`}>Continue</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="p-6">
                    <h3 className="text-lg font-medium mb-4">Contact {instructor.name}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm">Send a message to your instructor:</p>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-32"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => handleSendMessage(instructor.id)}
                        disabled={!messageText.trim() || isSending}
                      >
                        {isSending ? "Sending..." : "Send Message"}
                      </Button>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="font-medium">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{instructor.email || "instructor@stockedu.com"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>Office hours: Mon-Fri, 10 AM - 4 PM EST</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Response time: Usually within 24 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="about" className="p-6">
                    <h3 className="text-lg font-medium mb-4">About {instructor.name}</h3>
                    <div className="prose max-w-none">
                      <p>
                        {instructor.bio ||
                          `${instructor.name} is an experienced stock market educator with over 10 years of experience in trading and investing. Specializing in technical analysis and options trading, they have helped thousands of students achieve their financial goals through strategic market approaches.`}
                      </p>

                      <h4>Experience</h4>
                      <ul>
                        <li>10+ years of active trading experience</li>
                        <li>Certified Financial Analyst</li>
                        <li>Former hedge fund manager</li>
                        <li>Published author on stock market strategies</li>
                      </ul>

                      <h4>Teaching Philosophy</h4>
                      <p>
                        "My goal is to demystify the stock market and empower students with practical knowledge they can
                        apply immediately. I believe in learning by doing and focus on real-world applications rather
                        than just theory."
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
