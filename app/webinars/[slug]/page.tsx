import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ChevronRight, MapPin, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RazorpayPayment from "@/components/razorpay-payment"

async function getWebinarBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/webinars/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch webinar")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching webinar:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const webinarData = await getWebinarBySlug(slug)
  const webinar = webinarData?.webinar

  if (!webinar) {
    return {
      title: "Webinar Not Found",
      description: "The requested webinar could not be found.",
    }
  }

  return {
    title: `${webinar.title} | Stock Market Education Webinars`,
    description: webinar.description,
    openGraph: {
      title: `${webinar.title} | Stock Market Education Webinars`,
      description: webinar.description,
      images: [{ url: webinar.thumbnail }],
    },
  }
}

export default async function WebinarDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const webinarData = await getWebinarBySlug(slug)
  const webinar = webinarData?.webinar || {
    id: "sample-webinar",
    title: "Market Outlook 2023: Opportunities and Risks",
    slug: "market-outlook-2023",
    description:
      "Join us for an in-depth analysis of current market conditions and learn about potential opportunities and risks in the coming months. Our expert analysts will share their insights on market trends, sector rotations, and specific stocks to watch.",
    date: new Date("2023-06-15T19:00:00Z"),
    duration: 90,
    instructorId: "instructor-1",
    instructor: {
      name: "Michael Johnson",
      title: "Senior Market Analyst",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Michael is a professional trader with over 15 years of experience in the financial markets. He specializes in technical analysis and has helped thousands of students become successful traders.",
      students: 15234,
      webinars: 24,
    },
    platform: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123456789",
    passcode: "market2023",
    price: 49,
    isFree: false,
    thumbnail: "/placeholder.svg?height=400&width=600",
    category: "Market Analysis",
    status: "scheduled",
    topics: [
      "Current market conditions and key indicators",
      "Sector analysis and rotation opportunities",
      "Technical analysis of major indices",
      "Risk management strategies for volatile markets",
      "Top stocks to watch in the coming months",
    ],
    resources: [
      {
        id: "resource-1",
        title: "Market Outlook Slides",
        type: "pdf",
        url: "/resources/market-outlook-slides.pdf",
        size: "2.4 MB",
      },
      {
        id: "resource-2",
        title: "Technical Analysis Cheat Sheet",
        type: "pdf",
        url: "/resources/technical-analysis-cheat-sheet.pdf",
        size: "1.8 MB",
      },
    ],
    attendees: 245,
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-05-15"),
  }

  if (!webinar && !webinarData) {
    notFound()
  }

  const webinarDate = new Date(webinar.date)
  const isPast = webinarDate < new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/webinars" className="hover:text-foreground">
            Webinars
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{webinar.title}</span>
        </nav>

        {/* Webinar Header */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{webinar.category}</Badge>
              {webinar.status === "live" && <Badge className="bg-red-500 hover:bg-red-600">LIVE NOW</Badge>}
              {webinar.isFree && <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{webinar.title}</h1>
            <p className="text-lg text-muted-foreground">{webinar.description.substring(0, 150)}...</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {webinarDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {webinarDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{webinar.duration} minutes</span>
              </div>

              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{webinar.attendees} registered</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={webinar.instructor?.avatar || "/placeholder.svg"}
                  alt={webinar.instructor?.name || "Instructor"}
                />
                <AvatarFallback>{webinar.instructor?.name?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Hosted by{" "}
                  <Link href={`/instructors/${webinar.instructorId}`} className="text-primary hover:underline">
                    {webinar.instructor?.name || "Instructor Name"}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">{webinar.instructor?.title || "Stock Market Expert"}</p>
              </div>
            </div>
          </div>

          {/* Webinar Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={webinar.thumbnail || "/placeholder.svg"}
                  alt={webinar.title}
                  fill
                  className="object-cover"
                />
                {webinar.status === "live" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Badge className="bg-red-500 hover:bg-red-600 text-lg py-1 px-3">LIVE NOW</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                {!isPast ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Date & Time:</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {webinarDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {webinarDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      {webinar.isFree ? (
                        <div className="text-3xl font-bold">Free</div>
                      ) : (
                        <div className="text-3xl font-bold">${webinar.price}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {webinar.isFree ? (
                        <Button className="w-full">Register Now</Button>
                      ) : (
                        <RazorpayPayment
                          itemId={webinar.id}
                          itemType="webinar"
                          amount={webinar.price * 100}
                          name={webinar.title}
                          description={`Registration for ${webinar.title}`}
                          buttonText="Register Now"
                          buttonClassName="w-full"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">This webinar has ended</div>
                      <p className="text-sm text-muted-foreground">
                        {webinar.recordingUrl
                          ? "Recording is available for purchase"
                          : "Recording will be available soon"}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-bold">${webinar.price / 2}</div>
                      <div className="text-lg text-muted-foreground line-through">${webinar.price}</div>
                    </div>

                    <div className="space-y-2">
                      {webinar.recordingUrl ? (
                        <RazorpayPayment
                          itemId={webinar.id}
                          itemType="webinar_recording"
                          amount={(webinar.price / 2) * 100}
                          name={`${webinar.title} Recording`}
                          description={`Recording access for ${webinar.title}`}
                          buttonText="Buy Recording"
                          buttonClassName="w-full"
                        />
                      ) : (
                        <Button className="w-full" disabled>
                          Recording Coming Soon
                        </Button>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">This webinar includes:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{webinar.duration} minutes live session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Online via {webinar.platform}</span>
                    </li>
                    {webinar.resources && webinar.resources.length > 0 && (
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>{webinar.resources.length} downloadable resources</span>
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Access to recording (after event)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Webinar Content */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <h2>About This Webinar</h2>
              <p>{webinar.description}</p>

              <h3>What You'll Learn</h3>
              <ul>
                {webinar.topics?.map((topic: string, index: number) => <li key={index}>{topic}</li>) || (
                  <>
                    <li>Understanding market trends and patterns</li>
                    <li>Identifying profitable trading opportunities</li>
                    <li>Risk management strategies for volatile markets</li>
                    <li>Technical analysis techniques for better decision making</li>
                    <li>Real-time market analysis and case studies</li>
                  </>
                )}
              </ul>

              <h3>Who Should Attend</h3>
              <ul>
                <li>Active traders looking to improve their strategies</li>
                <li>Investors interested in market analysis</li>
                <li>Beginners wanting to learn from industry experts</li>
                <li>Financial professionals seeking to expand their knowledge</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={webinar.instructor?.avatar || "/placeholder.svg"}
                  alt={webinar.instructor?.name || "Instructor"}
                />
                <AvatarFallback>{webinar.instructor?.name?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{webinar.instructor?.name || "Instructor Name"}</h2>
                <p className="text-muted-foreground">{webinar.instructor?.title || "Stock Market Expert"}</p>

                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{webinar.instructor?.students || 10245} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    <span>{webinar.instructor?.webinars || 15} Webinars</span>
                  </div>
                </div>

                <div className="mt-4 prose max-w-none dark:prose-invert">
                  <p>
                    {webinar.instructor?.bio ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Webinar Resources</h2>

              {webinar.resources && webinar.resources.length > 0 ? (
                <div className="space-y-2">
                  {webinar.resources.map((resource: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-md">
                          {resource.type === "pdf" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10 9 9 9 8 9" />
                            </svg>
                          ) : resource.type === "video" ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.type.toUpperCase()} {resource.size && `• ${resource.size}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={!isPast}>
                        {isPast ? "Download" : "Available after webinar"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Resources will be available after the webinar.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Webinars */}
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Related Webinars</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Related Webinar"
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>June 25, 2023 • 7:00 PM EST</span>
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-1">Related Webinar Title</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="Instructor" />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Instructor Name</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
