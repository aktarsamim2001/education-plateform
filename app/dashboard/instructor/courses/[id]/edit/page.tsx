"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ChevronLeft, Save, Trash2, Plus, Upload, Eye, X, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [course, setCourse] = useState<any>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    discountPrice: 0,
    thumbnail: "/placeholder.svg",
    status: "draft",
    isFeatured: false,
    isBestseller: false,
    objectives: [""],
    requirements: [""],
    lessons: [],
  })

  useEffect(() => {
    if (params.id) {
      fetchCourse(params.id)
    }
  }, [params.id])

  const fetchCourse = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/instructor/courses/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch course")
      }

      const data = await response.json()

      if (data.course) {
        setCourse(data.course)
      } else {
        // Fallback to sample data for demonstration
        setCourse({
          id: id,
          title: "Technical Analysis Masterclass",
          slug: "technical-analysis-masterclass",
          shortDescription: "Learn the art and science of technical analysis to make better trading decisions",
          description:
            "This comprehensive course covers all aspects of technical analysis, from basic chart patterns to advanced indicators. You'll learn how to identify trends, spot reversals, and make profitable trading decisions based on technical signals.",
          category: "Technical Analysis",
          level: "intermediate",
          price: 199,
          discountPrice: 149,
          thumbnail: "/placeholder.svg?height=400&width=600",
          status: "published",
          isFeatured: true,
          isBestseller: true,
          objectives: [
            "Understand the principles of technical analysis",
            "Identify and interpret chart patterns",
            "Use technical indicators effectively",
            "Develop a trading strategy based on technical analysis",
            "Manage risk using technical tools",
          ],
          requirements: [
            "Basic understanding of stock markets",
            "Trading account (demo or real)",
            "Charting software (recommendations provided in the course)",
          ],
          lessons: [
            {
              id: "lesson-1",
              title: "Introduction to Technical Analysis",
              description: "Learn the fundamentals of technical analysis and why it works",
              duration: 45,
              isPreview: true,
              order: 1,
              content: "This is the lesson content...",
            },
            {
              id: "lesson-2",
              title: "Chart Types and Timeframes",
              description: "Understand different chart types and how to choose the right timeframe",
              duration: 60,
              isPreview: false,
              order: 2,
              content: "This is the lesson content...",
            },
            {
              id: "lesson-3",
              title: "Support and Resistance",
              description: "Master the concepts of support and resistance levels",
              duration: 75,
              isPreview: false,
              order: 3,
              content: "This is the lesson content...",
            },
          ],
          createdAt: new Date("2023-01-15"),
          updatedAt: new Date("2023-05-20"),
        })
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!course.title.trim()) {
      errors.title = "Course title is required"
    }

    if (!course.slug.trim()) {
      errors.slug = "URL slug is required"
    } else if (!/^[a-z0-9-]+$/.test(course.slug)) {
      errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"
    }

    if (!course.shortDescription.trim()) {
      errors.shortDescription = "Short description is required"
    }

    if (!course.description.trim()) {
      errors.description = "Description is required"
    }

    if (!course.category) {
      errors.category = "Category is required"
    }

    if (course.price < 0) {
      errors.price = "Price cannot be negative"
    }

    if (course.discountPrice && course.discountPrice >= course.price) {
      errors.discountPrice = "Discount price must be less than regular price"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/instructor/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update course")
      }

      const data = await response.json()

      // Update the course state with the returned data
      if (data.course) {
        setCourse(data.course)
      }

      toast({
        title: "Success",
        description: "Course updated successfully.",
      })
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/instructor/courses/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete course")
      }

      toast({
        title: "Success",
        description: "Course deleted successfully.",
      })

      // Redirect to courses list
      router.push("/dashboard/instructor/courses")
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourse({ ...course, [name]: value })

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" })
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCourse({ ...course, [name]: value === "" ? "" : Number(value) })

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCourse({ ...course, [name]: checked })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourse({ ...course, [name]: value })

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" })
    }
  }

  const handleArrayItemChange = (arrayName: string, index: number, value: string) => {
    const newArray = [...course[arrayName]]
    newArray[index] = value
    setCourse({ ...course, [arrayName]: newArray })
  }

  const addArrayItem = (arrayName: string) => {
    const newArray = [...course[arrayName], ""]
    setCourse({ ...course, [arrayName]: newArray })
  }

  const removeArrayItem = (arrayName: string, index: number) => {
    const newArray = [...course[arrayName]]
    newArray.splice(index, 1)
    setCourse({ ...course, [arrayName]: newArray })
  }

  const handleLessonChange = (index: number, field: string, value: any) => {
    const newLessons = [...course.lessons]
    newLessons[index][field] = value
    setCourse({ ...course, lessons: newLessons })
  }

  const addLesson = () => {
    const newLessonId = `lesson-${Date.now()}`
    const lessonOrder = course.lessons.length + 1

    const newLesson = {
      id: newLessonId,
      title: `Lesson ${lessonOrder}`,
      description: "",
      duration: 0,
      isPreview: false,
      order: lessonOrder,
      content: "",
    }

    setCourse({ ...course, lessons: [...course.lessons, newLesson] })
  }

  const removeLesson = (index: number) => {
    const newLessons = [...course.lessons]
    newLessons.splice(index, 1)

    // Update order for remaining lessons
    newLessons.forEach((lesson, idx) => {
      lesson.order = idx + 1
    })

    setCourse({ ...course, lessons: newLessons })
  }

  const generateSlugFromTitle = () => {
    if (course.title) {
      const slug = course.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setCourse({ ...course, slug })

      // Clear validation error for slug
      if (validationErrors.slug) {
        setValidationErrors({ ...validationErrors, slug: "" })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/instructor/courses">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/courses/${course.slug}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" /> Preview
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Status</TabsTrigger>
          <TabsTrigger value="requirements">Requirements & Objectives</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={course.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Button variant="ghost" size="sm" onClick={generateSlugFromTitle} type="button">
                    Generate from title
                  </Button>
                </div>
                <Input
                  id="slug"
                  name="slug"
                  value={course.slug}
                  onChange={handleInputChange}
                  placeholder="enter-url-slug"
                  className={validationErrors.slug ? "border-red-500" : ""}
                />
                {validationErrors.slug ? (
                  <p className="text-sm text-red-500">{validationErrors.slug}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This will be used in the course URL: stockedu.com/courses/
                    <span className="font-mono">{course.slug || "your-slug"}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={course.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description of your course (150-200 characters)"
                  rows={2}
                  className={validationErrors.shortDescription ? "border-red-500" : ""}
                />
                {validationErrors.shortDescription && (
                  <p className="text-sm text-red-500">{validationErrors.shortDescription}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={course.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of your course"
                  rows={6}
                  className={validationErrors.description ? "border-red-500" : ""}
                />
                {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={course.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className={validationErrors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical Analysis">Technical Analysis</SelectItem>
                      <SelectItem value="Fundamental Analysis">Fundamental Analysis</SelectItem>
                      <SelectItem value="Trading Psychology">Trading Psychology</SelectItem>
                      <SelectItem value="Risk Management">Risk Management</SelectItem>
                      <SelectItem value="Options Trading">Options Trading</SelectItem>
                      <SelectItem value="Forex Trading">Forex Trading</SelectItem>
                      <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.category && <p className="text-sm text-red-500">{validationErrors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={course.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all-levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Course Thumbnail</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-56 overflow-hidden rounded-md border">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt="Course thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline" type="button">
                    <Upload className="h-4 w-4 mr-2" /> Upload New Image
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Recommended size: 1280x720 pixels (16:9 ratio)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Course Lessons</h3>
                <Button onClick={addLesson} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Lesson
                </Button>
              </div>

              <div className="space-y-6">
                {course.lessons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No lessons added yet. Click "Add Lesson" to create your first lesson.
                  </div>
                ) : (
                  course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Lesson {index + 1}:</span>
                            <Input
                              value={lesson.title}
                              onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                              placeholder="Lesson title"
                              className="max-w-md"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLesson(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-${index}-description`}>Description</Label>
                          <Textarea
                            id={`lesson-${index}-description`}
                            value={lesson.description}
                            onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                            placeholder="Lesson description"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`lesson-${index}-duration`}>Duration (minutes)</Label>
                            <Input
                              id={`lesson-${index}-duration`}
                              type="number"
                              min="0"
                              value={lesson.duration}
                              onChange={(e) => handleLessonChange(index, "duration", Number(e.target.value))}
                              placeholder="Duration in minutes"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-8">
                            <Switch
                              id={`lesson-${index}-preview`}
                              checked={lesson.isPreview}
                              onCheckedChange={(checked) => handleLessonChange(index, "isPreview", checked)}
                            />
                            <Label htmlFor={`lesson-${index}-preview`}>Free Preview</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-${index}-content`}>Content</Label>
                          <Textarea
                            id={`lesson-${index}-content`}
                            value={lesson.content}
                            onChange={(e) => handleLessonChange(index, "content", e.target.value)}
                            placeholder="Lesson content or video URL"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={course.price}
                    onChange={handleNumberInputChange}
                    placeholder="99.99"
                    className={validationErrors.price ? "border-red-500" : ""}
                  />
                  {validationErrors.price && <p className="text-sm text-red-500">{validationErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Discount Price ($)</Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={course.discountPrice}
                    onChange={handleNumberInputChange}
                    placeholder="79.99"
                    className={validationErrors.discountPrice ? "border-red-500" : ""}
                  />
                  {validationErrors.discountPrice && (
                    <p className="text-sm text-red-500">{validationErrors.discountPrice}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Course Status</Label>
                <Select value={course.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={course.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                  />
                  <Label htmlFor="isFeatured">Featured Course</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isBestseller"
                    checked={course.isBestseller}
                    onCheckedChange={(checked) => handleSwitchChange("isBestseller", checked)}
                  />
                  <Label htmlFor="isBestseller">Bestseller</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Course Requirements</h3>
                  <Button onClick={() => addArrayItem("requirements")} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Requirement
                  </Button>
                </div>
                {course.requirements.map((requirement, index) => (
                  <div key={`req-${index}`} className="flex items-center gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => handleArrayItemChange("requirements", index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("requirements", index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Course Objectives</h3>
                  <Button onClick={() => addArrayItem("objectives")} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Objective
                  </Button>
                </div>
                {course.objectives.map((objective, index) => (
                  <div key={`obj-${index}`} className="flex items-center gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleArrayItemChange("objectives", index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem("objectives", index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone and will remove all course
              content and student enrollments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
