"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2, HelpCircle } from "lucide-react"

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

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState(null)
  const [modules, setModules] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchQuizzes()
    fetchModules()
  }, [])

  const fetchQuizzes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/quizzes")
      if (!response.ok) throw new Error("Failed to fetch quizzes")
      const data = await response.json()
      setQuizzes(data.quizzes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quizzes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/admin/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data.modules)
    } catch (error) {
      console.error("Error fetching modules:", error)
    }
  }

  const handleDelete = async () => {
    if (!quizToDelete) return

    try {
      const response = await fetch(`/api/admin/quizzes/${quizToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz deleted successfully.",
        })
        fetchQuizzes() // Refresh the list
      } else {
        throw new Error("Failed to delete quiz")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setQuizToDelete(null)
    }
  }

  const confirmDelete = (quiz) => {
    setQuizToDelete(quiz)
    setDeleteDialogOpen(true)
  }

  // Filter quizzes based on search term and module
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = moduleFilter === "all" || quiz.moduleId === moduleFilter
    return matchesSearch && matchesModule
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        <p className="text-muted-foreground">Manage all quizzes on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search quizzes..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/admin/quizzes/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Quiz
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quizzes</CardTitle>
          <CardDescription>
            {isLoading ? "Loading quizzes..." : `Showing ${filteredQuizzes.length} of ${quizzes.length} quizzes`}
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
                  <TableHead>Module</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No quizzes found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.title}</TableCell>
                      <TableCell>
                        {modules.find((module) => module.id === quiz.moduleId)?.title || "Unknown Module"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questionCount || 0} questions</span>
                        </div>
                      </TableCell>
                      <TableCell>{quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            quiz.status === "published" ? "default" : quiz.status === "draft" ? "secondary" : "outline"
                          }
                        >
                          {quiz.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/quizzes/${quiz.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(quiz)}>
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
              Are you sure you want to delete the quiz "{quizToDelete?.title}"? This action cannot be undone.
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
