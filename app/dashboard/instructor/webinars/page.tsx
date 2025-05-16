"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Eye, Plus, Search, Trash2, Calendar, Users, Clock } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InstructorWebinarsPage() {
  const [webinars, setWebinars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [webinarToDelete, setWebinarToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchWebinars()
  }, [])

  const fetchWebinars = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/instructor/webinars")

      if (!response.ok) {
        throw new Error("Failed to fetch webinars")
      }

      const data = await response.json()
      setWebinars(data.webinars || [])
    } catch (error) {
      console.error("Error fetching webinars:", error)
      toast({
        title: "Error",
        description: "Failed to load webinars. Please try again.",
        variant: "destructive",
      })
      // Fallback to sample data if API fails
      setWebinars(sampleWebinars)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!webinarToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/instructor/webinars/${webinarToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete webinar")
      }

      // Filter out the deleted webinar
      setWebinars(webinars.filter((webinar) => webinar.id !== webinarToDelete.id))

      toast({
        title: "Success",
        description: "Webinar deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting webinar:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete webinar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setWebinarToDelete(null)
    }
  }

  const confirmDelete = (webinar) => {
    setWebinarToDelete(webinar)
    setDeleteDialogOpen(true)
  }

  // Sample data for demonstration
  const sampleWebinars = [
    {
      id: "1",
      title: "Market Outlook 2023: Opportunities and Risks",
      thumbnail: "/placeholder.svg?height=40&width=64",
      date: "June 15, 2023",
      time: "7:00 PM EST",
      price: 49,
      attendees: 245,
      status: "scheduled",
      slug: "market-outlook-2023",
    },
    {
      id: "2",
      title: "Technical Analysis: Advanced Chart Patterns",
      thumbnail: "/placeholder.svg?height=40&width=64",
      date: "June 29, 2023",
      time: "7:00 PM EST",
      price: 39,
      attendees: 180,
      status: "scheduled",
      slug: "technical-analysis-advanced-patterns",
    },
    {
      id: "3",
      title: "Risk Management Essentials",
      thumbnail: "/placeholder.svg?height=40&width=64",
      date: "July 13, 2023",
      time: "6:30 PM EST",
      price: 0,
      attendees: 120,
      status: "scheduled",
      slug: "risk-management-essentials",
    },
    {
      id: "4",
      title: "Options Trading Strategies",
      thumbnail: "/placeholder.svg?height=40&width=64",
      date: "May 20, 2023",
      time: "7:00 PM EST",
      price: 59,
      attendees: 310,
      status: "completed",
      slug: "options-trading-strategies",
    },
    {
      id: "5",
      title: "Cryptocurrency Trading Fundamentals",
      thumbnail: "/placeholder.svg?height=40&width=64",
      date: "May 5, 2023",
      time: "6:00 PM EST",
      price: 29,
      attendees: 275,
      status: "completed",
      slug: "crypto-trading-fundamentals",
    },
  ]

  // Filter webinars based on search term and status
  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || webinar.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Webinars</h1>
        <p className="text-muted-foreground">Manage your webinars and track registrations</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <Button asChild>
            <Link href="/dashboard/instructor/webinars/new">
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Webinar
            </Link>
          </Button>
        </div>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search webinars..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Webinars</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading webinars..."
                  : `Showing ${filteredWebinars.length} of ${webinars.length} webinars`}
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
                      <TableHead>Webinar</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWebinars.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No webinars found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWebinars.map((webinar) => (
                        <TableRow key={webinar.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-16 overflow-hidden rounded">
                                <Image
                                  src={webinar.thumbnail || "/placeholder.svg?height=40&width=64"}
                                  alt={webinar.title}
                                  width={64}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              <div className="font-medium">{webinar.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{webinar.date}</div>
                              <div className="text-sm text-muted-foreground">{webinar.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{webinar.price === 0 ? "Free" : `$${webinar.price}`}</TableCell>
                          <TableCell>{webinar.attendees}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                webinar.status === "live"
                                  ? "destructive"
                                  : webinar.status === "scheduled"
                                    ? "default"
                                    : webinar.status === "completed"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {webinar.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/webinars/${webinar.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/instructor/webinars/${webinar.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => confirmDelete(webinar)}>
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
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webinar Calendar</CardTitle>
              <CardDescription>View your scheduled webinars in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Calendar View</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Calendar view allows you to visualize your webinar schedule. This feature is coming soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webinar Analytics</CardTitle>
              <CardDescription>Track performance and engagement of your webinars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,130</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">52 min</div>
                    <p className="text-xs text-muted-foreground">+3 min from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,234</div>
                    <p className="text-xs text-muted-foreground">+14.2% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the webinar "{webinarToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
