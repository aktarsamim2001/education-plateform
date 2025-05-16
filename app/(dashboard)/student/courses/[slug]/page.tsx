"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Play, FileText, Download, Clock } from "lucide-react"

// Update the params handling in all dynamic route pages
export default async function StudentCourseDetailPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  // const courseData = await getCourseBySlug(slug)
  // Rest of the component remains the same
  const { toast } = useToast()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${slug}`)
        if (!courseRes.ok) throw new Error("Failed to fetch course")
        const courseData = await courseRes.json()

        // Fetch course progress
        const progressRes = await fetch(`/api/courses/${slug}/progress`)
        let progressData = null
        if (progressRes.ok) {
          progressData = await progressRes.json()
        }

        setCourse(courseData.course)
        setProgress(progressData?.progress || { progress: 0, completedLessons: [] })

        // Set current lesson (either last accessed or first lesson)
        if (progressData?.progress?.lastAccessedLesson) {
          const lesson = findLessonById(courseData.course, progressData.progress.lastAccessedLesson)
          setCurrentLesson(lesson)
        } else if (courseData.course.lessons && courseData.course.lessons.length > 0) {
          setCurrentLesson(courseData.course.lessons[0])
        }
      } catch (error) {
        console.error("Error fetching course data:", error)
        toast({
          title: "Error",
          description: "Failed to load course data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseAndProgress()
  }, [slug, toast])

  const findLessonById = (course, lessonId) => {
    if (!course || !course.lessons) return null
    return course.lessons.find((lesson) => lesson.id === lessonId)
  }

  const handleLessonClick = async (lesson) => {
    setCurrentLesson(lesson)

    // Mark lesson as completed
    try {
      const res = await fetch(`/api/courses/${slug}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId: lesson.id }),
      })

      if (res.ok) {
        const data = await res.json()
        setProgress(data.progress)
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p>The requested course could not be found or you don't have access to it.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.shortDescription}</p>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={progress.progress} className="w-32" />
            <span className="text-sm font-medium">{progress.progress}% Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.lessons?.length || 0} lessons • {course.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {course.lessons?.map((lesson, index) => (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      className={`w-full justify-start rounded-none border-l-2 px-4 py-3 font-normal ${
                        currentLesson?.id === lesson.id ? "border-l-primary bg-muted" : "border-l-transparent"
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-shrink-0">
                          {progress.completedLessons?.includes(lesson.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow text-left">
                          <div className="text-sm font-medium">{lesson.title}</div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{lesson.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            {currentLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>{currentLesson.title}</CardTitle>
                  <CardDescription>
                    Lesson {course.lessons.findIndex((l) => l.id === currentLesson.id) + 1} of {course.lessons.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="video">
                    <TabsList>
                      <TabsTrigger value="video">
                        <Play className="mr-2 h-4 w-4" />
                        Video
                      </TabsTrigger>
                      <TabsTrigger value="content">
                        <FileText className="mr-2 h-4 w-4" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="resources">
                        <Download className="mr-2 h-4 w-4" />
                        Resources
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="space-y-4">
                      {currentLesson.videoUrl ? (
                        <div className="aspect-video overflow-hidden rounded-lg">
                          <iframe
                            src={currentLesson.videoUrl}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                          <p className="text-muted-foreground">No video available for this lesson</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="content" className="space-y-4">
                      <div className="prose max-w-none dark:prose-invert">
                        {currentLesson.content ? (
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }}></div>
                        ) : (
                          <p>No content available for this lesson</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="resources" className="space-y-4">
                      {currentLesson.resources && currentLesson.resources.length > 0 ? (
                        <div className="space-y-2">
                          {currentLesson.resources.map((resource, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md border p-3">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{resource.title}</p>
                                  <p className="text-xs text-muted-foreground">{resource.type}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  Download
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No resources available for this lesson</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
