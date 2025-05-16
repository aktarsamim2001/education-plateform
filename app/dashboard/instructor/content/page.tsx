"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2, BookOpen, FileText, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Course {
  _id: string
  title: string
  description: string
  price: number
  level: string
  slug: string
  createdAt: string
}

interface Webinar {
  _id: string
  title: string
  description: string
  date: string
  duration: number
  slug: string
}

interface BlogPost {
  _id: string
  title: string
  content: string
  category: string
  tags: string[]
  slug: string
  createdAt: string
}

export default function InstructorContentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("courses")
  const [courses, setCourses] = useState<Course[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const { toast } = useToast()

  // Content states
  // const [courses, setCourses] = useState([])
  // const [webinars, setWebinars] = useState([])
  // const [blogPosts, setBlogPosts] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchContent()
    }
  }, [status, activeTab])

  const fetchContent = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (activeTab === "courses" || activeTab === "all") {
        const coursesRes = await fetch("/api/instructor/courses")
        if (!coursesRes.ok) throw new Error("Failed to fetch courses")
        const coursesData = await coursesRes.json()
        setCourses(coursesData.courses || [])
      }

      if (activeTab === "webinars" || activeTab === "all") {
        const webinarsRes = await fetch("/api/instructor/webinars")
        if (!webinarsRes.ok) throw new Error("Failed to fetch webinars")
        const webinarsData = await webinarsRes.json()
        setWebinars(webinarsData.webinars || [])
      }

      if (activeTab === "blog" || activeTab === "all") {
        const blogRes = await fetch("/api/instructor/blog")
        if (!blogRes.ok) throw new Error("Failed to fetch blog posts")
        const blogData = await blogRes.json()
        setBlogPosts(blogData.blogs || [])
      }
    } catch (err) {
      setError("Failed to load content. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   fetchContent()
  // }, [])

  // const fetchContent = async () => {
  //   setIsLoading(true)
  //   try {
  //     // In a real implementation, these would be separate API calls
  //     // For now, we'll use sample data
  //     await Promise.all([
  //       fetchCourses(),
  //       fetchWebinars(),
  //       fetchBlogPosts()
  //     ])
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to load content. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const fetchCourses = async () => {
  //   // In a real implementation, this would fetch from your API
  //   // For now, we'll use sample data
  //   setCourses(sampleCourses)
  // }

  // const fetchWebinars = async () => {
  //   // In a real implementation, this would fetch from your API
  //   // For now, we'll use sample data
  //   setWebinars(sampleWebinars)
  // }

  // const fetchBlogPosts = async () => {
  //   // In a real implementation, this would fetch from your API
  //   // For now, we'll use sample data
  //   setBlogPosts(sampleBlogPosts)
  // }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return
    }

    try {
      const res = await fetch(`/api/instructor/${type}/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error(`Failed to delete ${type}`)

      // Update state based on the content type
      if (type === "courses") {
        setCourses(courses.filter((course) => course._id !== id))
      } else if (type === "webinars") {
        setWebinars(webinars.filter((webinar) => webinar._id !== id))
      } else if (type === "blog") {
        setBlogPosts(blogPosts.filter((post) => post._id !== id))
      }

      alert("Item deleted successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to delete item. Please try again.")
    }
  }

  // const handleDelete = async () => {
  //   if (!itemToDelete) return

  //   try {
  //     // In a real implementation, this would call your API
  //     if (itemToDelete.type === 'course') {
  //       setCourses(courses.filter(course => course.id !== itemToDelete.id))
  //     } else if (itemToDelete.type === 'webinar') {
  //       setWebinars(webinars.filter(webinar => webinar.id !== itemToDelete.id))
  //     } else if (itemToDelete.type === 'blog') {
  //       setBlogPosts(blogPosts.filter(post => post.id !== itemToDelete.id))
  //     }

  //     toast({
  //       title: "Success",
  //       description: `${itemToDelete.title} has been deleted.`,
  //     })
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete item. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setDeleteDialogOpen(false)
  //     setItemToDelete(null)
  //   }
  // }

  const handleEdit = (type: string, id: string) => {
    router.push(`/dashboard/instructor/${type}/${id}/edit`)
  }

  const handleCreate = (type: string) => {
    router.push(`/dashboard/instructor/${type}/new`)
  }

  // const confirmDelete = (item: any, type: string) => {
  //   setItemToDelete({ ...item, type })
  //   setDeleteDialogOpen(true)
  // }

  // Filter and sort content based on user selections
  // const filterContent = (items: any[], type: string) => {
  //   return items.filter(item => {
  //     const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
  //     const matchesStatus = statusFilter === "all" || item.status === statusFilter
  //     return matchesSearch && matchesStatus
  //   }).sort((a, b) => {
  //     if (sortBy === "newest") {
  //       return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  //     } else if (sortBy === "oldest") {
  //       return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  //     } else if (sortBy === "popular") {
  //       const aPopularity = type === 'course' ? a.students : (type === 'webinar' ? a.attendees : a.views)
  //       const bPopularity = type === 'course' ? b.students : (type === 'webinar' ? b.attendees : b.views)
  //       return bPopularity - aPopularity
  //     } else if (sortBy === "alphabetical") {
  //       return a.title.localeCompare(b.title)
  //     }
  //     return 0
  //   })
  // }

  const filterContent = (items: any[], term: string) => {
    if (!term) return items
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(term.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(term.toLowerCase())),
    )
  }

  const sortContent = (items: any[], option: string) => {
    const sorted = [...items]

    switch (option) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime(),
        )
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime(),
        )
      case "a-z":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case "z-a":
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return sorted
    }
  }

  const filteredCourses = sortContent(filterContent(courses, searchTerm), sortOption)
  const filteredWebinars = sortContent(filterContent(webinars, searchTerm), sortOption)
  const filteredBlogPosts = sortContent(filterContent(blogPosts, searchTerm), sortOption)

  // const filteredCourses = filterContent(courses, 'course')
  // const filteredWebinars = filterContent(webinars, 'webinar')
  // const filteredBlogPosts = filterContent(blogPosts, 'blog')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Sample data for demonstration
  // const sampleCourses = [
  //   {
  //     id: "1",
  //     title: "Technical Analysis Masterclass",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     price: 199,
  //     students: 3245,
  //     rating: 4.8,
  //     status: "published",
  //     slug: "technical-analysis-masterclass",
  //     updatedAt: "2023-05-20T10:30:00Z",
  //   },
  //   {
  //     id: "2",
  //     title: "Market Psychology: Understanding Crowd Behavior",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     price: 149,
  //     students: 2180,
  //     rating: 4.7,
  //     status: "published",
  //     slug: "market-psychology",
  //     updatedAt: "2023-04-15T14:20:00Z",
  //   },
  //   {
  //     id: "3",
  //     title: "Risk Management for Traders",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     price: 249,
  //     students: 1890,
  //     rating: 4.9,
  //     status: "published",
  //     slug: "risk-management-for-traders",
  //     updatedAt: "2023-03-10T09:15:00Z",
  //   },
  //   {
  //     id: "4",
  //     title: "Advanced Chart Patterns",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     price: 229,
  //     students: 1560,
  //     rating: 4.6,
  //     status: "draft",
  //     slug: "advanced-chart-patterns",
  //     updatedAt: "2023-06-01T16:45:00Z",
  //   },
  //   {
  //     id: "5",
  //     title: "Swing Trading Strategies",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     price: 129,
  //     students: 1245,
  //     rating: 4.5,
  //     status: "draft",
  //     slug: "swing-trading-strategies",
  //     updatedAt: "2023-05-28T11:30:00Z",
  //   },
  // ]

  // const sampleWebinars = [
  //   {
  //     id: "1",
  //     title: "Market Outlook 2023: Opportunities and Risks",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     date: "2023-06-15T19:00:00Z",
  //     price: 49,
  //     attendees: 245,
  //     status: "scheduled",
  //     slug: "market-outlook-2023",
  //     updatedAt: "2023-05-10T08:20:00Z",
  //   },
  //   {
  //     id: "2",
  //     title: "Technical Analysis: Advanced Chart Patterns",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     date: "2023-06-29T19:00:00Z",
  //     price: 39,
  //     attendees: 180,
  //     status: "scheduled",
  //     slug: "technical-analysis-advanced-patterns",
  //     updatedAt: "2023-05-15T14:30:00Z",
  //   },
  //   {
  //     id: "3",
  //     title: "Risk Management Essentials",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     date: "2023-07-13T18:30:00Z",
  //     price: 0,
  //     attendees: 120,
  //     status: "scheduled",
  //     slug: "risk-management-essentials",
  //     updatedAt: "2023-05-20T10:15:00Z",
  //   },
  // ]

  // const sampleBlogPosts = [
  //   {
  //     id: "1",
  //     title: "Understanding Market Trends: A Comprehensive Guide",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     category: "Technical Analysis",
  //     views: 1245,
  //     status: "published",
  //     slug: "understanding-market-trends",
  //     updatedAt: "2023-05-15T09:30:00Z",
  //   },
  //   {
  //     id: "2",
  //     title: "The Psychology of Successful Trading",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     category: "Trading Psychology",
  //     views: 980,
  //     status: "published",
  //     slug: "psychology-of-successful-trading",
  //     updatedAt: "2023-04-20T11:45:00Z",
  //   },
  //   {
  //     id: "3",
  //     title: "Risk Management Strategies for Volatile Markets",
  //     thumbnail: "/placeholder.svg?height=40&width=64",
  //     category: "Risk Management",
  //     views: 875,
  //     status: "draft",
  //     slug: "risk-management-strategies",
  //     updatedAt: "2023-06-01T15:20:00Z",
  //   },
  // ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => handleCreate(activeTab === "blog" ? "blog" : activeTab)}>
            Create New {activeTab === "all" ? "Content" : activeTab.slice(0, -1)}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="text-center py-8">Loading content...</div>
          ) : (
            <>
              {filteredCourses.length === 0 && filteredWebinars.length === 0 && filteredBlogPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No content found. Create some content to get started!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredCourses.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <BookOpen className="mr-2 h-5 w-5" /> Courses
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.slice(0, 3).map((course) => (
                          <Card key={course._id}>
                            <CardHeader>
                              <CardTitle>{course.title}</CardTitle>
                              <CardDescription>{course.description.substring(0, 50)}...</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between items-center">
                              <Button variant="secondary" size="sm" onClick={() => handleEdit("courses", course._id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete("courses", course._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      {filteredCourses.length > 3 && (
                        <Link href="/dashboard/instructor/courses" className="block mt-4 text-blue-500 hover:underline">
                          View All Courses
                        </Link>
                      )}
                    </div>
                  )}

                  {filteredWebinars.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Calendar className="mr-2 h-5 w-5" /> Webinars
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWebinars.slice(0, 3).map((webinar) => (
                          <Card key={webinar._id}>
                            <CardHeader>
                              <CardTitle>{webinar.title}</CardTitle>
                              <CardDescription>{webinar.description.substring(0, 50)}...</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between items-center">
                              <Button variant="secondary" size="sm" onClick={() => handleEdit("webinars", webinar._id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete("webinars", webinar._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      {filteredWebinars.length > 3 && (
                        <Link
                          href="/dashboard/instructor/webinars"
                          className="block mt-4 text-blue-500 hover:underline"
                        >
                          View All Webinars
                        </Link>
                      )}
                    </div>
                  )}

                  {filteredBlogPosts.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <FileText className="mr-2 h-5 w-5" /> Blog Posts
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogPosts.slice(0, 3).map((post) => (
                          <Card key={post._id}>
                            <CardHeader>
                              <CardTitle>{post.title}</CardTitle>
                              <CardDescription>{post.content.substring(0, 50)}...</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between items-center">
                              <Button variant="secondary" size="sm" onClick={() => handleEdit("blog", post._id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete("blog", post._id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      {filteredBlogPosts.length > 3 && (
                        <Link href="/dashboard/instructor/blog" className="block mt-4 text-blue-500 hover:underline">
                          View All Blog Posts
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="courses">
          {isLoading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : (
            <>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No courses found. Create your first course!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card key={course._id}>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description.substring(0, 50)}...</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <Button variant="secondary" size="sm" onClick={() => handleEdit("courses", course._id)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete("courses", course._id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="webinars">
          {isLoading ? (
            <div className="text-center py-8">Loading webinars...</div>
          ) : (
            <>
              {filteredWebinars.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No webinars found. Schedule your first webinar!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWebinars.map((webinar) => (
                    <Card key={webinar._id}>
                      <CardHeader>
                        <CardTitle>{webinar.title}</CardTitle>
                        <CardDescription>{webinar.description.substring(0, 50)}...</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <p>Date: {formatDate(webinar.date)}</p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit("webinars", webinar._id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("webinars", webinar._id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="blog">
          {isLoading ? (
            <div className="text-center py-8">Loading blog posts...</div>
          ) : (
            <>
              {filteredBlogPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No blog posts found. Write your first blog post!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogPosts.map((post) => (
                    <Card key={post._id}>
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>{post.content.substring(0, 50)}...</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <p>Created At: {formatDate(post.createdAt)}</p>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit("blog", post._id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete("blog", post._id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
