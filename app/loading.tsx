import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
