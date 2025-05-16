import Link from "next/link"
import Image from "next/image"
import { BookOpen, Search, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InstructorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Our Instructors</h1>
          <p className="text-muted-foreground">
            Learn from industry experts with years of experience in the stock market
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search instructors..." className="w-full pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="popular">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="courses">Most Courses</SelectItem>
                <SelectItem value="students">Most Students</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                <SelectItem value="options">Options Trading</SelectItem>
                <SelectItem value="day">Day Trading</SelectItem>
                <SelectItem value="swing">Swing Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Instructor */}
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="relative aspect-square md:w-1/3 lg:w-1/4">
              <Image src="/placeholder.svg?height=400&width=400" alt="Michael Chen" fill className="object-cover" />
              <Badge className="absolute left-2 top-2 bg-primary hover:bg-primary/90">Featured</Badge>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">Michael Chen</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">4.9</span>
                    <span className="text-muted-foreground">(342 reviews)</span>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Chief Market Strategist with over 15 years of experience in Wall Street
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="mt-4 space-y-4">
                  <p className="text-muted-foreground">
                    Michael Chen is a former hedge fund manager who has been teaching stock market strategies for the
                    past 8 years. His expertise includes technical analysis, market psychology, and risk management.
                    Michael's students have consistently outperformed the market using his proven strategies.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">12 Courses</p>
                        <p className="text-xs text-muted-foreground">Including 3 bestsellers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">15,000+ Students</p>
                        <p className="text-xs text-muted-foreground">From 120+ countries</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Technical Analysis</Badge>
                    <Badge variant="secondary">Market Psychology</Badge>
                    <Badge variant="secondary">Risk Management</Badge>
                    <Badge variant="secondary">Swing Trading</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-4">
                <Link href="/instructors/michael-chen" passHref>
                  <Button>View Profile</Button>
                </Link>
              </CardFooter>
            </div>
          </div>
        </Card>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={instructor.avatar || "/placeholder.svg"}
                  alt={instructor.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{instructor.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{instructor.rating}</span>
                  </div>
                </div>
                <CardDescription>{instructor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{instructor.courses} courses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{instructor.students} students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link href={`/instructors/${instructor.slug}`} passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Previous page</span>
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
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            3
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Next page</span>
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
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>

        {/* Become an Instructor */}
        <div className="mt-8 rounded-lg bg-muted p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold">Become an Instructor</h2>
            <p className="max-w-[600px] text-muted-foreground">
              Share your stock market expertise with thousands of students worldwide. Create courses, host webinars, and
              earn income while helping others succeed.
            </p>
            <Link href="/become-instructor" passHref>
              <Button size="lg">Apply Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const instructors = [
  {
    id: "1",
    name: "Sarah Johnson",
    slug: "sarah-johnson",
    title: "Options Trading Expert",
    bio: "Former Wall Street options trader with 12+ years of experience. Sarah specializes in teaching complex options strategies in a simple, easy-to-understand manner.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Options Trading", "Risk Management", "Income Strategies"],
    rating: 4.8,
    courses: 8,
    students: 12500,
  },
  {
    id: "2",
    name: "David Williams",
    slug: "david-williams",
    title: "Technical Analysis Specialist",
    bio: "Certified Technical Analyst with over 10 years of trading experience. David's approach combines classic chart patterns with modern indicators for high-probability setups.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Technical Analysis", "Chart Patterns", "Indicators"],
    rating: 4.9,
    courses: 10,
    students: 18200,
  },
  {
    id: "3",
    name: "Jennifer Lee",
    slug: "jennifer-lee",
    title: "Portfolio Manager",
    bio: "Former portfolio manager at a top investment firm. Jennifer teaches fundamental analysis and long-term investment strategies for building wealth in the stock market.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Fundamental Analysis", "Value Investing", "Portfolio Management"],
    rating: 4.7,
    courses: 6,
    students: 9800,
  },
  {
    id: "4",
    name: "Robert Garcia",
    slug: "robert-garcia",
    title: "Trading Psychologist",
    bio: "PhD in Behavioral Finance with a focus on trading psychology. Robert helps traders overcome emotional biases and develop the mental discipline needed for consistent profits.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Trading Psychology", "Behavioral Finance", "Risk Management"],
    rating: 4.8,
    courses: 5,
    students: 7500,
  },
  {
    id: "5",
    name: "Emily Chen",
    slug: "emily-chen",
    title: "Day Trading Coach",
    bio: "Full-time day trader who has been consistently profitable for over 8 years. Emily teaches actionable day trading strategies for both beginners and experienced traders.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Day Trading", "Scalping", "Momentum Trading"],
    rating: 4.9,
    courses: 7,
    students: 14300,
  },
  {
    id: "6",
    name: "Alex Rodriguez",
    slug: "alex-rodriguez",
    title: "Algorithmic Trading Expert",
    bio: "Computer scientist and quantitative trader. Alex specializes in teaching algorithmic trading strategies and how to automate your trading using programming.",
    avatar: "/placeholder.svg?height=300&width=300",
    expertise: ["Algorithmic Trading", "Quantitative Analysis", "Programming"],
    rating: 4.6,
    courses: 4,
    students: 5200,
  },
]
