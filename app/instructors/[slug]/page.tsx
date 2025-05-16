import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, Facebook, Globe, Linkedin, Mail, Star, Twitter, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock function to simulate fetching instructor data by slug
async function getInstructorBySlug(slug: string) {
  // In a real application, you would fetch data from a database or API
  // based on the slug. This is just a placeholder.
  return {
    id: "1",
    name: "Michael Chen",
    slug: "michael-chen",
    title: "Chief Market Strategist",
    bio: "Michael Chen is a former hedge fund manager who has been teaching stock market strategies for the past 8 years. His expertise includes technical analysis, market psychology, and risk management. Michael's students have consistently outperformed the market using his proven strategies.",
    longBio: `
      With over 15 years of experience on Wall Street, Michael Chen has developed a deep understanding of market dynamics and trading strategies. He began his career as an analyst at a major investment bank before moving to a hedge fund where he managed a portfolio worth over $500 million.

      In 2015, Michael decided to share his knowledge and experience with aspiring traders and investors. Since then, he has taught over 15,000 students from more than 120 countries. His teaching philosophy focuses on practical, actionable strategies that students can implement immediately.

      Michael holds an MBA from Harvard Business School and is a Chartered Financial Analyst (CFA). He has been featured in financial publications such as The Wall Street Journal, Bloomberg, and CNBC.

      When he's not teaching or trading, Michael enjoys hiking, photography, and spending time with his family.
    `,
    avatar: "/placeholder.svg?height=400&width=400",
    expertise: ["Technical Analysis", "Market Psychology", "Risk Management", "Swing Trading"],
    rating: 4.9,
    reviews: 342,
    courses: 12,
    students: 15000,
    website: "https://michaelchen.com",
    email: "michael@stockedu.com",
    social: {
      twitter: "https://twitter.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      facebook: "https://facebook.com/michaelchen",
    },
  }
}

export default async function InstructorDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const instructorData = await getInstructorBySlug(slug)
  // In a real app, you would fetch the instructor data based on the slug
  // For this example, we'll use a mock instructor
  const instructor = {
    id: "1",
    name: "Michael Chen",
    slug: "michael-chen",
    title: "Chief Market Strategist",
    bio: "Michael Chen is a former hedge fund manager who has been teaching stock market strategies for the past 8 years. His expertise includes technical analysis, market psychology, and risk management. Michael's students have consistently outperformed the market using his proven strategies.",
    longBio: `
      With over 15 years of experience on Wall Street, Michael Chen has developed a deep understanding of market dynamics and trading strategies. He began his career as an analyst at a major investment bank before moving to a hedge fund where he managed a portfolio worth over $500 million.

      In 2015, Michael decided to share his knowledge and experience with aspiring traders and investors. Since then, he has taught over 15,000 students from more than 120 countries. His teaching philosophy focuses on practical, actionable strategies that students can implement immediately.

      Michael holds an MBA from Harvard Business School and is a Chartered Financial Analyst (CFA). He has been featured in financial publications such as The Wall Street Journal, Bloomberg, and CNBC.

      When he's not teaching or trading, Michael enjoys hiking, photography, and spending time with his family.
    `,
    avatar: "/placeholder.svg?height=400&width=400",
    expertise: ["Technical Analysis", "Market Psychology", "Risk Management", "Swing Trading"],
    rating: 4.9,
    reviews: 342,
    courses: 12,
    students: 15000,
    website: "https://michaelchen.com",
    email: "michael@stockedu.com",
    social: {
      twitter: "https://twitter.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      facebook: "https://facebook.com/michaelchen",
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Instructor Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg">
            <Image src="/placeholder.svg?height=400&width=400" alt={instructor.name} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{instructor.name}</h1>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{instructor.rating}</span>
                  <span className="text-muted-foreground">({instructor.reviews} reviews)</span>
                </div>
              </div>
              <p className="mt-1 text-xl text-muted-foreground">{instructor.title}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{instructor.courses} Courses</p>
                    <p className="text-xs text-muted-foreground">Including 3 bestsellers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{instructor.students.toLocaleString()}+ Students</p>
                    <p className="text-xs text-muted-foreground">From 120+ countries</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Follow</Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Link href={instructor.website} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Website</span>
                </Button>
              </Link>
              <Link href={instructor.social.twitter} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href={instructor.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href={instructor.social.facebook} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Instructor Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About {instructor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="whitespace-pre-line">{instructor.longBio}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Courses by {instructor.name}</CardTitle>
                <CardDescription>Browse all courses created by this instructor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                        {course.isBestseller && <Badge className="absolute left-2 top-2">Bestseller</Badge>}
                      </div>
                      <CardHeader className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                        <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-medium">{course.rating}</span>
                            <span className="text-xs text-muted-foreground">({course.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lessons} lessons</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <div className="flex w-full items-center justify-between">
                          <div className="font-medium">${course.price}</div>
                          <Link href={`/courses/${course.id}`} passHref>
                            <Button size="sm">View Course</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Courses
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="webinars" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webinars by {instructor.name}</CardTitle>
                <CardDescription>Upcoming and past webinars hosted by this instructor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {instructorWebinars.map((webinar) => (
                    <Card key={webinar.id} className="flex flex-col">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={webinar.image || "/placeholder.svg"}
                          alt={webinar.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                        {webinar.status === "upcoming" && <Badge className="absolute left-2 top-2">Upcoming</Badge>}
                        {webinar.status === "past" && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge className="bg-primary hover:bg-primary">Recording Available</Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{webinar.date}</span>
                        </div>
                        <CardTitle className="line-clamp-1 mt-2">{webinar.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{webinar.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="border-t bg-muted/50 px-6 py-3">
                        <Link href={`/webinars/${webinar.id}`} passHref className="w-full">
                          <Button className="w-full" variant={webinar.status === "past" ? "outline" : "default"}>
                            {webinar.status === "upcoming" ? "Register Now" : "Watch Recording"}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Webinars
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <span className="font-medium">{instructor.rating} instructor rating</span>
                    <span className="text-muted-foreground">• {instructor.reviews} reviews</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {instructorReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.course && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>Course: {review.course}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const instructorData = await getInstructorBySlug(slug)
  // Rest of the function remains the same
}

// Sample data
const instructorCourses = [
  {
    id: "1",
    title: "Technical Analysis Masterclass",
    description: "Learn how to read charts, identify patterns, and make profitable trading decisions.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Technical Analysis",
    level: "Intermediate",
    lessons: 24,
    price: 199,
    rating: 4.8,
    reviews: 342,
    isBestseller: true,
  },
  {
    id: "2",
    title: "Market Psychology: Understanding Crowd Behavior",
    description: "Discover how market psychology affects price movements and learn to profit from crowd behavior.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Trading Psychology",
    level: "All Levels",
    lessons: 18,
    price: 149,
    rating: 4.7,
    reviews: 215,
    isBestseller: false,
  },
  {
    id: "3",
    title: "Risk Management for Traders",
    description: "Master essential risk management techniques to protect your capital and maximize returns.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Risk Management",
    level: "Beginner",
    lessons: 20,
    price: 179,
    rating: 4.9,
    reviews: 189,
    isBestseller: false,
  },
]

const instructorWebinars = [
  {
    id: "1",
    title: "Market Outlook 2023: Opportunities and Risks",
    description: "A comprehensive analysis of market trends and potential investment opportunities.",
    date: "June 15, 2023 • 7:00 PM EST",
    image: "/placeholder.svg?height=200&width=300",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Technical Analysis: Advanced Chart Patterns",
    description: "Master complex chart patterns to identify high-probability trading setups.",
    date: "May 20, 2023 • 7:00 PM EST",
    image: "/placeholder.svg?height=200&width=300",
    status: "past",
  },
  {
    id: "3",
    title: "Risk Management Essentials",
    description: "Learn the core principles of risk management that every trader should follow.",
    date: "April 15, 2023 • 6:30 PM EST",
    image: "/placeholder.svg?height=200&width=300",
    status: "past",
  },
]

const instructorReviews = [
  {
    id: "1",
    name: "Jennifer Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "May 15, 2023",
    comment:
      "Michael's Technical Analysis Masterclass completely transformed my trading. His explanations are clear and the strategies are practical. I'm now consistently profitable thanks to his teachings.",
    course: "Technical Analysis Masterclass",
  },
  {
    id: "2",
    name: "Robert Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "April 28, 2023",
    comment:
      "The Risk Management course was exactly what I needed. Michael breaks down complex concepts into simple, actionable steps. This course should be mandatory for all traders!",
    course: "Risk Management for Traders",
  },
  {
    id: "3",
    name: "Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "April 10, 2023",
    comment:
      "Great insights into market psychology. The webinar was informative and Michael answered all my questions. Would definitely recommend his courses to anyone serious about trading.",
    course: "Market Psychology: Understanding Crowd Behavior",
  },
]
