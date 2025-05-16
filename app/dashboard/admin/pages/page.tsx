"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"

interface Page {
  _id: string
  title: string
  slug: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/pages?status=all")
      if (!response.ok) {
        throw new Error("Failed to fetch pages")
      }
      const data = await response.json()
      setPages(data.data)
    } catch (error) {
      console.error("Error fetching pages:", error)
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this page?")) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${slug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete page")
      }

      toast({
        title: "Success",
        description: "Page deleted successfully",
      })

      // Refresh the page list
      fetchPages()
    } catch (error) {
      console.error("Error deleting page:", error)
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button onClick={() => router.push("/dashboard/admin/pages/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Page
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No pages found</h3>
          <p className="text-muted-foreground mt-2">Get started by creating a new page</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/admin/pages/new")}>
            <Plus className="mr-2 h-4 w-4" /> Create Page
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant={page.status === "published" ? "default" : "outline"}>{page.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(page.createdAt)}</TableCell>
                  <TableCell>{formatDate(page.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${page.slug}`} target="_blank">
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/admin/pages/${page.slug}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(page.slug)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
