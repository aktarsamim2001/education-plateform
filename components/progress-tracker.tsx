"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Lesson {
  id: string
  title: string
  duration: number
  isCompleted: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface ProgressTrackerProps {
  courseId: string
  modules: Module[]
  onComplete: () => void
}

export function ProgressTracker({ courseId, modules, onComplete }: ProgressTrackerProps) {
  const [progress, setProgress] = useState(0)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const { toast } = useToast()

  // Calculate total lessons and completed lessons
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter((lesson) => lesson.isCompleted).length,
    0,
  )

  useEffect(() => {
    // Calculate progress percentage
    const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    setProgress(calculatedProgress)
  }, [completedLessons, totalLessons])

  const markLessonComplete = async (moduleId: string, lessonId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update progress")
      }

      // Update local state
      const updatedModules = modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return { ...lesson, isCompleted: true }
              }
              return lesson
            }),
          }
        }
        return module
      })

      // Update modules state (this would be handled by the parent component in a real implementation)
      // setModules(updatedModules)

      toast({
        title: "Progress updated",
        description: "Your progress has been saved.",
      })

      // Check if course is complete
      const newCompletedLessons = updatedModules.reduce(
        (acc, module) => acc + module.lessons.filter((lesson) => lesson.isCompleted).length,
        0,
      )

      if (newCompletedLessons === totalLessons) {
        onComplete()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your course completion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Course Completion</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedLessons} of {totalLessons} lessons completed
            </span>
            <span>
              {progress === 100 ? (
                <span className="flex items-center text-green-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Complete
                </span>
              ) : (
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> In Progress
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {modules.map((module) => {
            const moduleCompletedLessons = module.lessons.filter((lesson) => lesson.isCompleted).length
            const moduleProgress = Math.round((moduleCompletedLessons / module.lessons.length) * 100)

            return (
              <div key={module.id} className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center">
                    {moduleProgress === 100 ? (
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{module.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {moduleCompletedLessons}/{module.lessons.length}
                    </span>
                    <Progress value={moduleProgress} className="h-2 w-16" />
                  </div>
                </div>

                {expandedModule === module.id && (
                  <div className="ml-6 space-y-1 border-l pl-4">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                          {!lesson.isCompleted && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                markLessonComplete(module.id, lesson.id)
                              }}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        {progress === 100 ? (
          <Button className="w-full" disabled>
            Course Completed
          </Button>
        ) : (
          <Button className="w-full" onClick={onComplete}>
            Continue Learning
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
