"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ArrowLeft, Calendar, Clock, Download, Send, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function WebinarViewPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [webinarData, setWebinarData] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const chatEndRef = useRef(null)

  useEffect(() => {
    const fetchWebinarData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/webinars/${params.slug}/view`)
        // const data = await response.json()

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData = {
          id: "1",
          title: "Market Outlook 2023: Opportunities and Risks",
          slug: "market-outlook-2023",
          description:
            "A comprehensive analysis of market trends and potential investment opportunities for the coming year.",
          status: "live", // live, upcoming, completed
          startDate: "2023-06-15T19:00:00Z",
          endDate: "2023-06-15T20:30:00Z",
          streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          instructor: {
            id: "instructor-1",
            name: "Michael Chen",
            title: "Chief Market Strategist",
            avatar: "/placeholder.svg?height=100&width=100",
            bio: "Michael is a seasoned market analyst with over 15 years of experience in the financial industry.",
          },
          attendees: 245,
          resources: [
            {
              id: "resource-1",
              title: "Market Outlook Slides",
              type: "pdf",
              url: "#",
              size: "2.4 MB",
            },
            {
              id: "resource-2",
              title: "Economic Data Sheet",
              type: "xlsx",
              url: "#",
              size: "1.8 MB",
            },
          ],
          polls: [
            {
              id: "poll-1",
              question: "Which sector do you think will outperform in 2023?",
              options: ["Technology", "Healthcare", "Energy", "Financials"],
              results: [45, 25, 20, 10],
            },
            {
              id: "poll-2",
              question: "What is your biggest concern for the markets in 2023?",
              options: ["Inflation", "Recession", "Geopolitical risks", "Fed policy"],
              results: [30, 35, 15, 20],
            },
          ],
          qa: [
            {
              id: "qa-1",
              question: "How will rising interest rates affect growth stocks?",
              answer:
                "Rising interest rates typically put pressure on growth stocks as they reduce the present value of future cash flows. Companies with high valuations based on expected future growth may see their stock prices decline as discount rates increase.",
            },
            {
              id: "qa-2",
              question: "What sectors are most resilient during inflationary periods?",
              answer:
                "Historically, sectors like energy, materials, and real estate have shown resilience during inflationary periods. Companies with pricing power that can pass increased costs to consumers also tend to perform better.",
            },
          ],
        }

        setWebinarData(mockData)

        // Simulate chat messages
        const mockMessages = [
          {
            id: "msg-1",
            sender: {
              id: "user-1",
              name: "John Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Hello everyone! Excited for today's webinar.",
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
          {
            id: "msg-2",
            sender: {
              id: "instructor-1",
              name: "Michael Chen",
              avatar: "/placeholder.svg?height=40&width=40",
              isInstructor: true,
            },
            content:
              "Welcome everyone! We'll be starting in about 15 minutes. Feel free to introduce yourselves in the chat.",
            timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
          },
          {
            id: "msg-3",
            sender: {
              id: "user-2",
              name: "Sarah Johnson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Hi from Chicago! Looking forward to learning about market trends for 2023.",
            timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          },
          {
            id: "msg-4",
            sender: {
              id: "user-3",
              name: "Robert Garcia",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Question: Will you be covering international markets as well?",
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          },
          {
            id: "msg-5",
            sender: {
              id: "instructor-1",
              name: "Michael Chen",
              avatar: "/placeholder.svg?height=40&width=40",
              isInstructor: true,
            },
            content:
              "Yes, Robert! We'll definitely cover international markets, especially emerging markets and their outlook for 2023.",
            timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
          },
        ]

        setChatMessages(mockMessages)
      } catch (error) {
        console.error("Error fetching webinar data:", error)
        toast({
          title: "Error",
          description: "Failed to load webinar. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebinarData()

    // Simulate new messages coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          sender: {
            id: `user-${Math.floor(Math.random() * 100)}`,
            name: `User ${Math.floor(Math.random() * 100)}`,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: [
            "Great point about diversification!",
            "How do you see crypto performing next year?",
            "Thanks for the insights on bond markets.",
            "What's your take on small caps vs large caps?",
            "Are you bullish on tech stocks for 2023?",
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date().toISOString(),
        }

        setChatMessages((prev) => [...prev, newMessage])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [params.slug, toast])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        id: session?.user?.id || "current-user",
        name: session?.user?.name || "You",
        avatar: session?.user?.image || "/placeholder.svg?height=40&width=40",
      },
      content: messageInput,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setMessageInput("")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/student/webinars/${params.slug}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-medium">{webinarData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Instructor: {webinarData.instructor.name}</span>
              <span>•</span>
              <span>
                {webinarData.status === "live" ? (
                  <span className="flex items-center text-red-500">
                    <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                    Live Now
                  </span>
                ) : webinarData.status === "upcoming" ? (
                  "Upcoming"
                ) : (
                  "Completed"
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4" />
            <span>{webinarData.attendees} watching</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                src={webinarData.streamUrl}
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{webinarData.title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(webinarData.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(webinarData.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                    {new Date(webinarData.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {webinarData.instructor.name}, {webinarData.instructor.title}
                  </span>
                </div>
              </div>

              <div className="mt-4 prose max-w-none dark:prose-invert">
                <p>{webinarData.description}</p>
              </div>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="resources">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="polls">Polls</TabsTrigger>
                  <TabsTrigger value="qa">Q&A</TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Webinar Resources</CardTitle>
                      <CardDescription>Download materials related to this webinar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {webinarData.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
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
                                    className="h-5 w-5 text-red-500"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                  </svg>
                                ) : resource.type === "xlsx" ? (
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
                                    className="h-5 w-5 text-green-500"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                  </svg>
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
                                <div className="font-medium">{resource.title}</div>
                                <div className="text-xs text-muted-foreground">{resource.size}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="polls" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Polls</CardTitle>
                      <CardDescription>Participate in polls during the webinar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {webinarData.polls.map((poll) => (
                          <div key={poll.id} className="space-y-4">
                            <h3 className="font-medium">{poll.question}</h3>
                            <div className="space-y-2">
                              {poll.options.map((option, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>{option}</span>
                                    <span>{poll.results[index]}%</span>
                                  </div>
                                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                      className="h-full bg-primary"
                                      style={{ width: `${poll.results[index]}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="qa" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Q&A</CardTitle>
                      <CardDescription>Questions answered by the presenter</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {webinarData.qa.map((item) => (
                          <div key={item.id} className="rounded-lg border p-4">
                            <div className="mb-2 font-medium">Q: {item.question}</div>
                            <div className="text-sm">A: {item.answer}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="hidden w-80 flex-shrink-0 overflow-hidden border-l md:flex md:flex-col">
          <div className="border-b p-4">
            <h3 className="font-medium">Live Chat</h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${message.sender.isInstructor ? "text-primary" : ""}`}>
                        {message.sender.name}
                        {message.sender.isInstructor && (
                          <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                            Instructor
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
