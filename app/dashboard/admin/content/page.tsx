"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function AdminContentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string } | null>(null)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/${itemToDelete.type}s/${itemToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} deleted successfully.`,
        })
        // Refresh data
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${itemToDelete.type}.`,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (id: string, type: string) => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage all content on the platform</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search content..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin/content/courses/new">New Course</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin/content/webinars/new">New Webinar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin/content/blog/new">New Blog Post</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Manage all courses on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : course.status === "pending"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/content/courses/${course.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(course.id, "course")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webinars</CardTitle>
              <CardDescription>Manage all webinars on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webinars.map((webinar) => (
                    <TableRow key={webinar.id}>
                      <TableCell className="font-medium">{webinar.title}</TableCell>
                      <TableCell>{webinar.instructor}</TableCell>
                      <TableCell>{webinar.date}</TableCell>
                      <TableCell>{webinar.isFree ? "Free" : `$${webinar.price}`}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            webinar.status === "scheduled"
                              ? "default"
                              : webinar.status === "live"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {webinar.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/content/webinars/${webinar.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(webinar.id, "webinar")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage all blog posts on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.publishedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === "published" ? "default" : post.status === "draft" ? "outline" : "secondary"
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/content/blog/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(post.id, "blog")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{" "}
              {itemToDelete?.type.charAt(0).toUpperCase() + itemToDelete?.type.slice(1)}? This action cannot be undone.
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

// Sample data
const courses = [
  {
    id: "1",
    title: "Technical Analysis Masterclass",
    instructor: "Michael Chen",
    category: "Technical Analysis",
    price: 199,
    status: "published",
  },
  {
    id: "2",
    title: "Options Trading Fundamentals",
    instructor: "Sarah Johnson",
    category: "Options Trading",
    price: 149,
    status: "published",
  },
  {
    id: "3",
    title: "Advanced Options Strategies",
    instructor: "Sarah Johnson",
    category: "Options Trading",
    price: 249,
    status: "pending",
  },
  {
    id: "4",
    title: "Day Trading Strategies",
    instructor: "Emily Chen",
    category: "Day Trading",
    price: 229,
    status: "published",
  },
  {
    id: "5",
    title: "Swing Trading Basics",
    instructor: "David Williams",
    category: "Swing Trading",
    price: 129,
    status: "draft",
  },
]

const webinars = [
  {
    id: "1",
    title: "Market Outlook 2023",
    instructor: "Michael Chen",
    date: "June 15, 2023",
    price: 0,
    isFree: true,
    status: "scheduled",
  },
  {
    id: "2",
    title: "Options Trading for Volatile Markets",
    instructor: "Sarah Johnson",
    date: "June 22, 2023",
    price: 29,
    isFree: false,
    status: "scheduled",
  },
  {
    id: "3",
    title: "Technical Analysis: Advanced Chart Patterns",
    instructor: "David Williams",
    date: "May 20, 2023",
    price: 29,
    isFree: false,
    status: "completed",
  },
]

const blogPosts = [
  {
    id: "1",
    title: "The Ultimate Guide to Support and Resistance Levels",
    author: "David Williams",
    category: "Technical Analysis",
    publishedAt: "June 10, 2023",
    status: "published",
  },
  {
    id: "2",
    title: "5 Common Mistakes Beginner Traders Make",
    author: "Sarah Johnson",
    category: "Trading Psychology",
    publishedAt: "June 5, 2023",
    status: "published",
  },
  {
    id: "3",
    title: "Understanding Market Cycles",
    author: "Michael Chen",
    category: "Economy",
    publishedAt: "May 28, 2023",
    status: "published",
  },
  {
    id: "4",
    title: "Upcoming Earnings Season Preview",
    author: "Emily Chen",
    category: "Fundamental Analysis",
    publishedAt: "",
    status: "draft",
  },
]
