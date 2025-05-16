import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center dark:bg-gray-900">
      <Wrench className="h-20 w-20 text-primary" />
      <h1 className="mt-6 text-3xl font-bold">We'll Be Right Back</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Our site is currently undergoing scheduled maintenance. We apologize for any inconvenience and appreciate your
        patience.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Expected completion: <span className="font-medium">June 15, 2023 at 2:00 PM EST</span>
      </p>
      <Button className="mt-6" asChild>
        <a href="mailto:support@stockedu.com">Contact Support</a>
      </Button>
    </div>
  )
}
