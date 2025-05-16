"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2, BarChart, TrendingUp } from "lucide-react"

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

export default function AdminSimulationsPage() {
  const [simulations, setSimulations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [simulationToDelete, setSimulationToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSimulations()
  }, [])

  const fetchSimulations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/simulations")
      if (!response.ok) throw new Error("Failed to fetch simulations")
      const data = await response.json()
      setSimulations(data.simulations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load simulations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!simulationToDelete) return

    try {
      const response = await fetch(`/api/admin/simulations/${simulationToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Simulation deleted successfully.",
        })
        fetchSimulations() // Refresh the list
      } else {
        throw new Error("Failed to delete simulation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete simulation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSimulationToDelete(null)
    }
  }

  const confirmDelete = (simulation) => {
    setSimulationToDelete(simulation)
    setDeleteDialogOpen(true)
  }

  // Filter simulations based on search term and difficulty
  const filteredSimulations = simulations.filter((simulation) => {
    const matchesSearch = simulation.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || simulation.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Market Simulations</h1>
        <p className="text-muted-foreground">Manage all market simulations on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search simulations..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/admin/simulations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Simulation
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Simulations</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading simulations..."
              : `Showing ${filteredSimulations.length} of ${simulations.length} simulations`}
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
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSimulations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No simulations found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSimulations.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell className="font-medium">{simulation.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {simulation.type === "historical" ? (
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{simulation.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            simulation.difficulty === "beginner"
                              ? "outline"
                              : simulation.difficulty === "intermediate"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {simulation.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>{simulation.duration} days</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            simulation.status === "published"
                              ? "default"
                              : simulation.status === "draft"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {simulation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/admin/simulations/${simulation.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => confirmDelete(simulation)}>
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
              Are you sure you want to delete the simulation "{simulationToDelete?.title}"? This action cannot be
              undone.
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
