"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, Download, ExternalLink } from "lucide-react"

async function getWebinarBySlug(slug: string) {
  try {
    const webinarRes = await fetch(`/api/webinars/${slug}`)
    if (!webinarRes.ok) {
      throw new Error(`Failed to fetch webinar with slug: ${slug}`)
    }
    const webinarData = await webinarRes.json()
    return webinarData.webinar
  } catch (error) {
    console.error("Error fetching webinar data:", error)
    return null
  }
}

// Update the params handling in all dynamic route pages
export default async function StudentWebinarDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const webinarData = await getWebinarBySlug(slug)
  // Rest of the component remains the same
  const { toast } = useToast()
  const [webinar, setWebinar] = useState(webinarData)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        // Check if user is registered
        const registrationRes = await fetch(`/api/student/webinars/${slug}/registration`)
        if (registrationRes.ok) {
          setIsRegistered(true)
        }
      } catch (error) {
        console.error("Error fetching registration status:", error)
      }
    }

    fetchRegistrationStatus()
  }, [slug])

  const joinWebinar = () => {
    window.open(webinar.meetingUrl, "_blank")
  }

  if (!webinar) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Webinar not found</h1>
        <p>The requested webinar could not be found or you don't have access to it.</p>
      </div>
    )
  }

  const webinarDate = new Date(webinar.date)
  const isPast = webinarDate < new Date()
  const isLive = webinar.status === "live"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {isLive && <Badge className="bg-red-500">LIVE NOW</Badge>}
              {isPast && !webinar.recordingUrl && <Badge variant="outline">Ended</Badge>}
              {isPast && webinar.recordingUrl && <Badge variant="outline">Recording Available</Badge>}
              {!isPast && !isLive && <Badge variant="outline">Upcoming</Badge>}
            </div>
            <h1 className="text-2xl font-bold">{webinar.title}</h1>
            <p className="text-muted-foreground">{webinar.description.substring(0, 100)}...</p>
          </div>
          <div>
            {isLive && (
              <Button onClick={joinWebinar} className="bg-red-500 hover:bg-red-600">
                <Video className="mr-2 h-4 w-4" />
                Join Live Now
              </Button>
            )}
            {!isLive && !isPast && (
              <div className="text-sm font-medium">
                Starting in{" "}
                <span className="text-primary">
                  {Math.ceil((webinarDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            )}
            {isPast && webinar.recordingUrl && (
              <Button onClick={() => window.open(webinar.recordingUrl, "_blank")}>
                <Video className="mr-2 h-4 w-4" />
                Watch Recording
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webinar Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p>{webinar.description}</p>

                  <h3>What You'll Learn</h3>
                  <ul>
                    {webinar.topics?.map((topic, index) => <li key={index}>{topic}</li>) || (
                      <>
                        <li>Understanding market trends and patterns</li>
                        <li>Identifying profitable trading opportunities</li>
                        <li>Risk management strategies for volatile markets</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {webinar.resources && webinar.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Download materials for this webinar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {webinar.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-xs text-muted-foreground">{resource.type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webinar Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {webinarDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" at "}
                        {webinarDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{webinar.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Platform</p>
                      <p className="text-sm text-muted-foreground">{webinar.platform}</p>
                    </div>
                  </div>
                </div>

                {isRegistered ? (
                  <div className="rounded-md bg-muted p-4 text-center">
                    <p className="font-medium">You are registered for this webinar</p>
                    {!isPast && !isLive && (
                      <p className="text-sm text-muted-foreground mt-1">
                        You will receive a reminder email before the webinar starts
                      </p>
                    )}
                  </div>
                ) : (
                  <Button className="w-full" disabled={isPast}>
                    Register Now
                  </Button>
                )}

                {isLive && (
                  <Button onClick={joinWebinar} className="w-full bg-red-500 hover:bg-red-600">
                    <Video className="mr-2 h-4 w-4" />
                    Join Live Now
                  </Button>
                )}

                {isPast && webinar.recordingUrl && (
                  <Button onClick={() => window.open(webinar.recordingUrl, "_blank")} className="w-full">
                    <Video className="mr-2 h-4 w-4" />
                    Watch Recording
                  </Button>
                )}

                {webinar.meetingUrl && !isPast && !isLive && (
                  <div className="text-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Add to Calendar
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted"></div>
                  <div>
                    <p className="font-medium">Instructor Name</p>
                    <p className="text-sm text-muted-foreground">Stock Market Expert</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`/instructors/${webinar.instructorId}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
