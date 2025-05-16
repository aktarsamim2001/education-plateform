"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { BookOpen, CheckCircle, Clock, Award, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"

interface StudentProgressTrackerProps {
  courseId?: string
  studentId?: string
  showHeader?: boolean
  showTabs?: boolean
  defaultTab?: string
  className?: string
}

export function StudentProgressTracker({
  courseId,
  studentId,
  showHeader = true,
  showTabs = true,
  defaultTab = "overview",
  className = "",
}: StudentProgressTrackerProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [progressData, setProgressData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true)

        // Determine the API endpoint based on props and user role
        let endpoint = "/api/student/progress"

        if (session?.user.role === "admin" || session?.user.role === "instructor") {
          endpoint = studentId
            ? `/api/admin/analytics/student-progress/${studentId}`
            : "/api/admin/analytics/student-progress"

          if (courseId) {
            endpoint += `?courseId=${courseId}`
          }
        } else if (courseId) {
          endpoint += `?courseId=${courseId}`
        }

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error("Failed to fetch progress data")
        }

        const data = await response.json()
        setProgressData(studentId ? data.student : data)
      } catch (error) {
        console.error("Error fetching progress data:", error)
        setError("Failed to load progress data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchProgressData()
    }
  }, [session, courseId, studentId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No progress data available.</p>
      </div>
    )
  }

  // For a single course view
  if (courseId) {
    const courseProgress = progressData.courseProgress?.find((course: any) => course.courseId === courseId) || {
      progress: 0,
      lastAccessed: new Date().toISOString(),
      timeSpent: 0,
    }

    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <p className="text-sm text-muted-foreground">Track your learning journey</p>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm font-medium">{courseProgress.progress}%</span>
                </div>
                <Progress value={courseProgress.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Time Spent</p>
                    <p className="text-muted-foreground">
                      {Math.floor(courseProgress.timeSpent / 60)}h {courseProgress.timeSpent % 60}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Last Accessed</p>
                    <p className="text-muted-foreground">
                      {format(new Date(courseProgress.lastAccessed), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // For overall progress view
  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Learning Progress</h3>
          <p className="text-sm text-muted-foreground">Track your learning journey</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.overallProgress}%</div>
            <Progress value={progressData.overallProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.completedCourses}/{progressData.enrolledCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((progressData.completedCourses / progressData.enrolledCourses) * 100) || 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(progressData.totalTimeSpent / 60)}h {progressData.totalTimeSpent % 60}m
            </div>
            <p className="text-xs text-muted-foreground">
              Avg. {Math.round(progressData.totalTimeSpent / progressData.enrolledCourses)} min per course
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.quizScores?.average || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {progressData.quizScores?.passed || 0}/{progressData.quizScores?.total || 0} quizzes passed
            </p>
          </CardContent>
        </Card>
      </div>

      {showTabs && (
        <Tabs defaultValue={defaultTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Your progress across all enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.courseProgress?.map((course: any) => (
                    <div key={course.courseId} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{course.courseTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last accessed: {format(new Date(course.lastAccessed), "PPP")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{course.progress}%</div>
                          <Progress value={course.progress} className="w-[100px]" />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m spent
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.progress === 100 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-500">Completed</span>
                            </>
                          ) : course.progress > 0 ? (
                            <>
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-blue-500">In Progress</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-amber-500">Not Started</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>Your performance on course quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.quizScores?.total > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                      <div>Quiz</div>
                      <div>Course</div>
                      <div>Score</div>
                      <div>Status</div>
                      <div>Date</div>
                    </div>
                    <div className="divide-y">
                      {/* This would be populated with actual quiz data in a real implementation */}
                      <div className="grid grid-cols-5 px-4 py-3">
                        <div>Technical Analysis Basics</div>
                        <div>Technical Analysis Masterclass</div>
                        <div>85%</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Passed
                          </Badge>
                        </div>
                        <div>May 15, 2023</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No quiz attempts yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your learning activities in the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {progressData.activityByDay?.some((day: any) => day.timeSpent > 0 || day.lessonsCompleted > 0) ? (
                  <div className="space-y-8">
                    {progressData.activityByDay
                      .filter((day: any) => day.timeSpent > 0 || day.lessonsCompleted > 0)
                      .slice(0, 5)
                      .map((activity: any, index: number) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            {index < 4 && <div className="h-full w-px bg-border" />}
                          </div>
                          <div className="space-y-1 pb-8">
                            <p className="text-sm text-muted-foreground">{format(new Date(activity.date), "PPP")}</p>
                            <h4 className="font-semibold">Learning Session</h4>
                            <p>
                              Spent {Math.floor(activity.timeSpent / 60)}h {activity.timeSpent % 60}m learning
                              {activity.lessonsCompleted > 0 && ` and completed ${activity.lessonsCompleted} lessons`}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No recent activity.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
