"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Plus,
  Star,
  Users,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function InstructorDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState([])
  const [webinars, setWebinars] = useState([])
  const [blogs, setBlogs] = useState([])
  const [stats, setStats] = useState({
    revenue: 0,
    students: 0,
    rating: 0,
    activeCourses: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState({ id: "", type: "" })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch courses
        const coursesRes = await fetch("/api/instructor/courses")
        const coursesData = await coursesRes.json()

        // Fetch webinars
        const webinarsRes = await fetch("/api/instructor/webinars")
        const webinarsData = await webinarsRes.json()

        // Fetch blogs
        const blogsRes = await fetch("/api/instructor/blog")
        const blogsData = await blogsRes.json()

        // Calculate stats
        const totalRevenue =
          coursesData.courses.reduce((acc, course) => acc + (course.revenue || 0), 0) +
          webinarsData.webinars.reduce((acc, webinar) => acc + (webinar.revenue || 0), 0)

        const totalStudents =
          coursesData.courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0) +
          webinarsData.webinars.reduce((acc, webinar) => acc + (webinar.registrations?.length || 0), 0)

        const ratings = coursesData.courses.filter((course) => course.rating).map((course) => course.rating)
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 0

        const activeCourses = coursesData.courses.filter((course) => course.status === "published").length

        setCourses(coursesData.courses || [])
        setWebinars(webinarsData.webinars || [])
        setBlogs(blogsData.blogs || [])
        setStats({
          revenue: totalRevenue,
          students: totalStudents,
          rating: Number.parseFloat(avgRating.toFixed(1)),
          activeCourses,
        })
      } catch (error) {
        console.error("Error fetching instructor data:", error)
        toast({
          title: "Error",
          description: "Failed to load your instructor data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleDelete = async () => {
    if (!itemToDelete.id || !itemToDelete.type) return

    try {
      let endpoint = ""
      switch (itemToDelete.type) {
        case "course":
          endpoint = `/api/instructor/courses/${itemToDelete.id}`
          break
        case "webinar":
          endpoint = `/api/instructor/webinars/${itemToDelete.id}`
          break
        case "blog":
          endpoint = `/api/instructor/blog/${itemToDelete.id}`
          break
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete item")

      // Update state to remove the deleted item
      if (itemToDelete.type === "course") {
        setCourses(courses.filter((course) => course._id !== itemToDelete.id))
      } else if (itemToDelete.type === "webinar") {
        setWebinars(webinars.filter((webinar) => webinar._id !== itemToDelete.id))
      } else if (itemToDelete.type === "blog") {
        setBlogs(blogs.filter((blog) => blog._id !== itemToDelete.id))
      }

      toast({
        title: "Success",
        description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} deleted successfully.`,
        variant: "default",
      })
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${itemToDelete.type}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete({ id: "", type: "" })
    }
  }

  const confirmDelete = (id, type) => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Published
          </span>
        )
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Draft
          </span>
        )
      case "archived":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Archived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {status}
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your teaching activity.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all your courses and webinars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Enrolled in your courses and webinars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating}</div>
            <p className="text-xs text-muted-foreground">Based on student reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Currently published courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Management Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <Button onClick={() => router.push("/dashboard/instructor/courses/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No courses yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first course to start teaching</p>
                <Button onClick={() => router.push("/dashboard/instructor/courses/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course._id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={course.coverImage || "/placeholder.svg?height=192&width=384"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      {getStatusBadge(course.status)}
                    </div>
                    <CardDescription className="line-clamp-2">{course.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{course.enrolledStudents?.length || 0} students</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        <span>${course.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/instructor/courses/${course._id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${course.slug}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(course._id, "course")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Webinars</h2>
            <Button onClick={() => router.push("/dashboard/instructor/webinars/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Webinar
            </Button>
          </div>

          {webinars.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No webinars yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule your first webinar to engage with students
                </p>
                <Button onClick={() => router.push("/dashboard/instructor/webinars/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Webinar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {webinars.map((webinar) => (
                <Card key={webinar._id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={webinar.coverImage || "/placeholder.svg?height=192&width=384"}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                      {getStatusBadge(webinar.status)}
                    </div>
                    <CardDescription className="line-clamp-2">{webinar.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{new Date(webinar.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        <span>${webinar.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{webinar.registrations?.length || 0} registrations</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/instructor/webinars/${webinar._id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/webinars/${webinar.slug}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(webinar._id, "webinar")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Blog Posts</h2>
            <Button onClick={() => router.push("/dashboard/instructor/blog/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Blog Post
            </Button>
          </div>

          {blogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No blog posts yet</p>
                <p className="text-sm text-muted-foreground mb-4">Share your knowledge by writing blog posts</p>
                <Button onClick={() => router.push("/dashboard/instructor/blog/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Blog Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={blog.coverImage || "/placeholder.svg?height=192&width=384"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                      {getStatusBadge(blog.status)}
                    </div>
                    <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {blog.categories && blog.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.categories.slice(0, 3).map((category, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-muted rounded-md">
                            {category}
                          </span>
                        ))}
                        {blog.categories.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-muted rounded-md">+{blog.categories.length - 3}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/instructor/blog/${blog._id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${blog.slug}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(blog._id, "blog")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {itemToDelete.type} and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
