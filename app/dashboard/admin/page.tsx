import Image from "next/image"
import { BarChart, BookOpen, DollarSign, FileCheck, LineChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of the platform.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,678</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,567</div>
            <p className="text-xs text-muted-foreground">+350 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue</CardTitle>
          <CardDescription>Revenue trends over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <div className="flex h-full items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Revenue chart visualization would appear here</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Growth and Course Approvals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <div className="flex h-full items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">User growth chart would appear here</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Courses and content awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-md">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center">
                      <p className="font-medium">{item.title}</p>
                      <Badge className="ml-2" variant={item.type === "course" ? "default" : "secondary"}>
                        {item.type === "course" ? "Course" : "Webinar"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>By {item.instructor}</span>
                      <span className="mx-2">•</span>
                      <span>Submitted {item.submittedDate}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Pending Approvals
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity & User Management */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="courses">Course Management</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Latest activities across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex">
                    <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
                      <Image src={activity.userAvatar || "/placeholder.svg"} alt="User" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center">
                    <div className="relative mr-4 h-10 w-10 overflow-hidden rounded-full">
                      <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <p className="font-medium">{user.name}</p>
                        <Badge className="ml-2" variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage All Users
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Manage platform courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center">
                    <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <p className="font-medium">{course.title}</p>
                        <Badge className="ml-2" variant={getStatusBadgeVariant(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>By {course.instructor}</span>
                        <span className="mx-2">•</span>
                        <span>{course.category}</span>
                        <span className="mx-2">•</span>
                        <span>${course.price}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage All Courses
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{stat.name}</p>
                  <p className="text-sm font-medium">{stat.value}</p>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions
function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "Admin":
      return "destructive"
    case "Instructor":
      return "default"
    case "Student":
      return "secondary"
    default:
      return "outline"
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Published":
      return "default"
    case "Draft":
      return "secondary"
    case "Pending":
      return "warning"
    case "Archived":
      return "outline"
    default:
      return "outline"
  }
}

// Sample data
const pendingApprovals = [
  {
    id: "1",
    title: "Advanced Options Strategies",
    type: "course",
    instructor: "Sarah Johnson",
    submittedDate: "2 days ago",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "2",
    title: "Market Outlook 2023",
    type: "webinar",
    instructor: "Michael Chen",
    submittedDate: "3 days ago",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "3",
    title: "Candlestick Patterns Mastery",
    type: "course",
    instructor: "David Williams",
    submittedDate: "5 days ago",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const recentActivity = [
  {
    title: "New Course Published",
    description: "Technical Analysis Masterclass by Michael Chen has been published",
    time: "10 minutes ago",
    userAvatar: "/placeholder.svg?height=48&width=48",
  },
  {
    title: "New Instructor Application",
    description: "John Smith has applied to become an instructor",
    time: "1 hour ago",
    userAvatar: "/placeholder.svg?height=48&width=48",
  },
  {
    title: "Payment Processed",
    description: "$1,245 payment processed for Options Trading Fundamentals",
    time: "3 hours ago",
    userAvatar: "/placeholder.svg?height=48&width=48",
  },
  {
    title: "Course Approval Request",
    description: "Sarah Johnson submitted Advanced Options Strategies for approval",
    time: "Yesterday at 2:30 PM",
    userAvatar: "/placeholder.svg?height=48&width=48",
  },
  {
    title: "User Reported Issue",
    description: "Technical issue reported in Day Trading Strategies course",
    time: "Yesterday at 10:15 AM",
    userAvatar: "/placeholder.svg?height=48&width=48",
  },
]

const users = [
  {
    id: "1",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Robert Garcia",
    email: "robert@example.com",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const courses = [
  {
    id: "1",
    title: "Technical Analysis Masterclass",
    instructor: "Michael Chen",
    category: "Technical Analysis",
    price: 199,
    status: "Published",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "2",
    title: "Options Trading Fundamentals",
    instructor: "Sarah Johnson",
    category: "Options Trading",
    price: 149,
    status: "Published",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "3",
    title: "Advanced Options Strategies",
    instructor: "Sarah Johnson",
    category: "Options Trading",
    price: 249,
    status: "Pending",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "4",
    title: "Day Trading Strategies",
    instructor: "Emily Chen",
    category: "Day Trading",
    price: 229,
    status: "Published",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "5",
    title: "Swing Trading Basics",
    instructor: "David Williams",
    category: "Swing Trading",
    price: 129,
    status: "Draft",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const platformStats = [
  {
    name: "Course Completion Rate",
    value: "68%",
    percentage: 68,
  },
  {
    name: "Student Satisfaction",
    value: "4.7/5",
    percentage: 94,
  },
  {
    name: "Instructor Retention",
    value: "92%",
    percentage: 92,
  },
  {
    name: "Platform Uptime",
    value: "99.9%",
    percentage: 99.9,
  },
  {
    name: "Mobile Usage",
    value: "45%",
    percentage: 45,
  },
]
