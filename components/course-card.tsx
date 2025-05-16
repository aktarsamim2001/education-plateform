import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, Star, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseCardProps {
  course: any
  showInstructor?: boolean
}

export function CourseCard({ course, showInstructor = true }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={course.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {course.isBestseller && (
          <Badge className="absolute left-2 top-2 bg-yellow-500 hover:bg-yellow-600">Bestseller</Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {course.level}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
          </div>
          <CardTitle className="line-clamp-2 text-lg">
            <Link href={`/courses/${course.slug}`} className="hover:underline">
              {course.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {showInstructor && course.instructorId && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>
                {course.instructorId.firstName} {course.instructorId.lastName}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0} lessons</span>
          </div>
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span>
                {course.rating.toFixed(1)} ({course.reviews})
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="font-bold">
          {course.price === 0 ? (
            "Free"
          ) : (
            <>
              ${course.discountPrice || course.price}
              {course.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">${course.price}</span>
              )}
            </>
          )}
        </div>
        <Link href={`/courses/${course.slug}`} passHref>
          <Badge>View Course</Badge>
        </Link>
      </CardFooter>
    </Card>
  )
}
