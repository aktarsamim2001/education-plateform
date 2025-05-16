"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { CreditCard, CheckCircle2, ArrowLeft, Shield, LockIcon, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import RazorpayPayment from "@/components/razorpay-payment"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [courseDetails, setCourseDetails] = useState({
    id: "",
    title: "",
    price: 0,
    image: "",
  })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  useEffect(() => {
    // Get course details from URL parameters
    const courseId = searchParams.get("courseId")
    const title = searchParams.get("title")
    const price = searchParams.get("price")
    const image = searchParams.get("image")

    if (!courseId || !title || !price) {
      toast({
        title: "Missing course information",
        description: "Please select a course from the course page.",
        variant: "destructive",
      })
      router.push("/courses")
      return
    }

    setCourseDetails({
      id: courseId,
      title: title || "Course",
      price: Number.parseFloat(price) || 0,
      image: image || "/placeholder.svg",
    })

    // Pre-fill user data if available
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
  }, [searchParams, session, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)

      // Redirect to thank you page with order details
      router.push(
        `/thank-you?orderId=${Date.now()}&courseId=${courseDetails.id}&title=${encodeURIComponent(courseDetails.title)}`,
      )
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/courses/${courseDetails.id}`} className="hover:text-foreground">
            {courseDetails.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main checkout form */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Checkout</h1>
              <Link
                href={`/courses/${courseDetails.id}`}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to course
              </Link>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay with Credit Card
                    </CardTitle>
                    <CardDescription>Enter your card details to complete your purchase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="123 Main St"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="Mumbai"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              placeholder="Maharashtra"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              placeholder="400001"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              placeholder="India"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              name="cardCvc"
                              placeholder="123"
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Processing..." : `Pay $${courseDetails.price.toFixed(2)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="razorpay" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pay with Razorpay</CardTitle>
                    <CardDescription>Complete your purchase securely with Razorpay</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium">Course Details</div>
                        <div className="text-sm text-muted-foreground">
                          Order #RZP-{Date.now().toString().slice(-6)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 overflow-hidden rounded">
                          <Image
                            src={courseDetails.image || "/placeholder.svg"}
                            alt={courseDetails.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{courseDetails.title}</div>
                          <div className="text-sm text-muted-foreground">Lifetime Access</div>
                        </div>
                        <div className="font-bold">${courseDetails.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <RazorpayPayment
                        itemId={courseDetails.id}
                        itemType="course"
                        amount={courseDetails.price * 100}
                        name={courseDetails.title}
                        description={`Enrollment for ${courseDetails.title}`}
                        buttonText="Pay with Razorpay"
                        buttonClassName="w-full"
                        onSuccess={() => {
                          router.push(
                            `/thank-you?orderId=RZP-${Date.now().toString().slice(-6)}&courseId=${courseDetails.id}&title=${encodeURIComponent(courseDetails.title)}`,
                          )
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Transfer</CardTitle>
                    <CardDescription>Transfer the amount directly to our bank account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm text-muted-foreground">Bank Name:</div>
                        <div className="text-sm font-medium">HDFC Bank</div>

                        <div className="text-sm text-muted-foreground">Account Name:</div>
                        <div className="text-sm font-medium">Stock Market Education Pvt Ltd</div>

                        <div className="text-sm text-muted-foreground">Account Number:</div>
                        <div className="text-sm font-medium">XXXX XXXX XXXX 1234</div>

                        <div className="text-sm text-muted-foreground">IFSC Code:</div>
                        <div className="text-sm font-medium">HDFC0001234</div>

                        <div className="text-sm text-muted-foreground">Amount:</div>
                        <div className="text-sm font-medium">${courseDetails.price.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        Please use your email address as the payment reference. Your order will be processed once the
                        funds are cleared in our account.
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        toast({
                          title: "Bank transfer initiated",
                          description: "Please complete the transfer using the details provided.",
                        })
                        setTimeout(() => {
                          router.push(
                            `/thank-you?orderId=BT-${Date.now().toString().slice(-6)}&courseId=${courseDetails.id}&title=${encodeURIComponent(courseDetails.title)}&paymentMethod=bank`,
                          )
                        }, 2000)
                      }}
                      className="w-full"
                    >
                      I've Completed the Transfer
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order summary */}
          <div className="w-full md:w-96">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded">
                    <Image
                      src={courseDetails.image || "/placeholder.svg"}
                      alt={courseDetails.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-2">{courseDetails.title}</div>
                    <div className="text-sm text-muted-foreground">Lifetime Access</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Price</span>
                    <span>${courseDetails.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${courseDetails.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/30 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">30-Day Money-Back Guarantee</span>
                      <p className="text-muted-foreground">Not satisfied? Get a full refund within 30 days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Secure Checkout</span>
                      <p className="text-muted-foreground">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-center border-t p-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <LockIcon className="mr-1 h-3 w-3" />
                  Secure Checkout
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
