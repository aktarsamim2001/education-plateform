"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { RichEditor } from "@/components/rich-editor"

const moduleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.string().min(1, "Status is required"),
  isRequired: z.boolean().default(false),
  order: z.coerce.number().int().min(0, "Order must be a positive number"),
})

export default function AdminModuleEditPage() {
  const { id } = useParams()
  const isNew = id === "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(!isNew)
  const [videos, setVideos] = useState([])
  const [attachments, setAttachments] = useState([])
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingAttachment, setUploadingAttachment] = useState(false)

  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      content: "",
      status: "draft",
      isRequired: true,
      order: 0,
    },
  })

  useEffect(() => {
    if (!isNew) {
      fetchModuleData()
    }
  }, [id, isNew])

  const fetchModuleData = async () => {
    try {
      const response = await fetch(`/api/admin/modules/${id}`)
      if (!response.ok) throw new Error("Failed to fetch module")

      const data = await response.json()
      const module = data.module

      form.reset({
        title: module.title,
        slug: module.slug,
        description: module.description,
        category: module.category,
        content: module.content,
        status: module.status,
        isRequired: module.isRequired,
        order: module.order,
      })

      setVideos(module.videos || [])
      setAttachments(module.attachments || [])
    } catch (error) {
      console.error("Error fetching module:", error)
      toast({
        title: "Error",
        description: "Failed to load module data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const moduleData = {
        ...data,
        videos,
        attachments,
      }

      const url = isNew ? "/api/admin/modules" : `/api/admin/modules/${id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moduleData),
      })

      if (!response.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} module`)

      toast({
        title: "Success",
        description: `Module ${isNew ? "created" : "updated"} successfully.`,
      })

      router.push("/dashboard/admin/modules")
    } catch (error) {
      console.error("Error saving module:", error)
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} module. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    setUploadingVideo(true)

    try {
      // In a real implementation, you would upload the video to a storage service
      // and get back a URL. For this example, we'll simulate that.
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newVideo = {
        id: `video-${Date.now()}`,
        title: "New Video",
        url: "https://example.com/video.mp4",
        duration: 300, // 5 minutes in seconds
        thumbnail: "/placeholder.svg?height=120&width=200",
      }

      setVideos([...videos, newVideo])

      toast({
        title: "Video Added",
        description: "Video has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleAddAttachment = async (e) => {
    e.preventDefault()
    setUploadingAttachment(true)

    try {
      // In a real implementation, you would upload the file to a storage service
      // and get back a URL. For this example, we'll simulate that.
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newAttachment = {
        id: `attachment-${Date.now()}`,
        title: "New Attachment",
        url: "https://example.com/file.pdf",
        type: "pdf",
        size: "1.2 MB",
      }

      setAttachments([...attachments, newAttachment])

      toast({
        title: "Attachment Added",
        description: "Attachment has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add attachment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingAttachment(false)
    }
  }

  const handleRemoveVideo = (videoId) => {
    setVideos(videos.filter((video) => video.id !== videoId))
  }

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== attachmentId))
  }

  const handleUpdateVideoTitle = (videoId, newTitle) => {
    setVideos(videos.map((video) => (video.id === videoId ? { ...video, title: newTitle } : video)))
  }

  const handleUpdateAttachmentTitle = (attachmentId, newTitle) => {
    setAttachments(
      attachments.map((attachment) =>
        attachment.id === attachmentId ? { ...attachment, title: newTitle } : attachment,
      ),
    )
  }

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/admin/modules">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Create New Module" : "Edit Module"}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isNew ? "Create Module" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Videos & Attachments</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information about the module.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter module title" {...field} />
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
                            <Input placeholder="module-slug" {...field} />
                          </FormControl>
                          <FormDescription>Used in the URL: /modules/module-slug</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description of the module" className="resize-none" {...field} />
                        </FormControl>
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
                              <SelectItem value="options-trading">Options Trading</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>Determines the order in which modules are displayed</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                          <FormDescription>Only published modules are visible to students</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Required Module</FormLabel>
                            <FormDescription>Students must complete this module to progress</FormDescription>
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
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Module Content</CardTitle>
                  <CardDescription>Create the main content for this module.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RichEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter the module content here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Videos</CardTitle>
                  <CardDescription>Add video content to this module.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={handleAddVideo} disabled={uploadingVideo}>
                      {uploadingVideo ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Add Video
                        </>
                      )}
                    </Button>
                  </div>

                  {videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Videos Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Add videos to enhance your module content.</p>
                      <Button onClick={handleAddVideo} disabled={uploadingVideo}>
                        {uploadingVideo ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Add First Video
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {videos.map((video) => (
                        <div key={video.id} className="flex items-start gap-4 rounded-md border p-4">
                          <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={video.thumbnail || "/placeholder.svg?height=80&width=128"}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={video.title}
                              onChange={(e) => handleUpdateVideoTitle(video.id, e.target.value)}
                              className="font-medium"
                            />
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>
                                Duration: {Math.floor(video.duration / 60)}:
                                {(video.duration % 60).toString().padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveVideo(video.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>Add downloadable files to this module.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={handleAddAttachment} disabled={uploadingAttachment}>
                      {uploadingAttachment ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Add Attachment
                        </>
                      )}
                    </Button>
                  </div>

                  {attachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Attachments Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Add downloadable files for your students.</p>
                      <Button onClick={handleAddAttachment} disabled={uploadingAttachment}>
                        {uploadingAttachment ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Add First Attachment
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-4 rounded-md border p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                            <span className="text-xs uppercase">{attachment.type}</span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <Input
                              value={attachment.title}
                              onChange={(e) => handleUpdateAttachmentTitle(attachment.id, e.target.value)}
                              className="font-medium"
                            />
                            <div className="text-sm text-muted-foreground">
                              <span>{attachment.size}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveAttachment(attachment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
