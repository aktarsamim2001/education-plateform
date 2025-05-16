"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InstructorCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/instructor/courses")
      if (!response.ok) throw new Error("Failed to fetch courses")
      const data = await response.json()
      setCourses(data.courses || sampleCourses) // Fallback to sample data if API returns empty
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
      // Use sample data as fallback
      setCourses(sampleCourses)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!courseToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/instructor/courses/${courseToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete course")
      }

      // Remove the deleted course from the state
      setCourses(courses.filter((course) => course.id !== courseToDelete.id))

      toast({
        title: "Success",
        description: "Course deleted successfully.",
      })

      // Close the dialog
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmDelete = (course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  const handleEdit = (courseId) => {
    router.push(`/dashboard/instructor/courses/${courseId}/edit`)
  }

  // Sample data for demonstration
  const sampleCourses = [
    {
      id: "1",
      title: "Technical Analysis Masterclass",
      thumbnail: "/placeholder.svg?height=40&width=64",
      price: 199,
      students: 3245,
      rating: 4.8,
      status: "published",
      slug: "technical-analysis-masterclass",
    },
    {
      id: "2",
      title: "Market Psychology: Understanding Crowd Behavior",
      thumbnail: "/placeholder.svg?height=40&width=64",
      price: 149,
      students: 2180,
      rating: 4.7,
      status: "published",
      slug: "market-psychology",
    },
    {
      id: "3",
      title: "Risk Management for Traders",
      thumbnail: "/placeholder.svg?height=40&width=64",
      price: 249,
      students: 1890,
      rating: 4.9,
      status: "published",
      slug: "risk-management-for-traders",
    },
    {
      id: "4",
      title: "Advanced Chart Patterns",
      thumbnail: "/placeholder.svg?height=40&width=64",
      price: 229,
      students: 1560,
      rating: 4.6,
      status: "draft",
      slug: "advanced-chart-patterns",
    },
    {
      id: "5",
      title: "Swing Trading Strategies",
      thumbnail: "/placeholder.svg?height=40&width=64",
      price: 129,
      students: 1245,
      rating: 4.5,
      status: "draft",
      slug: "swing-trading-strategies",
    },
  ]

  // Filter courses based on search term and status
  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Manage your courses and track their performance</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/instructor/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            {isLoading ? "Loading courses..." : `Showing ${filteredCourses.length} of ${courses.length} courses`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No courses found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-16 overflow-hidden rounded">
                            <Image
                              src={course.thumbnail || "/placeholder.svg"}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="font-medium">{course.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>{course.students}</TableCell>
                      <TableCell>{course.rating}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : course.status === "draft"
                                ? "secondary"
                                : course.status === "pending"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/${course.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(course.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(course)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the course "{courseToDelete?.title}"? This action cannot be undone.
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
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
