"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ChevronRight, Download, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ThankYouPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    courseId: "",
    title: "",
    paymentMethod: "card",
  })

  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams.get("orderId")
    const courseId = searchParams.get("courseId")
    const title = searchParams.get("title")
    const paymentMethod = searchParams.get("paymentMethod") || "card"

    if (!orderId || !courseId || !title) {
      router.push("/courses")
      return
    }

    setOrderDetails({
      orderId: orderId,
      courseId: courseId,
      title: title,
      paymentMethod: paymentMethod,
    })
  }, [searchParams, router])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Order Confirmation</span>
        </nav>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Purchase!</h1>
          <p className="text-muted-foreground">Your order has been successfully processed and confirmed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
            <CardDescription>
              Order #{orderDetails.orderId} • {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-32 overflow-hidden rounded">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt={orderDetails.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{orderDetails.title}</h3>
                <p className="text-sm text-muted-foreground">Lifetime Access</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                <p className="font-medium">
                  {orderDetails.paymentMethod === "bank"
                    ? "Bank Transfer"
                    : orderDetails.paymentMethod === "razorpay"
                      ? "Razorpay"
                      : "Credit Card"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Order Date</h4>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Order ID</h4>
                <p className="font-medium">{orderDetails.orderId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Order Status</h4>
                <div className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">Completed</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={`/courses/${orderDetails.courseId}/learn`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Start Learning
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">What's Next?</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Access Your Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your course is now available in your dashboard. Start learning at your own pace.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/student/courses">
                    Go to My Courses
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Join Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow students and instructors in our learning community.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/community">
                    Explore Community
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Webinars</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check out our upcoming live webinars to enhance your learning experience.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/webinars">
                    View Schedule
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
