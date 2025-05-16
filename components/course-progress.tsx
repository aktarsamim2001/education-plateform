"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { CheckCircle, Clock, BookOpen, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"

interface CourseProgressProps {
  courseId: string
  showHeader?: boolean
  showDetails?: boolean
  className?: string
}

export function CourseProgress({
  courseId,
  showHeader = true,
  showDetails = true,
  className = "",
}: CourseProgressProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [progressData, setProgressData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`/api/courses/${courseId}/progress`)

        if (!response.ok) {
          throw new Error("Failed to fetch course progress")
        }

        const data = await response.json()
        setProgressData(data.progress)
      } catch (error) {
        console.error("Error fetching course progress:", error)
        setError("Failed to load course progress. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session && courseId) {
      fetchProgressData()
    }
  }, [session, courseId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No progress data available.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Track your progress in this course</CardDescription>
          </CardHeader>
        )}
        <CardContent className={showHeader ? "" : "pt-6"}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{progressData.progress}%</span>
              </div>
              <Progress value={progressData.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Lessons Completed</p>
                  <p className="text-muted-foreground">
                    {progressData.completedLessons.length}/{progressData.totalLessons}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Time Spent</p>
                  <p className="text-muted-foreground">
                    {Math.floor(progressData.timeSpent / 60)}h {progressData.timeSpent % 60}m
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Last Accessed</p>
                  <p className="text-muted-foreground">{format(new Date(progressData.lastAccessed), "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>

            {showDetails && progressData.modules && (
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium">Module Progress</h4>
                <div className="space-y-3">
                  {progressData.modules.map((module: any) => (
                    <div key={module.id} className="rounded-md border p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {module.completedLessons}/{module.totalLessons} lessons completed
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={module.progress} className="w-[100px]" />
                          <span className="text-xs font-medium">{module.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showDetails && progressData.nextLesson && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Continue Learning</h4>
                <Button asChild className="w-full">
                  <a href={`/courses/${courseId}/learn?lesson=${progressData.nextLesson.id}`}>
                    {progressData.nextLesson.title}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
