"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"

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

export default function AdminContentManagePage() {
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/pages")
      if (!response.ok) throw new Error("Failed to fetch pages")
      const data = await response.json()
      setPages(data.pages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!pageToDelete) return

    try {
      const response = await fetch(`/api/admin/pages/${pageToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Page deleted successfully.",
        })
        fetchPages() // Refresh the list
      } else {
        throw new Error("Failed to delete page")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPageToDelete(null)
    }
  }

  const confirmDelete = (page) => {
    setPageToDelete(page)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = async (pageId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Page status updated to ${newStatus}.`,
        })
        fetchPages() // Refresh the list
      } else {
        throw new Error("Failed to update page status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter pages based on search term and status
  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sample data for demonstration
  const samplePages = [
    {
      id: "1",
      title: "Home Page",
      slug: "/",
      type: "Main",
      lastUpdated: "2023-06-15",
      status: "published",
    },
    {
      id: "2",
      title: "About Us",
      slug: "/about",
      type: "Static",
      lastUpdated: "2023-05-20",
      status: "published",
    },
    {
      id: "3",
      title: "Terms of Service",
      slug: "/terms",
      type: "Legal",
      lastUpdated: "2023-04-10",
      status: "published",
    },
    {
      id: "4",
      title: "Privacy Policy",
      slug: "/privacy",
      type: "Legal",
      lastUpdated: "2023-04-10",
      status: "published",
    },
    {
      id: "5",
      title: "FAQ",
      slug: "/faq",
      type: "Static",
      lastUpdated: "2023-05-25",
      status: "draft",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage all pages and content on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages..."
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
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/admin/content/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Page
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            {isLoading ? "Loading pages..." : `Showing ${filteredPages.length || samplePages.length} pages`}
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
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredPages.length > 0 ? filteredPages : samplePages).map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>{page.type}</TableCell>
                    <TableCell>{page.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          page.status === "published" ? "default" : page.status === "draft" ? "secondary" : "outline"
                        }
                      >
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={page.slug} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/admin/content/edit/${page.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => confirmDelete(page)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
              Are you sure you want to delete the page "{pageToDelete?.title}"? This action cannot be undone.
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
