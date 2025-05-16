"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2, FileText, Video, Paperclip } from "lucide-react"

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

export default function AdminModulesPage() {
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data.modules)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load modules. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!moduleToDelete) return

    try {
      const response = await fetch(`/api/admin/modules/${moduleToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Module deleted successfully.",
        })
        fetchModules() // Refresh the list
      } else {
        throw new Error("Failed to delete module")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete module. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setModuleToDelete(null)
    }
  }

  const confirmDelete = (module) => {
    setModuleToDelete(module)
    setDeleteDialogOpen(true)
  }

  // Filter modules based on search term and category
  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-muted-foreground">Manage all learning modules on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technical-analysis">Technical Analysis</SelectItem>
              <SelectItem value="fundamental-analysis">Fundamental Analysis</SelectItem>
              <SelectItem value="trading-psychology">Trading Psychology</SelectItem>
              <SelectItem value="risk-management">Risk Management</SelectItem>
              <SelectItem value="options-trading">Options Trading</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/admin/modules/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Module
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Modules</CardTitle>
          <CardDescription>
            {isLoading ? "Loading modules..." : `Showing ${filteredModules.length} of ${modules.length} modules`}
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
                  <TableHead>Category</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No modules found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.title}</TableCell>
                      <TableCell>{module.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{module.contentCount || 0}</span>
                          {module.hasVideos && <Video className="ml-2 h-4 w-4 text-muted-foreground" />}
                          {module.hasAttachments && <Paperclip className="ml-2 h-4 w-4 text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            module.status === "published"
                              ? "default"
                              : module.status === "draft"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {module.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(module.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/modules/${module.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(module)}>
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
              Are you sure you want to delete the module "{moduleToDelete?.title}"? This action cannot be undone.
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
