"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required.",
  }),
  content: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["published", "draft", "archived"]),
  isIndexed: z.boolean().default(true),
  type: z.string(),
})

export default function EditPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [pageData, setPageData] = useState(null)
  const [isLoadingPage, setIsLoadingPage] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      isIndexed: true,
      type: "Static",
    },
  })

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoadingPage(true)
      try {
        // In a real implementation, fetch the page data from the API
        // const response = await fetch(`/api/admin/pages/${params.id}`)
        // if (!response.ok) throw new Error("Failed to fetch page")
        // const data = await response.json()
        // setPageData(data.page)

        // For demonstration, use sample data
        const samplePage = {
          id: params.id,
          title: "About Us",
          slug: "/about",
          content: "<h1>About Our Company</h1><p>We are a leading provider of stock market education...</p>",
          metaTitle: "About Us | Stock Market Education",
          metaDescription: "Learn about our company and our mission to educate traders.",
          status: "published",
          isIndexed: true,
          type: "Static",
          lastUpdated: "2023-05-20",
        }

        setPageData(samplePage)

        // Set form values
        form.reset({
          title: samplePage.title,
          slug: samplePage.slug,
          content: samplePage.content,
          metaTitle: samplePage.metaTitle,
          metaDescription: samplePage.metaDescription,
          status: samplePage.status as "published" | "draft" | "archived",
          isIndexed: samplePage.isIndexed,
          type: samplePage.type,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load page data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPage(false)
      }
    }

    fetchPageData()
  }, [params.id, form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // In a real implementation, send the data to the API
      // const response = await fetch(`/api/admin/pages/${params.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(values),
      // })

      // if (!response.ok) throw new Error("Failed to update page")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Page updated successfully.",
      })

      router.push("/dashboard/admin/content/manage")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Page Content</CardTitle>
                  <CardDescription>Edit the main content of your page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter page title" {...field} />
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
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="/page-url" {...field} />
                        </FormControl>
                        <FormDescription>The URL path for this page (e.g., /about)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter page content (HTML supported)"
                            className="min-h-[300px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>HTML content for the page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                  <CardDescription>Optimize your page for search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter meta title" {...field} />
                        </FormControl>
                        <FormDescription>The title that appears in search engine results</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter meta description" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormDescription>A brief description of the page for search results</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isIndexed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Search Engine Indexing</FormLabel>
                          <FormDescription>Allow search engines to index this page</FormDescription>
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

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                  <CardDescription>Configure additional page settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The current status of the page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select page type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Main">Main</SelectItem>
                            <SelectItem value="Static">Static</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Landing">Landing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The type of page</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
