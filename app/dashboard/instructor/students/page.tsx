"use client"

import { useState, useEffect } from "react"
import { Search, Mail, MoreHorizontal, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll simulate a delay and use sample data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStudents(sampleStudents)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for demonstration
  const sampleStudents = [
    {
      id: "1",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      enrolledCourses: ["Technical Analysis Masterclass", "Risk Management for Traders"],
      enrollmentDate: "May 15, 2023",
      progress: 78,
      lastActive: "2 days ago",
    },
    {
      id: "2",
      name: "Robert Garcia",
      email: "robert.garcia@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      enrolledCourses: ["Risk Management for Traders"],
      enrollmentDate: "April 28, 2023",
      progress: 92,
      lastActive: "5 hours ago",
    },
    {
      id: "3",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      enrolledCourses: ["Market Psychology: Understanding Crowd Behavior"],
      enrollmentDate: "April 10, 2023",
      progress: 45,
      lastActive: "1 day ago",
    },
    {
      id: "4",
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      enrolledCourses: ["Technical Analysis Masterclass", "Advanced Chart Patterns"],
      enrollmentDate: "June 5, 2023",
      progress: 23,
      lastActive: "Just now",
    },
    {
      id: "5",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      enrolledCourses: ["Swing Trading Strategies", "Technical Analysis Masterclass"],
      enrollmentDate: "May 22, 2023",
      progress: 67,
      lastActive: "3 days ago",
    },
  ]

  // Filter students based on search term and course filter
  const filteredStudents = sampleStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse =
      courseFilter === "all" ||
      student.enrolledCourses.some((course) => course.toLowerCase().includes(courseFilter.toLowerCase()))

    return matchesSearch && matchesCourse
  })

  // Sample courses for filter
  const courses = [
    "Technical Analysis Masterclass",
    "Market Psychology: Understanding Crowd Behavior",
    "Risk Management for Traders",
    "Advanced Chart Patterns",
    "Swing Trading Strategies",
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">Manage your students and track their progress</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email All
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
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
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading students..."
                  : `Showing ${filteredStudents.length} of ${sampleStudents.length} students`}
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
                      <TableHead>Student</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Progress</TableHead>
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
                                <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {student.enrolledCourses.map((course, index) => (
                                <Badge key={index} variant="outline" className="w-fit">
                                  {course}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{student.enrollmentDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-24">
                                <div className="h-2 w-full rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm">{student.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.lastActive}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Send Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Progress</DropdownMenuItem>
                                <DropdownMenuItem>Download Certificate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>Students who have been active in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Active students view is coming soon. This will show students who have been active recently.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Students</CardTitle>
              <CardDescription>Students who haven't been active for more than 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Inactive students view is coming soon. This will help you identify students who may need
                  re-engagement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
