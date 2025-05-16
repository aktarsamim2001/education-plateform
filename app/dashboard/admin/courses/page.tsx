"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Eye, Plus, Trash2, ArrowUpDown, MoreHorizontal } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { DataTable } from "@/components/admin/data-table"

// Define the Course type
type Course = {
  id: string
  title: string
  slug: string
  thumbnail: string
  price: number
  discountPrice?: number
  category: string
  level: string
  status: string
  students: number
  instructor: string
  createdAt: string
  updatedAt: string
}

export default function AdminCoursesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

  // Fetch courses with debounce to prevent excessive API calls
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/courses")
        if (!response.ok) throw new Error("Failed to fetch courses")
        const data = await response.json()
        setCourses(data.courses)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  const handleDelete = async () => {
    if (!courseToDelete) return

    try {
      const response = await fetch(`/api/courses/${courseToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCourses((prev) => prev.filter((course) => course.id !== courseToDelete.id))
        toast({
          title: "Success",
          description: "Course deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete course")
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setCourseToDelete(null)
    }
  }

  const confirmDelete = (course: Course) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setCourses((prev) => prev.map((course) => (course.id === courseId ? { ...course, status: newStatus } : course)))
        toast({
          title: "Success",
          description: `Course status updated to ${newStatus}.`,
        })
      } else {
        throw new Error("Failed to update course status")
      }
    } catch (error) {
      console.error("Error updating course status:", error)
      toast({
        title: "Error",
        description: "Failed to update course status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Course
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <Image
                src={row.original.thumbnail || "/placeholder.svg?height=40&width=64"}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="font-medium">{row.original.title}</div>
          </div>
        ),
      },
      {
        accessorKey: "instructor",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Instructor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const price = Number.parseFloat(row.getValue("price"))
          const discountPrice = row.original.discountPrice

          return (
            <div>
              {discountPrice ? (
                <>
                  <span className="font-medium">${discountPrice}</span>
                  <span className="ml-2 text-sm text-muted-foreground line-through">${price}</span>
                </>
              ) : (
                <span className="font-medium">${price}</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "students",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Students
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Badge
                    variant={
                      status === "published"
                        ? "default"
                        : status === "pending"
                          ? "outline"
                          : status === "draft"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {status}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "published")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "draft")}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "archived")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const course = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/courses/${course.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => confirmDelete(course)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
        <p className="text-muted-foreground">Manage all courses on the platform</p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>{isLoading ? "Loading courses..." : `Showing ${courses.length} courses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={courses}
            searchKey="title"
            searchPlaceholder="Search courses..."
            isLoading={isLoading}
          />
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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
