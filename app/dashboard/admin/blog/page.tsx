"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Eye, Plus, Trash2, ArrowUpDown, MoreHorizontal, Calendar } from "lucide-react"
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

// Define the Blog Post type
type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  status: string
  views: number
  likes: number
  author: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/blog")
        if (!response.ok) throw new Error("Failed to fetch blog posts")
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
        toast({
          title: "Error",
          description: "Failed to load blog posts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [toast])

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/blog/${postToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postToDelete.id))
        toast({
          title: "Success",
          description: "Blog post deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  const confirmDelete = (post: BlogPost) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, status: newStatus } : post)))
        toast({
          title: "Success",
          description: `Blog post status updated to ${newStatus}.`,
        })
      } else {
        throw new Error("Failed to update blog post status")
      }
    } catch (error) {
      console.error("Error updating blog post status:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<BlogPost>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Post
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <Image
                src={row.original.image || "/placeholder.svg?height=40&width=64"}
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
        accessorKey: "author",
        header: "Author",
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Published Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const publishedAt = row.original.publishedAt

          return (
            <div className="flex items-center">
              {publishedAt ? (
                <>
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{publishedAt}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Not published</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "views",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Views
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
                    variant={status === "published" ? "default" : status === "draft" ? "secondary" : "destructive"}
                  >
                    {status}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "published")}>
                  Published
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
          const post = row.original

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
                  <Link href={`/blog/${post.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/admin/blog/${post.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => confirmDelete(post)}
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
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground">Manage all blog posts on the platform</p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            {isLoading ? "Loading blog posts..." : `Showing ${posts.length} blog posts`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={posts}
            searchKey="title"
            searchPlaceholder="Search blog posts..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog post "{postToDelete?.title}"? This action cannot be undone.
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
