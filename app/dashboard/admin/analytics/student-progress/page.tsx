"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format, subDays } from "date-fns"
import {
  Download,
  Filter,
  Search,
  TrendingUp,
  Users,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { DateRangePicker } from "@/components/date-range-picker"
import { LoadingSpinner } from "@/components/loading-spinner"

// Types
interface StudentProgress {
  id: string
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  overallProgress: number
  lastActive: string
  totalTimeSpent: number // in minutes
  quizScores: {
    average: number
    highest: number
    lowest: number
    total: number
    passed: number
  }
  courseProgress: {
    courseId: string
    courseTitle: string
    progress: number
    lastAccessed: string
    timeSpent: number // in minutes
  }[]
  activityByDay: {
    date: string
    timeSpent: number // in minutes
    lessonsCompleted: number
  }[]
}

interface ProgressStats {
  totalStudents: number
  activeStudents: number
  averageProgress: number
  averageTimeSpent: number // in minutes
  completionRate: number
  averageQuizScore: number
  courseEngagement: {
    courseId: string
    courseTitle: string
    enrollments: number
    averageProgress: number
    averageTimeSpent: number // in minutes
  }[]
  activityOverTime: {
    date: string
    activeUsers: number
    lessonsCompleted: number
    timeSpent: number // in minutes
  }[]
}

export default function StudentProgressAnalytics() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [progressFilter, setProgressFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [courses, setCourses] = useState([])
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [studentDetail, setStudentDetail] = useState<StudentProgress | null>(null)
  const [detailView, setDetailView] = useState<"overview" | "courses" | "quizzes" | "activity">("overview")

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch courses for filtering
        const coursesResponse = await fetch("/api/admin/courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses)

        // Fetch student progress data
        const progressResponse = await fetch("/api/admin/analytics/student-progress")
        const progressData = await progressResponse.json()
        setStudents(progressData.students)
        setStats(progressData.stats)

        // Check if there's a student ID in the URL
        const studentId = searchParams.get("student")
        if (studentId) {
          setSelectedStudent(studentId)
          fetchStudentDetail(studentId)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load student progress data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams, toast])

  // Fetch student detail
  const fetchStudentDetail = async (studentId: string) => {
    try {
      const response = await fetch(`/api/admin/analytics/student-progress/${studentId}`)
      const data = await response.json()
      setStudentDetail(data.student)
    } catch (error) {
      console.error("Error fetching student detail:", error)
      toast({
        title: "Error",
        description: "Failed to load student details. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
    fetchStudentDetail(studentId)

    // Update URL without refreshing the page
    const params = new URLSearchParams(searchParams.toString())
    params.set("student", studentId)
    router.push(`/dashboard/admin/analytics/student-progress?${params.toString()}`)
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedStudent(null)
    setStudentDetail(null)

    // Update URL without refreshing the page
    const params = new URLSearchParams(searchParams.toString())
    params.delete("student")
    router.push(`/dashboard/admin/analytics/student-progress?${params.toString()}`)
  }

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Export data to CSV
  const exportToCSV = () => {
    toast({
      title: "Export Started",
      description: "Student progress data is being exported to CSV.",
    })
    // In a real implementation, this would generate and download a CSV file
  }

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search filter
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Course filter
        const matchesCourse =
          courseFilter === "all" || student.courseProgress.some((cp) => cp.courseId === courseFilter)

        // Progress filter
        const matchesProgress =
          progressFilter === "all" ||
          (progressFilter === "low" && student.overallProgress < 30) ||
          (progressFilter === "medium" && student.overallProgress >= 30 && student.overallProgress < 70) ||
          (progressFilter === "high" && student.overallProgress >= 70)

        // Date range filter
        const lastActiveDate = new Date(student.lastActive)
        const matchesDateRange = lastActiveDate >= dateRange.from && lastActiveDate <= dateRange.to

        return matchesSearch && matchesCourse && matchesProgress && matchesDateRange
      })
      .sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "progress":
            comparison = a.overallProgress - b.overallProgress
            break
          case "lastActive":
            comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
            break
          case "timeSpent":
            comparison = a.totalTimeSpent - b.totalTimeSpent
            break
          case "enrolledCourses":
            comparison = a.enrolledCourses - b.enrolledCourses
            break
          case "completedCourses":
            comparison = a.completedCourses - b.completedCourses
            break
          default:
            comparison = 0
        }

        return sortOrder === "asc" ? comparison : -comparison
      })
  }, [students, searchTerm, courseFilter, progressFilter, dateRange, sortBy, sortOrder])

  // Calculate activity data for charts
  const activityData = useMemo(() => {
    if (!stats) return []

    return stats.activityOverTime.map((day) => ({
      date: format(new Date(day.date), "MMM dd"),
      activeUsers: day.activeUsers,
      lessonsCompleted: day.lessonsCompleted,
      timeSpent: Math.round(day.timeSpent / 60), // Convert to hours
    }))
  }, [stats])

  // Calculate course engagement data for charts
  const courseEngagementData = useMemo(() => {
    if (!stats) return []

    return stats.courseEngagement.map((course) => ({
      name: course.courseTitle,
      enrollments: course.enrollments,
      progress: course.averageProgress,
      timeSpent: Math.round(course.averageTimeSpent / 60), // Convert to hours
    }))
  }, [stats])

  // Calculate student activity data for charts
  const studentActivityData = useMemo(() => {
    if (!studentDetail) return []

    return studentDetail.activityByDay.map((day) => ({
      date: format(new Date(day.date), "MMM dd"),
      timeSpent: Math.round(day.timeSpent / 60), // Convert to hours
      lessonsCompleted: day.lessonsCompleted,
    }))
  }, [studentDetail])

  // Calculate student course progress data for charts
  const studentCourseData = useMemo(() => {
    if (!studentDetail) return []

    return studentDetail.courseProgress.map((course) => ({
      name: course.courseTitle,
      progress: course.progress,
      timeSpent: Math.round(course.timeSpent / 60), // Convert to hours
    }))
  }, [studentDetail])

  // Calculate quiz score distribution
  const quizScoreDistribution = useMemo(() => {
    if (!studentDetail?.quizScores) return []

    return [
      { name: "90-100%", value: 0 },
      { name: "80-89%", value: 0 },
      { name: "70-79%", value: 0 },
      { name: "60-69%", value: 0 },
      { name: "Below 60%", value: 0 },
    ]
    // In a real implementation, this would calculate the distribution from actual quiz scores
  }, [studentDetail])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Student detail view
  if (selectedStudent && studentDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to List
            </Button>
            <h1 className="text-2xl font-bold">{studentDetail.name}</h1>
            <Badge variant="outline">{studentDetail.email}</Badge>
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentDetail.overallProgress}%</div>
              <Progress value={studentDetail.overallProgress} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentDetail.completedCourses}/{studentDetail.enrolledCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((studentDetail.completedCourses / studentDetail.enrolledCourses) * 100) || 0}% completion
                rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(studentDetail.totalTimeSpent / 60)}h {studentDetail.totalTimeSpent % 60}m
              </div>
              <p className="text-xs text-muted-foreground">
                Avg. {Math.round(studentDetail.totalTimeSpent / studentDetail.enrolledCourses)} min per course
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentDetail.quizScores.average}%</div>
              <p className="text-xs text-muted-foreground">
                {studentDetail.quizScores.passed}/{studentDetail.quizScores.total} quizzes passed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={detailView} onValueChange={(value) => setDetailView(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Learning Activity</CardTitle>
                  <CardDescription>Time spent learning over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={studentActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="timeSpent" name="Hours Spent" stroke="#8884d8" />
                        <Line type="monotone" dataKey="lessonsCompleted" name="Lessons Completed" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Progress across enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={studentCourseData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="progress" name="Progress %" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Distribution of quiz scores</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={quizScoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {quizScoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Enrollment</CardTitle>
                <CardDescription>Details of all enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentDetail.courseProgress.map((course) => (
                    <div key={course.courseId} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{course.courseTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last accessed: {format(new Date(course.lastAccessed), "PPP")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{course.progress}%</div>
                          <Progress value={course.progress} className="w-[100px]" />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {Math.floor(course.timeSpent / 60)}h {course.timeSpent % 60}m spent
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.progress === 100 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-500">Completed</span>
                            </>
                          ) : course.progress > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-blue-500">In Progress</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-amber-500">Not Started</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>Performance on course quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                    <div>Quiz</div>
                    <div>Course</div>
                    <div>Score</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y">
                    {/* This would be populated with actual quiz data in a real implementation */}
                    <div className="grid grid-cols-5 px-4 py-3">
                      <div>Technical Analysis Basics</div>
                      <div>Technical Analysis Masterclass</div>
                      <div>85%</div>
                      <div>
                        <Badge variant="success">Passed</Badge>
                      </div>
                      <div>May 15, 2023</div>
                    </div>
                    <div className="grid grid-cols-5 px-4 py-3">
                      <div>Candlestick Patterns</div>
                      <div>Technical Analysis Masterclass</div>
                      <div>92%</div>
                      <div>
                        <Badge variant="success">Passed</Badge>
                      </div>
                      <div>May 18, 2023</div>
                    </div>
                    <div className="grid grid-cols-5 px-4 py-3">
                      <div>Options Basics</div>
                      <div>Options Trading Fundamentals</div>
                      <div>78%</div>
                      <div>
                        <Badge variant="success">Passed</Badge>
                      </div>
                      <div>June 2, 2023</div>
                    </div>
                    <div className="grid grid-cols-5 px-4 py-3">
                      <div>Advanced Options Strategies</div>
                      <div>Options Trading Fundamentals</div>
                      <div>65%</div>
                      <div>
                        <Badge variant="success">Passed</Badge>
                      </div>
                      <div>June 10, 2023</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* This would be populated with actual activity data in a real implementation */}
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="space-y-1 pb-8">
                      <p className="text-sm text-muted-foreground">June 15, 2023 at 2:30 PM</p>
                      <h4 className="font-semibold">Completed Lesson</h4>
                      <p>Completed "Introduction to Candlestick Patterns" in Technical Analysis Masterclass</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="space-y-1 pb-8">
                      <p className="text-sm text-muted-foreground">June 14, 2023 at 4:15 PM</p>
                      <h4 className="font-semibold">Completed Quiz</h4>
                      <p>Scored 92% on "Candlestick Patterns Quiz" in Technical Analysis Masterclass</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="space-y-1 pb-8">
                      <p className="text-sm text-muted-foreground">June 12, 2023 at 10:45 AM</p>
                      <h4 className="font-semibold">Started Course</h4>
                      <p>Enrolled in "Options Trading Fundamentals"</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">June 10, 2023 at 3:20 PM</p>
                      <h4 className="font-semibold">Learning Session</h4>
                      <p>Spent 45 minutes on "Support and Resistance Levels" in Technical Analysis Masterclass</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Student list view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Progress Analytics</h1>
        <p className="text-muted-foreground">Track and analyze student progress across all courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.activeStudents || 0} active in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageProgress || 0}%</div>
            <Progress value={stats?.averageProgress || 0} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">of enrolled courses completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((stats?.averageTimeSpent || 0) / 60)}h {(stats?.averageTimeSpent || 0) % 60}m
            </div>
            <p className="text-xs text-muted-foreground">per student per course</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
                <CardDescription>Student activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="activeUsers" name="Active Users" stroke="#8884d8" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="lessonsCompleted"
                        name="Lessons Completed"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Course Engagement</CardTitle>
                <CardDescription>Student engagement by course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courseEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="enrollments" name="Enrollments" fill="#8884d8" />
                      <Bar dataKey="progress" name="Avg. Progress %" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Distribution</CardTitle>
              <CardDescription>Distribution of student progress across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "0-25%", value: 20 },
                        { name: "26-50%", value: 30 },
                        { name: "51-75%", value: 25 },
                        { name: "76-100%", value: 25 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
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

              <Select value={progressFilter} onValueChange={setProgressFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Progress</SelectItem>
                  <SelectItem value="low">Low (0-30%)</SelectItem>
                  <SelectItem value="medium">Medium (30-70%)</SelectItem>
                  <SelectItem value="high">High (70-100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <DateRangePicker value={dateRange} onChange={setDateRange} />

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
                  <DropdownMenuItem onClick={() => handleSort("timeSpent")}>
                    Sort by Time Spent {sortBy === "timeSpent" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("enrolledCourses")}>
                    Sort by Enrolled Courses {sortBy === "enrolledCourses" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>{filteredStudents.length} students found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="rounded-lg border p-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleStudentSelect(student.id)}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm">Progress: {student.overallProgress}%</span>
                        <Progress value={student.overallProgress} className="w-[100px]" />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Courses: {student.completedCourses}/{student.enrolledCourses}
                        </div>
                        <div>Last Active: {format(new Date(student.lastActive), "MMM d, yyyy")}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block">
                  <div className="grid grid-cols-7 border-b px-4 py-3 font-medium">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Progress</div>
                    <div>Courses</div>
                    <div>Time Spent</div>
                    <div>Last Active</div>
                    <div></div>
                  </div>
                  <div className="divide-y">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="grid grid-cols-7 items-center px-4 py-3 hover:bg-accent/50 cursor-pointer"
                        onClick={() => handleStudentSelect(student.id)}
                      >
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                        <div className="flex items-center gap-2">
                          <Progress value={student.overallProgress} className="w-[60px]" />
                          <span className="text-sm">{student.overallProgress}%</span>
                        </div>
                        <div>
                          {student.completedCourses}/{student.enrolledCourses}
                        </div>
                        <div>
                          {Math.floor(student.totalTimeSpent / 60)}h {student.totalTimeSpent % 60}m
                        </div>
                        <div>{format(new Date(student.lastActive), "MMM d, yyyy")}</div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Engagement</CardTitle>
              <CardDescription>Student engagement metrics by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                  <div className="col-span-2">Course</div>
                  <div>Enrollments</div>
                  <div>Avg. Progress</div>
                  <div>Completion Rate</div>
                  <div>Avg. Time Spent</div>
                </div>
                <div className="divide-y">
                  {stats?.courseEngagement.map((course) => (
                    <div key={course.courseId} className="grid grid-cols-6 items-center px-4 py-3">
                      <div className="col-span-2 font-medium">{course.courseTitle}</div>
                      <div>{course.enrollments}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={course.averageProgress} className="w-[60px]" />
                        <span className="text-sm">{course.averageProgress}%</span>
                      </div>
                      <div>
                        {Math.round((course.averageProgress / 100) * course.enrollments)} / {course.enrollments}
                      </div>
                      <div>
                        {Math.floor(course.averageTimeSpent / 60)}h {course.averageTimeSpent % 60}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
