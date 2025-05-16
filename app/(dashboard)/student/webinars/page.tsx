"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentWebinars } from "@/lib/react-query/queries"
import { setRegisteredWebinars } from "@/lib/redux/slices/webinarSlice"
import { Calendar, Clock, Users } from "lucide-react"

export default function StudentWebinarsPage() {
  const { data: webinars, isLoading, error } = useStudentWebinars()
  const dispatch = useDispatch()

  useEffect(() => {
    if (webinars) {
      dispatch(setRegisteredWebinars(webinars))
    }
  }, [webinars, dispatch])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Webinars</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">Failed to load webinars</h2>
        <p className="text-muted-foreground mb-4">Please try again later</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (webinars?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">You haven't registered for any webinars yet</h2>
        <p className="text-muted-foreground mb-4">Browse our webinars and register today</p>
        <Link href="/webinars">
          <Button>Browse Webinars</Button>
        </Link>
      </div>
    )
  }

  // Separate upcoming and past webinars
  const now = new Date()
  const upcomingWebinars = webinars?.filter((webinar) => new Date(webinar.startDate) > now) || []
  const pastWebinars = webinars?.filter((webinar) => new Date(webinar.startDate) <= now) || []

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Webinars</h1>
        <Link href="/webinars">
          <Button variant="outline">Browse More Webinars</Button>
        </Link>
      </div>

      {upcomingWebinars.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Webinars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={webinar.coverImage || "/placeholder.svg?height=200&width=300"}
                    alt={webinar.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {new Date(webinar.startDate) > new Date() ? "Upcoming" : "Live"}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{webinar.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{webinar.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(webinar.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(webinar.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{webinar.registeredCount || 0} registered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/student/webinars/${webinar.slug}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastWebinars.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Past Webinars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWebinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={webinar.coverImage || "/placeholder.svg?height=200&width=300"}
                    alt={webinar.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2" variant="outline">
                    Completed
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{webinar.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{webinar.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(webinar.startDate).toLocaleDateString()}</span>
                    </div>
                    {webinar.recordingUrl && (
                      <div className="flex items-center gap-2 text-green-600">
                        <span>Recording Available</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/student/webinars/${webinar.slug}`} className="w-full">
                    <Button className="w-full" variant={webinar.recordingUrl ? "default" : "outline"}>
                      {webinar.recordingUrl ? "Watch Recording" : "View Details"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
