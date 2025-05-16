import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Award, AlertCircle } from "lucide-react"

interface QuizCardProps {
  id: string
  title: string
  description: string
  questionCount: number
  timeLimit?: number
  isCompleted?: boolean
  score?: number
  passingScore: number
}

export function QuizCard({
  id,
  title,
  description,
  questionCount,
  timeLimit,
  isCompleted = false,
  score = 0,
  passingScore = 70,
}: QuizCardProps) {
  const passed = score >= passingScore

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>{questionCount} Questions</span>
          </div>
          {timeLimit && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeLimit} min</span>
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="mt-4 flex items-center gap-2">
            {passed ? (
              <div className="flex items-center gap-2 text-green-600">
                <Award className="h-5 w-5" />
                <span className="font-medium">Score: {score.toFixed(0)}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Score: {score.toFixed(0)}% (Failed)</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/student/quizzes/${id}`} className="w-full">
          <Button className="w-full">{isCompleted ? (passed ? "Review Quiz" : "Retry Quiz") : "Start Quiz"}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
