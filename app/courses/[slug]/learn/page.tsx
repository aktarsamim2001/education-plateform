"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Play,
  CheckCircle,
  Download,
  ThumbsUp,
  BookOpen,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

export default function CourseLearnPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [courseProgress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  // Sample course data - in a real app, fetch this from your API
  const [course, setCourse] = useState({
    id: "course-1",
    title: "Technical Analysis Masterclass",
    description: "Learn the art and science of technical analysis to make better trading decisions",
    instructor: {
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
    },
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
            type: "video",
            completed: true,
          },
          {
            id: "lesson-2",
            title: "Chart Types and Timeframes",
            description: "Understand different chart types and how to choose the right timeframe",
            duration: 60,
            type: "video",
            completed: false,
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
            type: "video",
            completed: false,
          },
          {
            id: "lesson-4",
            title: "Trend Lines and Channels",
            description: "Learn how to draw and use trend lines and channels",
            duration: 65,
            type: "video",
            completed: false,
          },
          {
            id: "lesson-5",
            title: "Moving Averages",
            description: "Understand how to use moving averages in your analysis",
            duration: 55,
            type: "video",
            completed: false,
          },
        ],
      },
      {
        id: "module-3",
        title: "Advanced Techniques",
        lessons: [
          {
            id: "lesson-6",
            title: "Fibonacci Retracement",
            description: "Learn how to use Fibonacci retracement levels",
            duration: 70,
            type: "video",
            completed: false,
          },
          {
            id: "lesson-7",
            title: "Elliott Wave Theory",
            description: "Introduction to Elliott Wave Theory and its applications",
            duration: 80,
            type: "video",
            completed: false,
          },
          {
            id: "lesson-8",
            title: "Final Quiz",
            description: "Test your knowledge of technical analysis",
            duration: 30,
            type: "quiz",
            completed: false,
          },
        ],
      },
    ],
  })

  // Flatten lessons for easier navigation
  const allLessons = course.modules.flatMap((module) => module.lessons)
  const currentLesson = allLessons[currentLessonIndex]

  useEffect(() => {
    // In a real app, fetch course data and user progress
    setTimeout(() => {
      setLoading(false)

      // Calculate progress
      const completedLessons = allLessons.filter((lesson) => lesson.completed).length
      const progressPercentage = Math.round((completedLessons / allLessons.length) * 100)
      setProgress(progressPercentage)
    }, 1000)
  }, [])

  const markLessonComplete = () => {
    // Update the current lesson's completed status
    const updatedModules = [...course.modules]
    let lessonFound = false

    for (const module of updatedModules) {
      for (const lesson of module.lessons) {
        if (lesson.id === currentLesson.id) {
          lesson.completed = true
          lessonFound = true
          break
        }
      }
      if (lessonFound) break
    }

    setCourse({ ...course, modules: updatedModules })

    // Recalculate progress
    const completedLessons = allLessons.filter((lesson) => lesson.completed).length
    const progressPercentage = Math.round((completedLessons / allLessons.length) * 100)
    setProgress(progressPercentage)

    toast({
      title: "Progress saved",
      description: "Your progress has been updated.",
    })

    // In a real app, send this to your API
    // fetch(`/api/courses/${params.slug}/complete`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ lessonId: currentLesson.id })
    // })
  }

  const navigateToLesson = (index: number) => {
    if (index >= 0 && index < allLessons.length) {
      setCurrentLessonIndex(index)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-card border-r w-80 flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-20 h-full`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold truncate">{course.title}</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">{courseProgress}%</span>
            </div>
            <Progress value={courseProgress} className="h-2" />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="space-y-2">
                  <h3 className="font-medium text-sm">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <ul className="space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      // Calculate the overall lesson index
                      const overallLessonIndex =
                        course.modules.slice(0, moduleIndex).reduce((acc, m) => acc + m.lessons.length, 0) + lessonIndex

                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => navigateToLesson(overallLessonIndex)}
                            className={`w-full flex items-center text-left p-2 rounded-md text-sm ${
                              currentLessonIndex === overallLessonIndex
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="mr-2 flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-xs">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </div>
                              )}
                            </div>
                            <span className="truncate flex-1">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">{lesson.duration}m</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top navigation */}
        <header className="bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{currentLesson.title}</h1>
              <p className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToLesson(currentLessonIndex - 1)}
              disabled={currentLessonIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToLesson(currentLessonIndex + 1)}
              disabled={currentLessonIndex === allLessons.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </header>

        {/* Lesson content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {currentLesson.type === "video" ? (
              <div className="space-y-6">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Button size="icon" className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary">
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-sm font-medium">0:00 / {currentLesson.duration}:00</span>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h2>{currentLesson.title}</h2>
                      <p>{currentLesson.description}</p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <h3>Key Concepts</h3>
                      <ul>
                        <li>Understanding market trends and patterns</li>
                        <li>Identifying support and resistance levels</li>
                        <li>Using technical indicators effectively</li>
                        <li>Developing a trading strategy based on technical analysis</li>
                      </ul>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          Report an issue
                        </Button>
                      </div>
                      <Button onClick={markLessonComplete}>
                        {currentLesson.completed ? "Completed" : "Mark as Complete"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h2>Lesson Resources</h2>
                      <p>Download these resources to enhance your learning experience.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Lesson Slides</h4>
                          <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Practice Worksheet</h4>
                          <p className="text-sm text-muted-foreground">PDF • 1.8 MB</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Additional Reading</h4>
                          <p className="text-sm text-muted-foreground">External Link</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h2>Discussion</h2>
                      <p>Join the conversation with other students and the instructor.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="border rounded-lg p-4">
                            <textarea
                              className="w-full resize-none bg-transparent outline-none"
                              rows={3}
                              placeholder="Ask a question or share your thoughts..."
                            ></textarea>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button>Post Comment</Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Sarah Johnson</span>
                              <span className="text-xs text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="mt-1">
                              Great explanation of support and resistance levels. I'm still a bit confused about how to
                              identify them on real-time charts though. Any tips?
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span className="text-xs">12</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 ml-14">
                          <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Michael Johnson</span>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">Instructor</span>
                              <span className="text-xs text-muted-foreground">1 day ago</span>
                            </div>
                            <p className="mt-1">
                              Great question, Sarah! Look for areas where the price has reversed multiple times. These
                              are potential support/resistance zones. I'll cover this more in the next lesson.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span className="text-xs">8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Final Quiz</h2>
                  <p className="mb-6">
                    Test your knowledge of technical analysis with this quiz. You need to score at least 70% to pass.
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Question 1 of 10</h3>
                      <p>Which of the following is NOT a type of chart used in technical analysis?</p>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q1-a" name="q1" className="h-4 w-4" />
                          <label htmlFor="q1-a">Candlestick chart</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q1-b" name="q1" className="h-4 w-4" />
                          <label htmlFor="q1-b">Line chart</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q1-c" name="q1" className="h-4 w-4" />
                          <label htmlFor="q1-c">Spectrum chart</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q1-d" name="q1" className="h-4 w-4" />
                          <label htmlFor="q1-d">Bar chart</label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-medium">Question 2 of 10</h3>
                      <p>What does a bullish engulfing pattern indicate?</p>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q2-a" name="q2" className="h-4 w-4" />
                          <label htmlFor="q2-a">Continuation of a downtrend</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q2-b" name="q2" className="h-4 w-4" />
                          <label htmlFor="q2-b">Potential reversal of a downtrend</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q2-c" name="q2" className="h-4 w-4" />
                          <label htmlFor="q2-c">Continuation of an uptrend</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="q2-d" name="q2" className="h-4 w-4" />
                          <label htmlFor="q2-d">Potential reversal of an uptrend</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline">Previous Question</Button>
                      <Button>Next Question</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
