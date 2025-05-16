import { Loader2 } from "lucide-react"

export function LoadingSpinner({
  size = "default",
  className = "",
}: { size?: "sm" | "default" | "lg"; className?: string }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClass}`} />
    </div>
  )
}
