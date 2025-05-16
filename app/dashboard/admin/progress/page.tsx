"use client"

import { useState, useEffect } from "react"
import { Search, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminProgressPage() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [modules, setModules] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchModules()
  }, [])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/students/progress")
      if (!response.ok) throw new Error("Failed to fetch student progress")
      const data = await response.json()
      setStudents(data.students)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student progress. Please try again.",
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const exportToCSV = () => {
    // In a real implementation, this would generate and download a CSV file
    toast({
      title: "Export Started",
      description: "Student progress data is being exported to CSV.",
    })
  }

  // Filter and sort students
  const filteredStudents = students
    .filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesModule = moduleFilter === "all" || student.moduleProgress.some((mp) => mp.moduleId === moduleFilter)
      return matchesSearch && matchesModule
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
        comparison = nameA.localeCompare(nameB)
      } else if (sortBy === "progress") {
        const progressA = a.overallProgress || 0
        const progressB = b.overallProgress || 0
        comparison = progressA - progressB
      } else if (sortBy === "lastActive") {
        const dateA = new Date(a.lastActive || 0)
        const dateB = new Date(b.lastActive || 0)
        comparison = dateA - dateB
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Progress</h1>
        <p className="text-muted-foreground">Track student progress across modules and quizzes</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("name")}>
                Sort by Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("progress")}>
                Sort by Progress {sortBy === "progress" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("lastActive")}>
                Sort by Last Active {sortBy === "lastActive" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="simulations">Simulations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress Overview</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading student data..."
                  : `Showing ${filteredStudents.length} of ${students.length} students`}
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
                      <TableHead className="w-[250px]">Student</TableHead>
                      <TableHead>Overall Progress</TableHead>
                      <TableHead>Modules Completed</TableHead>
                      <TableHead>Quizzes Completed</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No students found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName?.charAt(0)}
                                  {student.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={student.overallProgress} className="w-[100px]" />
                              <span>{student.overallProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.completedModules}/{student.totalModules}
                          </TableCell>
                          <TableCell>
                            {student.completedQuizzes}/{student.totalQuizzes}
                          </TableCell>
                          <TableCell>
                            {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : "Never"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/admin/students/${student.id}/progress`}>View Details</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Completion</CardTitle>
              <CardDescription>Student progress by module</CardDescription>
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
                      <TableHead className="w-[250px]">Student</TableHead>
                      {modules.slice(0, 5).map((module) => (
                        <TableHead key={module.id}>{module.title}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No students found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName?.charAt(0)}
                                  {student.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                            </div>
                          </TableCell>
                          {modules.slice(0, 5).map((module) => {
                            const moduleProgress = student.moduleProgress?.find((mp) => mp.moduleId === module.id)
                            return (
                              <TableCell key={module.id}>
                                {moduleProgress ? (
                                  <Badge
                                    variant={
                                      moduleProgress.progress === 100
                                        ? "default"
                                        : moduleProgress.progress > 0
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {moduleProgress.progress}%
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Not Started</Badge>
                                )}
                              </TableCell>
                            )
                          })}
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/admin/students/${student.id}/modules`}>View All</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>Student quiz scores and attempts</CardDescription>
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
                      <TableHead className="w-[250px]">Student</TableHead>
                      <TableHead>Quizzes Attempted</TableHead>
                      <TableHead>Quizzes Passed</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Best Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No students found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName?.charAt(0)}
                                  {student.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.quizzesAttempted || 0}</TableCell>
                          <TableCell>{student.quizzesPassed || 0}</TableCell>
                          <TableCell>{student.averageScore ? `${student.averageScore.toFixed(1)}%` : "N/A"}</TableCell>
                          <TableCell>{student.bestScore ? `${student.bestScore}%` : "N/A"}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/admin/students/${student.id}/quizzes`}>View Details</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Performance</CardTitle>
              <CardDescription>Student performance in market simulations</CardDescription>
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
                      <TableHead className="w-[250px]">Student</TableHead>
                      <TableHead>Simulations Completed</TableHead>
                      <TableHead>Average Return</TableHead>
                      <TableHead>Best Return</TableHead>
                      <TableHead>Worst Return</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No students found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={`${student.firstName} ${student.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.firstName?.charAt(0)}
                                  {student.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.simulationsCompleted || 0}</TableCell>
                          <TableCell>
                            <span
                              className={
                                student.averageReturn > 0
                                  ? "text-green-500"
                                  : student.averageReturn < 0
                                    ? "text-red-500"
                                    : ""
                              }
                            >
                              {student.averageReturn
                                ? `${student.averageReturn > 0 ? "+" : ""}${student.averageReturn.toFixed(2)}%`
                                : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-green-500">
                              {student.bestReturn ? `+${student.bestReturn.toFixed(2)}%` : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-500">
                              {student.worstReturn ? `${student.worstReturn.toFixed(2)}%` : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/dashboard/admin/students/${student.id}/simulations`}>View Details</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
