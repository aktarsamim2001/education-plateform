"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const webinarSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  isFree: z.boolean().default(false),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  instructorId: z.string().min(1, "Instructor is required"),
  meetingUrl: z.string().url("Meeting URL must be a valid URL").optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
  isFeatured: z.boolean().default(false),
  maxAttendees: z.coerce.number().min(1, "Maximum attendees must be at least 1"),
})

export default function EditWebinarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [instructors, setInstructors] = useState([
    { id: "1", name: "Michael Chen" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "David Williams" },
  ])

  const form = useForm({
    resolver: zodResolver(webinarSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      date: "",
      time: "",
      duration: 60,
      price: 0,
      isFree: true,
      category: "",
      thumbnail: "",
      instructorId: "",
      meetingUrl: "",
      status: "scheduled",
      isFeatured: false,
      maxAttendees: 100,
    },
  })

  useEffect(() => {
    const fetchWebinar = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/instructor/webinars/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch webinar")
        }

        const data = await response.json()
        const webinar = data.webinar

        if (webinar) {
          // Format date and time for form
          const webinarDate = new Date(webinar.date)
          const dateString = webinarDate.toISOString().split("T")[0]
          const timeString = webinarDate.toTimeString().slice(0, 5)

          form.reset({
            title: webinar.title || "",
            slug: webinar.slug || "",
            description: webinar.description || "",
            shortDescription: webinar.shortDescription || "",
            date: dateString,
            time: timeString,
            duration: webinar.duration || 60,
            price: webinar.price || 0,
            isFree: webinar.isFree || false,
            category: webinar.category || "",
            thumbnail: webinar.thumbnail || "",
            instructorId: webinar.instructorId || "",
            meetingUrl: webinar.meetingUrl || "",
            status: webinar.status || "scheduled",
            isFeatured: webinar.isFeatured || false,
            maxAttendees: webinar.maxAttendees || 100,
          })
        }
      } catch (error) {
        console.error("Error fetching webinar:", error)
        toast({
          title: "Error",
          description: "Failed to load webinar data. Please try again.",
          variant: "destructive",
        })

        // Use sample data as fallback
        const sampleWebinar = {
          title: "Technical Analysis: Advanced Chart Patterns",
          slug: "technical-analysis-advanced-patterns",
          description:
            "Learn advanced chart patterns to improve your technical analysis skills. This webinar covers complex patterns like head and shoulders, double tops and bottoms, and more.",
          shortDescription: "Master advanced chart patterns for better trading decisions",
          date: "2023-06-29",
          time: "19:00",
          duration: 90,
          price: 39,
          isFree: false,
          category: "technical-analysis",
          thumbnail: "https://example.com/webinar-thumbnail.jpg",
          instructorId: "1",
          meetingUrl: "https://zoom.us/j/123456789",
          status: "scheduled",
          isFeatured: true,
          maxAttendees: 200,
        }

        form.reset(sampleWebinar)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebinar()
  }, [params.id, form, toast])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Format date and time for API
      const formattedData = {
        ...data,
        dateTime: new Date(`${data.date}T${data.time}`).toISOString(),
      }

      const response = await fetch(`/api/instructor/webinars/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update webinar")
      }

      toast({
        title: "Success",
        description: "Webinar updated successfully",
      })

      router.push("/dashboard/instructor/webinars")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update webinar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update slug based on title
  const updateSlug = () => {
    const title = form.getValues("title")
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      form.setValue("slug", slug)
    }
  }

  // Toggle free webinar
  const handleFreeToggle = (checked) => {
    form.setValue("isFree", checked)
    if (checked) {
      form.setValue("price", 0)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/instructor/webinars">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Edit Webinar</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Edit the basic information about the webinar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webinar Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter webinar title"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                if (!form.getValues("slug")) {
                                  setTimeout(updateSlug, 500)
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="webinar-slug" {...field} />
                          </FormControl>
                          <FormDescription>Used in the URL: /webinars/webinar-slug</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the webinar" className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short summary that appears in webinar cards (150 characters max)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the webinar"
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>URL to the webinar thumbnail image</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an instructor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {instructors.map((instructor) => (
                              <SelectItem key={instructor.id} value={instructor.id}>
                                {instructor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webinar Details</CardTitle>
                  <CardDescription>Edit additional details about the webinar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min="15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical-analysis">Technical Analysis</SelectItem>
                            <SelectItem value="fundamental-analysis">Fundamental Analysis</SelectItem>
                            <SelectItem value="trading-psychology">Trading Psychology</SelectItem>
                            <SelectItem value="risk-management">Risk Management</SelectItem>
                            <SelectItem value="options-trading">Options Trading</SelectItem>
                            <SelectItem value="forex-trading">Forex Trading</SelectItem>
                            <SelectItem value="crypto-trading">Crypto Trading</SelectItem>
                            <SelectItem value="market-outlook">Market Outlook</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meetingUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://zoom.us/j/123456789" {...field} />
                        </FormControl>
                        <FormDescription>URL for the webinar meeting (Zoom, Google Meet, etc.)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>Maximum number of attendees allowed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webinar Settings</CardTitle>
                  <CardDescription>Configure additional settings for your webinar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Free Webinar</FormLabel>
                          <FormDescription>Make this webinar free for all attendees</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={handleFreeToggle} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch("isFree") && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Current status of the webinar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Webinar</FormLabel>
                          <FormDescription>Display this webinar on the homepage featured section</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
