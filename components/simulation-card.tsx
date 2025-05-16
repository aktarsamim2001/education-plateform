import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, DollarSign, BarChart } from "lucide-react"

interface SimulationCardProps {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  initialCapital: number
  stockCount: number
  isCompleted?: boolean
  finalCapital?: number
}

export function SimulationCard({
  id,
  title,
  description,
  difficulty,
  duration,
  initialCapital,
  stockCount,
  isCompleted = false,
  finalCapital,
}: SimulationCardProps) {
  const difficultyColor = {
    beginner: "text-green-600",
    intermediate: "text-amber-600",
    advanced: "text-red-600",
  }

  const profit = finalCapital ? finalCapital - initialCapital : 0
  const profitPercentage = finalCapital ? ((finalCapital - initialCapital) / initialCapital) * 100 : 0
  const isProfitable = profit > 0

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <span className={`text-xs font-medium capitalize ${difficultyColor[difficulty]}`}>{difficulty}</span>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} days</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${initialCapital.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{stockCount} stocks</span>
          </div>
        </div>

        {isCompleted && finalCapital && (
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex items-center gap-2 ${isProfitable ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">
                {isProfitable ? "+" : ""}
                {profitPercentage.toFixed(2)}% (${profit.toLocaleString()})
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/student/simulations/${id}`} className="w-full">
          <Button className="w-full">{isCompleted ? "Review Simulation" : "Start Simulation"}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
