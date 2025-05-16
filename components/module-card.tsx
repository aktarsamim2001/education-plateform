import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, FileText, Clock } from "lucide-react"

interface ModuleCardProps {
  id: string
  title: string
  description: string
  hasVideo: boolean
  hasAttachments: boolean
  isCompleted?: boolean
  progress?: number
}

export function ModuleCard({
  id,
  title,
  description,
  hasVideo,
  hasAttachments,
  isCompleted = false,
  progress = 0,
}: ModuleCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {hasVideo && (
            <div className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>Video</span>
            </div>
          )}
          {hasAttachments && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Resources</span>
            </div>
          )}
          {isCompleted ? (
            <div className="ml-auto flex items-center gap-1 text-green-600">
              <span>Completed</span>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{progress}% complete</span>
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/student/modules/${id}`} className="w-full">
          <Button className="w-full">{isCompleted ? "Review Module" : "Continue Learning"}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
