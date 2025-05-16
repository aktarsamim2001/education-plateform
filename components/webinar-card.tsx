import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface WebinarCardProps {
  webinar: any
  showInstructor?: boolean
}

export function WebinarCard({ webinar, showInstructor = true }: WebinarCardProps) {
  const isUpcoming = new Date(webinar.startDate) > new Date()
  const isLive = webinar.status === "live"

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={webinar.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={webinar.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {isLive ? (
          <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">Live Now</Badge>
        ) : isUpcoming ? (
          <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">Upcoming</Badge>
        ) : (
          <Badge className="absolute left-2 top-2">Completed</Badge>
        )}
        {webinar.isFeatured && (
          <Badge className="absolute right-2 top-2 bg-primary hover:bg-primary/90">Featured</Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {webinar.level}
            </Badge>
            <Badge variant="outline">{webinar.category}</Badge>
          </div>
          <CardTitle className="line-clamp-2 text-lg">
            <Link href={`/webinars/${webinar.slug}`} className="hover:underline">
              {webinar.title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(webinar.startDate).toLocaleDateString()} at{" "}
              {new Date(webinar.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{webinar.duration} min</span>
          </div>
          {showInstructor && webinar.instructorId && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>
                {webinar.instructorId.firstName} {webinar.instructorId.lastName}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="font-bold">
          {webinar.price === 0 ? (
            "Free"
          ) : (
            <>
              ${webinar.discountPrice || webinar.price}
              {webinar.discountPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">${webinar.price}</span>
              )}
            </>
          )}
        </div>
        <Link href={`/webinars/${webinar.slug}`} passHref>
          <Button variant="outline" size="sm">
            {isLive ? "Join Now" : isUpcoming ? "Register" : "View Recording"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
