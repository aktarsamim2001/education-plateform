"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Search, Download, Filter, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StudentProgressTracker } from "@/components/student-progress-tracker"

export default function InstructorStudentProgressPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch instructor's courses
        const coursesResponse = await fetch("/api/instructor/courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses)

        // Fetch students enrolled in instructor's courses
        const studentsResponse = await fetch("/api/instructor/students")
        const studentsData = await studentsResponse.json()
        setStudents(studentsData.students)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load student data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user.role === "instructor") {
      fetchData()
    } else {
      router.push("/dashboard")
    }
  }, [session, router, toast])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const exportToCSV = () => {
    toast({
      title: "Export Started",
      description: "Student progress data is being exported to CSV.",
    })
    // In a real implementation, this would generate and download a CSV file
  }

  const handleStudentSelect = (student) => {
    setSelectedStudent(student)
  }

  const handleBackToList = () => {
    setSelectedStudent(null)
  }

  // Filter and sort students
  const filteredStudents = students
    .filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCourse =
        courseFilter === "all" || student.enrolledCourses.some((course) => course.id === courseFilter)
      return matchesSearch && matchesCourse
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case "progress":
          comparison = a.overallProgress - b.overallProgress
          break
        case "lastActive":
          comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          break
        case "enrolledCourses":
          comparison = a.enrolledCourses.length - b.enrolledCourses.length
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Student detail view
  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
            <h1 className="text-2xl font-bold">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </h1>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <StudentProgressTracker studentId={selectedStudent.id} />

        <Card>
          <CardHeader>
            <CardTitle>Enrolled Courses</CardTitle>
            <CardDescription>Courses this student is enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedStudent.enrolledCourses.map((course) => (
                <div key={course.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{course.progress}%</div>
                      <Progress value={course.progress} className="w-[100px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Student contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{selectedStudent.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-muted-foreground">{selectedStudent.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-muted-foreground">{selectedStudent.location || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-muted-foreground">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Student list view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Progress</h1>
        <p className="text-muted-foreground">Track your students' progress across your courses</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
              <DropdownMenuItem onClick={() => handleSort("enrolledCourses")}>
                Sort by Courses {sortBy === "enrolledCourses" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>{filteredStudents.length} students found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Student</TableHead>
                    <TableHead>Overall Progress</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                        <TableCell>{student.enrolledCourses.length} courses</TableCell>
                        <TableCell>
                          {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleStudentSelect(student)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* Similar content as "all" tab but filtered for active students */}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {/* Similar content as "all" tab but filtered for inactive students */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
