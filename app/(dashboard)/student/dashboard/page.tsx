"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BookOpen, Calendar } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StudentProgressTracker } from "@/components/student-progress-tracker"
import { CourseProgress } from "@/components/course-progress"

export default function StudentDashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/student")
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchDashboardData()
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Welcome to your dashboard</h2>
        <p className="text-muted-foreground mb-4">Your dashboard is being set up. Please check back later.</p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "Student"}! Here's your learning progress.
        </p>
      </div>

      <StudentProgressTracker />

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="webinars">Upcoming Webinars</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.enrolledCourses.length > 0 ? (
              dashboardData.enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                      alt={course.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <CourseProgress courseId={course.id} showHeader={false} showDetails={false} />
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.slug}/learn`}>Continue Learning</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-2 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="webinars" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.upcomingWebinars.length > 0 ? (
              dashboardData.upcomingWebinars.map((webinar) => (
                <Card key={webinar.id}>
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={webinar.thumbnail || "/placeholder.svg?height=200&width=400"}
                      alt={webinar.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{webinar.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{webinar.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(webinar.startDate).toLocaleDateString()} at{" "}
                        {new Date(webinar.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/webinars/${webinar.slug}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="mb-2 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No webinars scheduled yet</h3>
                <p className="text-muted-foreground mb-4">Stay tuned for upcoming webinars</p>
                <Button asChild>
                  <Link href="/webinars">Browse Webinars</Link>
                </Button>
              </div>\
            )}
