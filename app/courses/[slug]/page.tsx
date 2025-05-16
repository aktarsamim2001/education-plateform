import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, BookOpen, Award, CheckCircle, Star, Users, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import RazorpayPayment from "@/components/razorpay-payment"

async function getCourseBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch course")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const courseData = await getCourseBySlug(slug)
  const course = courseData?.course

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    }
  }

  return {
    title: `${course.title} | Stock Market Education`,
    description: course.shortDescription,
    openGraph: {
      title: `${course.title} | Stock Market Education`,
      description: course.shortDescription,
      images: [{ url: course.thumbnail }],
    },
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const courseData = await getCourseBySlug(slug)
  const course = courseData?.course || {
    id: "sample-course",
    title: "Technical Analysis Masterclass",
    slug: "technical-analysis-masterclass",
    shortDescription: "Learn the art and science of technical analysis to make better trading decisions",
    description:
      "This comprehensive course covers all aspects of technical analysis, from basic chart patterns to advanced indicators. You'll learn how to identify trends, spot reversals, and make profitable trading decisions based on technical signals.",
    category: "Technical Analysis",
    level: "intermediate",
    price: 199,
    discountPrice: 149,
    thumbnail: "/placeholder.svg?height=400&width=600",
    instructorId: "instructor-1",
    instructor: {
      name: "Michael Johnson",
      title: "Senior Market Analyst",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Michael is a professional trader with over 15 years of experience in the financial markets. He specializes in technical analysis and has helped thousands of students become successful traders.",
      rating: 4.8,
      students: 15234,
      courses: 12,
    },
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Technical Analysis",
        description: "Learn the fundamentals of technical analysis and why it works",
        duration: 45,
        isPreview: true,
        order: 1,
      },
      {
        id: "lesson-2",
        title: "Chart Types and Timeframes",
        description: "Understand different chart types and how to choose the right timeframe",
        duration: 60,
        isPreview: false,
        order: 2,
      },
      {
        id: "lesson-3",
        title: "Support and Resistance",
        description: "Master the concepts of support and resistance levels",
        duration: 75,
        isPreview: false,
        order: 3,
      },
    ],
    modules: [
      {
        id: "module-1",
        title: "Foundations of Technical Analysis",
        lessons: [
          {
            id: "lesson-1",
            title: "Introduction to Technical Analysis",
            description: "Learn the fundamentals of technical analysis and why it works",
            duration: 45,
            isPreview: true,
            order: 1,
          },
          {
            id: "lesson-2",
            title: "Chart Types and Timeframes",
            description: "Understand different chart types and how to choose the right timeframe",
            duration: 60,
            isPreview: false,
            order: 2,
          },
        ],
      },
      {
        id: "module-2",
        title: "Chart Patterns and Indicators",
        lessons: [
          {
            id: "lesson-3",
            title: "Support and Resistance",
            description: "Master the concepts of support and resistance levels",
            duration: 75,
            isPreview: false,
            order: 3,
          },
          {
            id: "lesson-4",
            title: "Trend Lines and Channels",
            description: "Learn how to draw and use trend lines and channels",
            duration: 65,
            isPreview: false,
            order: 4,
          },
        ],
      },
    ],
    requirements: [
      "Basic understanding of stock markets",
      "Trading account (demo or real)",
      "Charting software (recommendations provided in the course)",
    ],
    objectives: [
      "Understand the principles of technical analysis",
      "Identify and interpret chart patterns",
      "Use technical indicators effectively",
      "Develop a trading strategy based on technical analysis",
      "Manage risk using technical tools",
    ],
    rating: 4.8,
    reviews: 342,
    students: 3245,
    duration: "10 hours",
    status: "published",
    isFeatured: true,
    isBestseller: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-05-20"),
  }

  if (!course && !courseData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{course.title}</span>
        </nav>

        {/* Course Header */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
              {course.isBestseller && <Badge className="bg-yellow-500 hover:bg-yellow-600">Bestseller</Badge>}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="flex items-center mr-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                      />
                    ))}
                </div>
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground ml-1">({course.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course.students} students</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={course.instructor?.avatar || "/placeholder.svg"}
                  alt={course.instructor?.name || "Instructor"}
                />
                <AvatarFallback>{course.instructor?.name?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Created by{" "}
                  <Link href={`/instructors/${course.instructorId}`} className="text-primary hover:underline">
                    {course.instructor?.name || "Instructor Name"}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  Last updated {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image src={course.thumbnail || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">${course.discountPrice || course.price}</div>
                  {course.discountPrice && (
                    <div className="text-lg text-muted-foreground line-through">${course.price}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <RazorpayPayment
                    itemId={course.id}
                    itemType="course"
                    amount={(course.discountPrice || course.price) * 100}
                    name={course.title}
                    description={`Enrollment for ${course.title}`}
                    buttonText="Enroll Now"
                    buttonClassName="w-full"
                  />

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout?courseId=${course.id}&title=${encodeURIComponent(course.title)}&price=${course.discountPrice || course.price}&image=${encodeURIComponent(course.thumbnail || "/placeholder.svg")}`}
                    passHref
                  >
                    <Button variant="outline" className="w-full">
                      Buy Now
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground">30-Day Money-Back Guarantee</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">This course includes:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.lessons?.length || 0} lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration} total</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <h2>About This Course</h2>
              <p>{course.description}</p>

              <h3>What You'll Learn</h3>
              <ul>
                {course.objectives?.map((objective: string, index: number) => <li key={index}>{objective}</li>) || (
                  <>
                    <li>Understand stock market fundamentals</li>
                    <li>Learn technical analysis techniques</li>
                    <li>Develop effective trading strategies</li>
                  </>
                )}
              </ul>

              <h3>Requirements</h3>
              <ul>
                {course.requirements?.map((requirement: string, index: number) => (
                  <li key={index}>{requirement}</li>
                )) || (
                  <>
                    <li>No prior knowledge required</li>
                    <li>Basic understanding of finance is helpful</li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <div className="text-sm text-muted-foreground mb-4">
                {course.lessons?.length || 0} lessons • {course.duration} total length
              </div>

              <div className="space-y-2">
                {course.modules?.map((module: any, moduleIndex: number) => (
                  <div key={module.id || moduleIndex} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/50 font-medium">
                      Module {moduleIndex + 1}: {module.title}
                    </div>
                    <div className="divide-y">
                      {module.lessons?.map((lesson: any, lessonIndex: number) => (
                        <div key={lesson.id || lessonIndex} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                              </span>
                              {lesson.isPreview && <Badge variant="outline">Preview</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">{lesson.duration} min</div>
                          </div>
                          {lesson.description && (
                            <div className="mt-1 text-sm text-muted-foreground">{lesson.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={course.instructor?.avatar || "/placeholder.svg"}
                  alt={course.instructor?.name || "Instructor"}
                />
                <AvatarFallback>{course.instructor?.name?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{course.instructor?.name || "Instructor Name"}</h2>
                <p className="text-muted-foreground">{course.instructor?.title || "Stock Market Expert"}</p>

                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.instructor?.rating || 4.8} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor?.students || 10245} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.instructor?.courses || 15} Courses</span>
                  </div>
                </div>

                <div className="mt-4 prose max-w-none dark:prose-invert">
                  <p>
                    {course.instructor?.bio ||
                      "Experienced stock market professional with expertise in technical analysis and trading strategies."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Student Reviews</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold">{course.rating}</div>
                  <div className="flex items-center my-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Course Rating</div>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage = Math.round(Math.random() * 100)
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-20">
                          <span>{rating}</span>
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        </div>
                        <Progress value={percentage} className="h-2 flex-1" />
                        <div className="w-12 text-right text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt="Student" />
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Student Name</div>
                          <div className="text-xs text-muted-foreground">2 weeks ago</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j < 5 - i ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                      </div>
                      <p className="text-sm">
                        This course exceeded my expectations and helped me understand complex concepts easily. The
                        instructor explains everything clearly and provides practical examples that are easy to follow.
                      </p>
                    </div>
                  ))}

                <Button variant="outline">Load More Reviews</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Courses */}
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Related Courses</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Related Course"
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <Badge variant="outline" className="mb-2">
                      Technical Analysis
                    </Badge>
                    <h3 className="font-medium line-clamp-2 mb-1">Advanced Chart Patterns for Day Trading</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>8 hours</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm ml-1">4.7</span>
                      </div>
                      <div className="font-medium">$129</div>
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
