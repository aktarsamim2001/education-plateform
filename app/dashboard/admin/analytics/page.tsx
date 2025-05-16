"use client"

import { useState, useEffect } from "react"
import { BarChart, BookOpen, DollarSign, LineChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      total: 0,
      change: 0,
      data: [],
    },
    users: {
      total: 0,
      change: 0,
      data: [],
    },
    courses: {
      total: 0,
      change: 0,
      data: [],
    },
    webinars: {
      total: 0,
      change: 0,
      data: [],
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch analytics data")
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and growth</p>
      </div>

      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.total.toLocaleString()}</div>
            <p className={`text-xs ${analyticsData.revenue.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {analyticsData.revenue.change >= 0 ? "+" : ""}
              {analyticsData.revenue.change}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.users.total.toLocaleString()}</div>
            <p className={`text-xs ${analyticsData.users.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {analyticsData.users.change >= 0 ? "+" : ""}
              {analyticsData.users.change}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.courses.total}</div>
            <p className={`text-xs ${analyticsData.courses.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {analyticsData.courses.change >= 0 ? "+" : ""}
              {analyticsData.courses.change}% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webinars Held</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.webinars.total}</div>
            <p className={`text-xs ${analyticsData.webinars.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {analyticsData.webinars.change >= 0 ? "+" : ""}
              {analyticsData.webinars.change}% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Revenue chart visualization would appear here</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">User growth chart visualization would appear here</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Course completion and webinar attendance rates</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-4 text-muted-foreground">Engagement chart visualization would appear here</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => fetchAnalytics()}>Refresh Data</Button>
      </div>
    </div>
  )
}
