"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ArrowLeft, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Download, List, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"

export default function CourseLearnPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [courseData, setCourseData] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/courses/${params.slug}/learn`)
        // const data = await response.json()

        // Simulating API response
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData = {
          id: "1",
          title: "Technical Analysis Masterclass",
          slug: "technical-analysis-masterclass",
          progress: 35,
          instructor: {
            name: "Michael Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          modules: [
            {
              id: "module-1",
              title: "Introduction to Technical Analysis",
              lessons: [
                {
                  id: "lesson-1",
                  title: "What is Technical Analysis?",
                  type: "video",
                  duration: 10,
                  completed: true,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description:
                      "This lesson introduces the concept of technical analysis and its importance in trading.",
                  },
                },
                {
                  id: "lesson-2",
                  title: "History of Technical Analysis",
                  type: "video",
                  duration: 15,
                  completed: true,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description:
                      "Learn about the origins and evolution of technical analysis throughout market history.",
                  },
                },
                {
                  id: "lesson-3",
                  title: "Technical vs Fundamental Analysis",
                  type: "video",
                  duration: 12,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description:
                      "Understand the key differences between technical and fundamental analysis approaches.",
                  },
                },
              ],
            },
            {
              id: "module-2",
              title: "Chart Patterns",
              lessons: [
                {
                  id: "lesson-4",
                  title: "Introduction to Chart Patterns",
                  type: "video",
                  duration: 18,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Learn about the basic chart patterns that form the foundation of technical analysis.",
                  },
                },
                {
                  id: "lesson-5",
                  title: "Support and Resistance",
                  type: "video",
                  duration: 20,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Understand how to identify and use support and resistance levels in your trading.",
                  },
                },
                {
                  id: "lesson-6",
                  title: "Trend Lines",
                  type: "video",
                  duration: 15,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Learn how to draw and use trend lines to identify market direction.",
                  },
                },
                {
                  id: "lesson-7",
                  title: "Chart Patterns Quiz",
                  type: "quiz",
                  duration: 10,
                  completed: false,
                  content: {
                    questions: [
                      {
                        question: "What is a support level?",
                        options: [
                          "A price level where buying pressure exceeds selling pressure",
                          "A price level where selling pressure exceeds buying pressure",
                          "A price level that a stock cannot fall below",
                          "A price level that a stock cannot rise above",
                        ],
                        correctAnswer: 0,
                      },
                      {
                        question: "Which of the following is NOT a chart pattern?",
                        options: ["Head and Shoulders", "Double Top", "Triple Bottom", "Quadruple Divergence"],
                        correctAnswer: 3,
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "module-3",
              title: "Technical Indicators",
              lessons: [
                {
                  id: "lesson-8",
                  title: "Introduction to Indicators",
                  type: "video",
                  duration: 15,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description:
                      "Learn about the various types of technical indicators and how they can enhance your analysis.",
                  },
                },
                {
                  id: "lesson-9",
                  title: "Moving Averages",
                  type: "video",
                  duration: 22,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description: "Understand how to use moving averages to identify trends and potential reversals.",
                  },
                },
                {
                  id: "lesson-10",
                  title: "RSI and MACD",
                  type: "video",
                  duration: 25,
                  completed: false,
                  content: {
                    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    description:
                      "Learn how to use the Relative Strength Index and Moving Average Convergence Divergence indicators.",
                  },
                },
              ],
            },
          ],
          resources: [
            {
              id: "resource-1",
              title: "Technical Analysis Cheat Sheet",
              type: "pdf",
              url: "#",
              size: "2.4 MB",
            },
            {
              id: "resource-2",
              title: "Chart Patterns Reference Guide",
              type: "pdf",
              url: "#",
              size: "3.1 MB",
            },
            {
              id: "resource-3",
              title: "Indicator Settings Guide",
              type: "pdf",
              url: "#",
              size: "1.8 MB",
            },
          ],
          notes: [
            {
              id: "note-1",
              lessonId: "lesson-1",
              content:
                "Remember that technical analysis is based on the study of past market data, primarily price and volume.",
              timestamp: "2023-05-10T14:30:00Z",
            },
            {
              id: "note-2",
              lessonId: "lesson-2",
              content: "Charles Dow was one of the pioneers of technical analysis in the late 1800s.",
              timestamp: "2023-05-10T14:35:00Z",
            },
          ],
        }

        setCourseData(mockData)

        // Find the first incomplete lesson
        let foundIncomplete = false
        let lessonIndex = 0

        mockData.modules.forEach((module) => {
          module.lessons.forEach((lesson) => {
            if (!lesson.completed && !foundIncomplete) {
              setCurrentLessonIndex(lessonIndex)
              foundIncomplete = true
            }
            lessonIndex++
          })
        })
      } catch (error) {
        console.error("Error fetching course data:", error)
        toast({
          title: "Error",
          description: "Failed to load course content. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [params.slug, toast])

  const getAllLessons = () => {
    if (!courseData) return []
    return courseData.modules.flatMap((module) => module.lessons)
  }

  const currentLesson = getAllLessons()[currentLessonIndex] || null

  const markLessonComplete = async () => {
    if (!currentLesson || currentLesson.completed || isCompleting) return

    setIsCompleting(true)
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/courses/${params.slug}/lessons/${currentLesson.id}/complete`, {
      //   method: 'POST'
      // })

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      const updatedCourseData = { ...courseData }
      const allLessons = getAllLessons()
      allLessons[currentLessonIndex].completed = true

      // Calculate new progress
      const completedLessons = allLessons.filter((lesson) => lesson.completed).length
      updatedCourseData.progress = Math.round((completedLessons / allLessons.length) * 100)

      setCourseData(updatedCourseData)

      toast({
        title: "Lesson Completed",
        description: "Your progress has been saved.",
      })

      // Automatically move to next lesson if available
      if (currentLessonIndex < allLessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1)
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error)
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const navigateToLesson = (index) => {
    setCurrentLessonIndex(index)
    setSidebarOpen(false)
  }

  const navigateToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  const navigateToNextLesson = () => {
    const allLessons = getAllLessons()
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
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
            <Link href={`/student/courses/${params.slug}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="hidden md:block">
            <h1 className="text-lg font-medium">{courseData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Instructor: {courseData.instructor.name}</span>
              <span>•</span>
              <span>Progress: {courseData.progress}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)} className="md:hidden">
            <List className="mr-2 h-4 w-4" />
            Lessons
          </Button>
          <Progress value={courseData.progress} className="hidden w-40 md:block" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (visible on larger screens) */}
        <div className="hidden w-80 flex-shrink-0 overflow-y-auto border-r md:block">
          <div className="p-4">
            <h2 className="mb-2 font-semibold">Course Content</h2>
            <div className="text-sm text-muted-foreground">
              {getAllLessons().filter((lesson) => lesson.completed).length} of {getAllLessons().length} lessons
              completed
            </div>
          </div>
          <div className="space-y-1">
            {courseData.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <div className="bg-muted/50 px-4 py-2 font-medium">
                  Module {moduleIndex + 1}: {module.title}
                </div>
                <div>
                  {module.lessons.map((lesson, lessonIndex) => {
                    const globalLessonIndex =
                      courseData.modules.slice(0, moduleIndex).reduce((acc, m) => acc + m.lessons.length, 0) +
                      lessonIndex

                    return (
                      <button
                        key={lesson.id}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/50 ${
                          globalLessonIndex === currentLessonIndex ? "bg-muted" : ""
                        }`}
                        onClick={() => navigateToLesson(globalLessonIndex)}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            lesson.completed ? "border-green-500 bg-green-500 text-white" : "border-muted-foreground"
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs">
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </span>
                          )}
                        </div>
                        <span className="flex-1 truncate">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-xs border-r bg-background shadow-lg">
              <div className="flex items-center justify-between p-4">
                <h2 className="font-semibold">Course Content</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-1">
                {courseData.modules.map((module, moduleIndex) => (
                  <div key={module.id}>
                    <div className="bg-muted/50 px-4 py-2 font-medium">
                      Module {moduleIndex + 1}: {module.title}
                    </div>
                    <div>
                      {module.lessons.map((lesson, lessonIndex) => {
                        const globalLessonIndex =
                          courseData.modules.slice(0, moduleIndex).reduce((acc, m) => acc + m.lessons.length, 0) +
                          lessonIndex

                        return (
                          <button
                            key={lesson.id}
                            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/50 ${
                              globalLessonIndex === currentLessonIndex ? "bg-muted" : ""
                            }`}
                            onClick={() => navigateToLesson(globalLessonIndex)}
                          >
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                lesson.completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span className="text-xs">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                              )}
                            </div>
                            <span className="flex-1 truncate">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground">{lesson.duration} min</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="container mx-auto max-w-4xl px-4 py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentLesson.type === "video" ? "Video" : "Quiz"}</span>
                  <span>•</span>
                  <span>{currentLesson.duration} minutes</span>
                </div>
              </div>

              {/* Lesson Content */}
              {currentLesson.type === "video" ? (
                <div className="space-y-6">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <iframe
                      src={currentLesson.content.videoUrl}
                      className="absolute inset-0 h-full w-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{currentLesson.content.description}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <h3 className="mb-4 text-xl font-semibold">Quiz: {currentLesson.title}</h3>
                    <div className="space-y-6">
                      {currentLesson.content.questions.map((question, qIndex) => (
                        <div key={qIndex} className="space-y-3">
                          <h4 className="font-medium">
                            Question {qIndex + 1}: {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={`q${qIndex}-o${oIndex}`}
                                  name={`question-${qIndex}`}
                                  className="h-4 w-4"
                                />
                                <label htmlFor={`q${qIndex}-o${oIndex}`} className="text-sm">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button className="mt-4">Submit Answers</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button variant="outline" onClick={navigateToPreviousLesson} disabled={currentLessonIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
                {currentLesson.completed ? (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <Button onClick={markLessonComplete} disabled={isCompleting}>
                    {isCompleting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Marking Complete...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={navigateToNextLesson}
                  disabled={currentLessonIndex === getAllLessons().length - 1}
                >
                  Next Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold">No lesson selected</h2>
                <p className="text-muted-foreground">Please select a lesson from the sidebar</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden w-80 flex-shrink-0 overflow-y-auto border-l lg:block">
          <Tabs defaultValue="resources" className="p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="resources" className="mt-4 space-y-4">
              <h3 className="font-medium">Course Resources</h3>
              <div className="space-y-2">
                {courseData.resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-xs text-muted-foreground">{resource.size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Your Notes</h3>
                <Button variant="outline" size="sm">
                  Add Note
                </Button>
              </div>
              <div className="space-y-2">
                {courseData.notes.length > 0 ? (
                  courseData.notes.map((note) => (
                    <div key={note.id} className="rounded-md border p-3">
                      <div className="mb-1 text-sm font-medium">
                        {courseData.modules.flatMap((m) => m.lessons).find((l) => l.id === note.lessonId)?.title}
                      </div>
                      <div className="text-sm">{note.content}</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(note.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">No notes yet. Add your first note!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
