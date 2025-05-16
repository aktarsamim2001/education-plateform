"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  discountPrice: z.coerce.number().min(0, "Discount price must be a positive number").optional(),
  duration: z.string().min(1, "Duration is required"),
  level: z.string().min(1, "Level is required"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  status: z.string().min(1, "Status is required"),
  objectives: z.array(z.string()).min(1, "At least one learning objective is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  instructorId: z.string().min(1, "Instructor is required"),
})

export default function EditCoursePage() {
  const { slug } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [instructors, setInstructors] = useState([])
  const [modules, setModules] = useState([])
  const [newObjective, setNewObjective] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: 0,
      discountPrice: 0,
      duration: "",
      level: "",
      category: "",
      thumbnail: "",
      isFeatured: false,
      isBestseller: false,
      status: "draft",
      objectives: [],
      requirements: [],
      instructorId: "",
    },
  })

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${slug}`)
        if (!response.ok) throw new Error("Failed to fetch course")

        const data = await response.json()
        const course = data.course

        form.reset({
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription || "",
          price: course.price,
          discountPrice: course.discountPrice || 0,
          duration: course.duration,
          level: course.level,
          category: course.category,
          thumbnail: course.thumbnail,
          isFeatured: course.isFeatured || false,
          isBestseller: course.isBestseller || false,
          status: course.status,
          objectives: course.objectives || [],
          requirements: course.requirements || [],
          instructorId: course.instructorId,
        })

        setModules(course.modules || [])
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error",
          description: "Failed to load course data. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchInstructors = async () => {
      try {
        const response = await fetch("/api/admin/instructors")
        if (!response.ok) throw new Error("Failed to fetch instructors")

        const data = await response.json()
        setInstructors(data.instructors)
      } catch (error) {
        console.error("Error fetching instructors:", error)
      }
    }

    Promise.all([fetchCourse(), fetchInstructors()]).finally(() => setIsLoading(false))
  }, [slug, form, toast])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const courseData = {
        ...data,
        modules,
      }

      const response = await fetch(`/api/courses/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) throw new Error("Failed to update course")

      toast({
        title: "Success",
        description: "Course updated successfully",
      })

      router.push("/dashboard/admin/courses")
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      const currentObjectives = form.getValues("objectives") || []
      form.setValue("objectives", [...currentObjectives, newObjective.trim()])
      setNewObjective("")
    }
  }

  const removeObjective = (index) => {
    const currentObjectives = form.getValues("objectives") || []
    form.setValue(
      "objectives",
      currentObjectives.filter((_, i) => i !== index),
    )
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      const currentRequirements = form.getValues("requirements") || []
      form.setValue("requirements", [...currentRequirements, newRequirement.trim()])
      setNewRequirement("")
    }
  }

  const removeRequirement = (index) => {
    const currentRequirements = form.getValues("requirements") || []
    form.setValue(
      "requirements",
      currentRequirements.filter((_, i) => i !== index),
    )
  }

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: `temp-${Date.now()}`,
        title: "New Module",
        description: "",
        lessons: [],
      },
    ])
  }

  const updateModule = (index, field, value) => {
    const updatedModules = [...modules]
    updatedModules[index][field] = value
    setModules(updatedModules)
  }

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index))
  }

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.push({
      id: `temp-${Date.now()}`,
      title: "New Lesson",
      description: "",
      duration: "10",
      videoUrl: "",
      content: "",
      resources: [],
    })
    setModules(updatedModules)
  }

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1)
    setModules(updatedModules)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/admin/courses">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Edit Course</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Status</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information about the course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter course title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="course-slug" {...field} />
                          </FormControl>
                          <FormDescription>Used in the URL: /courses/course-slug</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the course" className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short summary that appears in course cards (150 characters max)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the course"
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>URL to the course thumbnail image</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {instructors.map((instructor) => (
                              <SelectItem key={instructor.id} value={instructor.id}>
                                {instructor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>Provide additional details about the course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical-analysis">Technical Analysis</SelectItem>
                              <SelectItem value="fundamental-analysis">Fundamental Analysis</SelectItem>
                              <SelectItem value="trading-psychology">Trading Psychology</SelectItem>
                              <SelectItem value="risk-management">Risk Management</SelectItem>
                              <SelectItem value="options-trading">Options Trading</SelectItem>
                              <SelectItem value="forex-trading">Forex Trading</SelectItem>
                              <SelectItem value="crypto-trading">Crypto Trading</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="all-levels">All Levels</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10 hours" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Learning Objectives</h3>
                      <p className="text-sm text-muted-foreground">What students will learn from this course</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a learning objective"
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                      />
                      <Button type="button" onClick={addObjective}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <ul className="space-y-2">
                      {form.watch("objectives")?.map((objective, index) => (
                        <li key={index} className="flex items-center justify-between rounded-md border p-3">
                          <span>{objective}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Requirements</h3>
                      <p className="text-sm text-muted-foreground">Prerequisites for taking this course</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a requirement"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                      />
                      <Button type="button" onClick={addRequirement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <ul className="space-y-2">
                      {form.watch("requirements")?.map((requirement, index) => (
                        <li key={index} className="flex items-center justify-between rounded-md border p-3">
                          <span>{requirement}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>Organize your course content into modules and lessons.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-end">
                    <Button type="button" onClick={addModule}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Module
                    </Button>
                  </div>

                  {modules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Modules Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start building your course by adding modules and lessons.
                      </p>
                      <Button type="button" onClick={addModule}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Module
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {modules.map((module, moduleIndex) => (
                        <div key={module.id} className="rounded-md border">
                          <div className="p-4 bg-muted/50">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">Module {moduleIndex + 1}</h3>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(moduleIndex)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-4">
                              <Input
                                placeholder="Module Title"
                                value={module.title}
                                onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                              />
                              <Textarea
                                placeholder="Module Description"
                                value={module.description}
                                onChange={(e) => updateModule(moduleIndex, "description", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Lessons</h4>
                              <Button type="button" variant="outline" size="sm" onClick={() => addLesson(moduleIndex)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Lesson
                              </Button>
                            </div>
                            {module.lessons.length === 0 ? (
                              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6">
                                <p className="text-sm text-muted-foreground mb-2">No lessons in this module yet.</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addLesson(moduleIndex)}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add First Lesson
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div key={lesson.id} className="rounded-md border p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <h5 className="font-medium">
                                        Lesson {moduleIndex + 1}.{lessonIndex + 1}
                                      </h5>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                      <Input
                                        placeholder="Lesson Title"
                                        value={lesson.title}
                                        onChange={(e) =>
                                          updateLesson(moduleIndex, lessonIndex, "title", e.target.value)
                                        }
                                      />
                                      <div className="grid grid-cols-2 gap-4">
                                        <Input
                                          placeholder="Duration (minutes)"
                                          type="number"
                                          value={lesson.duration}
                                          onChange={(e) =>
                                            updateLesson(moduleIndex, lessonIndex, "duration", e.target.value)
                                          }
                                        />
                                        <Input
                                          placeholder="Video URL"
                                          value={lesson.videoUrl || ""}
                                          onChange={(e) =>
                                            updateLesson(moduleIndex, lessonIndex, "videoUrl", e.target.value)
                                          }
                                        />
                                      </div>
                                      <Textarea
                                        placeholder="Lesson Description"
                                        value={lesson.description || ""}
                                        onChange={(e) =>
                                          updateLesson(moduleIndex, lessonIndex, "description", e.target.value)
                                        }
                                      />
                                      <Textarea
                                        placeholder="Lesson Content (HTML supported)"
                                        className="min-h-[100px]"
                                        value={lesson.content || ""}
                                        onChange={(e) =>
                                          updateLesson(moduleIndex, lessonIndex, "content", e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Status</CardTitle>
                  <CardDescription>Set the price and status of your course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>Leave at 0 for no discount</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">Pending Review</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Only published courses are visible to students</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Course</FormLabel>
                            <FormDescription>Display this course on the homepage featured section</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isBestseller"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Bestseller Badge</FormLabel>
                            <FormDescription>Mark this course as a bestseller</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
