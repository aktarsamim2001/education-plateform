"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BookOpen, CheckCircle, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function StudentProgressPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/student/progress')
        // const data = await response.json()

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData = {
          overallProgress: 68,
          totalCoursesEnrolled: 5,
          completedCourses: 2,
          totalHoursLearned: 24.5,
          certificatesEarned: 2,
          courseProgress: [
            {
              id: "1",
              title: "Technical Analysis Masterclass",
              progress: 100,
              completedLessons: 24,
              totalLessons: 24,
              lastAccessed: "2023-05-10T14:30:00Z",
              certificate: true,
            },
            {
              id: "2",
              title: "Options Trading Fundamentals",
              progress: 100,
              completedLessons: 18,
              totalLessons: 18,
              lastAccessed: "2023-04-22T09:15:00Z",
              certificate: true,
            },
            {
              id: "3",
              title: "Fundamental Analysis for Long-term Investing",
              progress: 75,
              completedLessons: 15,
              totalLessons: 20,
              lastAccessed: "2023-05-15T16:45:00Z",
              certificate: false,
            },
            {
              id: "4",
              title: "Day Trading Strategies",
              progress: 40,
              completedLessons: 8,
              totalLessons: 20,
              lastAccessed: "2023-05-14T11:20:00Z",
              certificate: false,
            },
            {
              id: "5",
              title: "Risk Management in Trading",
              progress: 25,
              completedLessons: 5,
              totalLessons: 20,
              lastAccessed: "2023-05-16T08:10:00Z",
              certificate: false,
            },
          ],
          weeklyActivity: [
            { day: "Monday", hours: 1.5 },
            { day: "Tuesday", hours: 2.0 },
            { day: "Wednesday", hours: 0.5 },
            { day: "Thursday", hours: 1.0 },
            { day: "Friday", hours: 2.5 },
            { day: "Saturday", hours: 3.0 },
            { day: "Sunday", hours: 1.0 },
          ],
          achievements: [
            { id: "1", title: "First Course Completed", earned: true, date: "2023-04-22T09:15:00Z" },
            { id: "2", title: "5-Day Streak", earned: true, date: "2023-05-15T16:45:00Z" },
            { id: "3", title: "10 Hours of Learning", earned: true, date: "2023-05-10T14:30:00Z" },
            { id: "4", title: "First Certificate", earned: true, date: "2023-04-22T09:15:00Z" },
            { id: "5", title: "5 Courses Enrolled", earned: true, date: "2023-05-16T08:10:00Z" },
            { id: "6", title: "10-Day Streak", earned: false },
            { id: "7", title: "All Quizzes Perfect Score", earned: false },
            { id: "8", title: "50 Hours of Learning", earned: false },
          ],
        }

        setProgressData(mockData)
      } catch (error) {
        console.error("Error fetching progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.overallProgress}%</div>
            <Progress value={progressData.overallProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.completedCourses}/{progressData.totalCoursesEnrolled}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((progressData.completedCourses / progressData.totalCoursesEnrolled) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.totalHoursLearned}</div>
            <p className="text-xs text-muted-foreground">
              {progressData.weeklyActivity.reduce((total, day) => total + day.hours, 0).toFixed(1)} hours this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground">
              {progressData.totalCoursesEnrolled - progressData.certificatesEarned} more available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {progressData.courseProgress.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {course.certificate && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        <span>Certificate Earned</span>
                      </div>
                    )}
                  </div>
                  <CardDescription>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Progress: {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Learning Activity</CardTitle>
              <CardDescription>Hours spent learning each day this week</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end justify-between gap-2 pt-6">
                  {progressData.weeklyActivity.map((day) => (
                    <div key={day.day} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-primary rounded-t-md transition-all duration-500"
                        style={{
                          height: `${(day.hours / 3) * 200}px`,
                          maxHeight: "200px",
                        }}
                      ></div>
                      <div className="text-xs font-medium">{day.day.substring(0, 3)}</div>
                      <div className="text-xs text-muted-foreground">{day.hours}h</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {progressData.achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? "border-primary" : "opacity-70"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {achievement.earned ? (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        <span>Earned</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="mr-1 h-4 w-4" />
                        <span>In Progress</span>
                      </div>
                    )}
                    {achievement.date && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
