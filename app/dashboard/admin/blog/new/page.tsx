"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  featuredImage: z.string().url("Featured image must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  authorId: z.string().min(1, "Author is required"),
  status: z.string().min(1, "Status is required"),
  isFeatured: z.boolean().default(false),
})

export default function NewBlogPage() {
  const router = useRouter()
  const { toast } = useToast()()
  const [isLoading, setIsLoading] = useState(false)
  const [authors, setAuthors] = useState([])
  const [newTag, setNewTag] = useState("")

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      category: "",
      tags: [],
      authorId: "",
      status: "draft",
      isFeatured: false,
    },
  })

  // Fetch authors when component mounts
  useState(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/admin/authors")
        if (!response.ok) throw new Error("Failed to fetch authors")

        const data = await response.json()
        setAuthors(data.authors)
      } catch (error) {
        console.error("Error fetching authors:", error)
        toast({
          title: "Error",
          description: "Failed to load authors. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchAuthors()
  }, [toast])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create blog post")

      toast({
        title: "Success",
        description: "Blog post created successfully",
      })

      router.push("/dashboard/admin/blog")
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues("tags") || []
      form.setValue("tags", [...currentTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (index) => {
    const currentTags = form.getValues("tags") || []
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/admin/blog">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Creating..." : "Publish Post"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic information about the blog post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
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
                        <Input placeholder="blog-post-slug" {...field} />
                      </FormControl>
                      <FormDescription>Used in the URL: /blog/blog-post-slug</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief summary of the blog post" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short summary that appears in blog listings (150 characters max)
                    </FormDescription>
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
                        placeholder="Full blog post content (Markdown supported)"
                        className="min-h-[300px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>URL to the blog post featured image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <SelectItem value="market-news">Market News</SelectItem>
                          <SelectItem value="investing-basics">Investing Basics</SelectItem>
                          <SelectItem value="trading-strategies">Trading Strategies</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Tags</h3>
                  <p className="text-sm text-muted-foreground">Add tags to help categorize your blog post</p>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {form.watch("tags")?.map((tag, index) => (
                    <li key={index} className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => removeTag(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Only published posts are visible to users</FormDescription>
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
                        <FormLabel className="text-base">Featured Post</FormLabel>
                        <FormDescription>Display this post on the homepage featured section</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
