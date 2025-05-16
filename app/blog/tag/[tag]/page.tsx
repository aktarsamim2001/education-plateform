import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

async function getBlogPostsByTag(tag: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/tag/${tag}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch blog posts")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)

  return {
    title: `#${tag} Articles | Stock Market Education Blog`,
    description: `Read our latest articles tagged with #${tag} in the stock market.`,
  }
}

export default async function BlogTagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)

  const postsData = await getBlogPostsByTag(tag)
  const posts = postsData?.posts || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">#{tag}</span>
        </nav>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>
            <p className="text-muted-foreground">Browse our latest articles tagged with #{tag} in the stock market.</p>
          </div>

          <Separator />

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No articles found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find any articles with this tag. Please check back later.
              </p>
              <Button asChild>
                <Link href="/blog">Browse All Articles</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.tags.slice(0, 2).map((t: string) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className={t === tag ? "bg-primary text-primary-foreground" : ""}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More Articles</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
