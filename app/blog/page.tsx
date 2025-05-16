import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlogCard } from "@/components/blog-card"
import dbConnect from "@/lib/db-connect"
import { BlogPost } from "@/lib/models/mongodb/blog"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getBlogPosts(searchParams) {
  await dbConnect()

  // Build query
  const query: any = { status: "published" }

  if (searchParams.category && searchParams.category !== "all") {
    query.category = searchParams.category
  }

  if (searchParams.search) {
    query.$or = [
      { title: { $regex: searchParams.search, $options: "i" } },
      { excerpt: { $regex: searchParams.search, $options: "i" } },
      { content: { $regex: searchParams.search, $options: "i" } },
    ]
  }

  // Build sort
  let sortOptions = {}
  if (searchParams.sort === "popular") {
    sortOptions = { views: -1 }
  } else if (searchParams.sort === "trending") {
    sortOptions = { likes: -1 }
  } else {
    // Default sort by newest
    sortOptions = { publishedAt: -1 }
  }

  // Execute query
  const posts = await BlogPost.find(query).sort(sortOptions).populate("author", "firstName lastName avatar").lean()

  return posts
}

export default async function BlogPage({ searchParams }) {
  const posts = await getBlogPosts(searchParams)

  // Get featured post (most recent or most viewed)
  const featuredPost = posts.length > 0 ? posts[0] : null
  const regularPosts = posts.length > 1 ? posts.slice(1) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">Educational articles on stock market tips, trends, and strategies</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search articles..." className="w-full pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical Analysis</SelectItem>
                <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                <SelectItem value="psychology">Trading Psychology</SelectItem>
                <SelectItem value="economy">Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="relative aspect-video md:w-1/2">
                <Image
                  src={featuredPost.coverImage || "/placeholder.svg?height=400&width=600"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute left-2 top-2 bg-primary hover:bg-primary/90">Featured</Badge>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{featuredPost.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-2xl">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                      {featuredPost.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">{featuredPost.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={featuredPost.author?.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={`${featuredPost.author?.firstName} ${featuredPost.author?.lastName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {featuredPost.author?.firstName} {featuredPost.author?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{featuredPost.readTime || 5} min read</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 pt-4">
                  <Link href={`/blog/${featuredPost.slug}`} passHref>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </CardFooter>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          !featuredPost && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-xl font-semibold">No blog posts found</h3>
              <p className="text-muted-foreground mt-2">Check back soon for new articles.</p>
            </div>
          )
        )}

        {/* Pagination */}
        {posts.length > 9 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <span className="sr-only">Previous page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <Button variant="outline" size="icon">
              <span className="sr-only">Next page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-8 rounded-lg bg-muted p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="max-w-[600px] text-muted-foreground">
              Get the latest market insights, trading tips, and educational content delivered to your inbox.
            </p>
            <div className="w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
