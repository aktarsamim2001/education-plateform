"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
})

const socialSchema = z.object({
  twitter: z.string().url("Twitter URL must be valid").optional().or(z.literal("")),
  linkedin: z.string().url("LinkedIn URL must be valid").optional().or(z.literal("")),
  github: z.string().url("GitHub URL must be valid").optional().or(z.literal("")),
  website: z.string().url("Website URL must be valid").optional().or(z.literal("")),
})

export default function StudentProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      avatar: "",
      bio: "",
      phone: "",
      location: "",
    },
  })

  const socialForm = useForm({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      twitter: "",
      linkedin: "",
      github: "",
      website: "",
    },
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        // In a real app, you would fetch the user profile from the API
        // For now, we'll use the session data and mock some additional fields

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const userData = {
          firstName: session.user.name?.split(" ")[0] || "",
          lastName: session.user.name?.split(" ")[1] || "",
          email: session.user.email || "",
          avatar: session.user.image || "",
          bio: "Stock market enthusiast and learning investor.",
          phone: "+1 (555) 123-4567",
          location: "New York, USA",
        }

        const socialData = {
          twitter: "https://twitter.com/username",
          linkedin: "https://linkedin.com/in/username",
          github: "https://github.com/username",
          website: "https://example.com",
        }

        profileForm.reset(userData)
        socialForm.reset(socialData)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [session, profileForm, socialForm, toast])

  const onSubmitProfile = async (data) => {
    setIsLoading(true)
    try {
      // In a real app, you would update the user profile via API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitSocial = async (data) => {
    setIsLoading(true)
    try {
      // In a real app, you would update the social links via API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Social links updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update social links. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={profileForm.watch("avatar") || ""} alt="Profile picture" />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {profileForm.watch("firstName")} {profileForm.watch("lastName")}
            </h2>
            <p className="text-sm text-muted-foreground">{profileForm.watch("email")}</p>
            <p className="text-sm text-muted-foreground mt-2">{profileForm.watch("location")}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" disabled {...field} />
                              </FormControl>
                              <FormDescription>Your email address cannot be changed</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>City, Country</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea className="min-h-[120px]" {...field} />
                            </FormControl>
                            <FormDescription>Tell us a little about yourself</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...socialForm}>
                    <form onSubmit={socialForm.handleSubmit(onSubmitSocial)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={socialForm.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter</FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={socialForm.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={socialForm.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={socialForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Social Links
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
