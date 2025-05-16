"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentCourses } from "@/lib/react-query/queries"
import { setEnrolledCourses } from "@/lib/redux/slices/courseSlice"

export default function StudentCoursesPage() {
  const { data: courses, isLoading, error } = useStudentCourses()
  const dispatch = useDispatch()

  useEffect(() => {
    if (courses) {
      dispatch(setEnrolledCourses(courses))
    }
  }, [courses, dispatch])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Courses</h1>
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
        <h2 className="text-xl font-semibold mb-2">Failed to load courses</h2>
        <p className="text-muted-foreground mb-4">Please try again later</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (courses?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h2>
        <p className="text-muted-foreground mb-4">Browse our courses and start learning today</p>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link href="/courses">
          <Button variant="outline">Browse More Courses</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={course.coverImage || "/placeholder.svg?height=200&width=300"}
                alt={course.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2">{course.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress?.percentage || 0}%</span>
                </div>
                <Progress value={course.progress?.percentage || 0} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/student/courses/${course.slug}`} className="w-full">
                <Button className="w-full">Continue Learning</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
