import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, ChevronRight, MessageSquare, Share2, Bookmark, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

async function getBlogPostBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${slug}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch blog post")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const postData = await getBlogPostBySlug(slug)
  const post = postData?.post

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Stock Market Education Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Stock Market Education Blog`,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Ensure params.slug is a string
  const slug = params?.slug || ""
  const postData = await getBlogPostBySlug(slug)
  const post = postData?.post || {
    id: "sample-post",
    title: "Understanding Market Trends: A Comprehensive Guide",
    slug: "understanding-market-trends",
    excerpt: "Learn how to identify and analyze market trends to make better trading decisions",
    content: `
      <h2>Introduction to Market Trends</h2>
      <p>Market trends are the general direction in which a market or asset price is moving. Understanding these trends is crucial for any trader or investor looking to make informed decisions.</p>
      
      <p>There are three main types of trends:</p>
      <ul>
        <li><strong>Uptrend:</strong> A series of higher highs and higher lows</li>
        <li><strong>Downtrend:</strong> A series of lower highs and lower lows</li>
        <li><strong>Sideways/Horizontal trend:</strong> Price moves within a range without significant upward or downward movement</li>
      </ul>
      
      <h2>Identifying Market Trends</h2>
      <p>There are several tools and techniques traders use to identify market trends:</p>
      
      <h3>1. Trend Lines</h3>
      <p>Trend lines are one of the simplest and most effective tools for identifying trends. In an uptrend, a trend line is drawn by connecting the lows. In a downtrend, it's drawn by connecting the hig  a trend line is drawn by connecting the lows. In a downtrend, it's drawn by connecting the highs. These lines serve as dynamic support and resistance levels.

<h3>2. Moving Averages</h3>
<p>Moving averages smooth out price data to create a single flowing line, making it easier to identify the direction of the trend. Common types include:</p>
<ul>
  <li>Simple Moving Average (SMA)</li>
  <li>Exponential Moving Average (EMA)</li>
</ul>

<h3>3. Technical Indicators</h3>
<p>Various indicators can help confirm trends:</p>
<ul>
  <li>MACD (Moving Average Convergence Divergence)</li>
  <li>RSI (Relative Strength Index)</li>
  <li>ADX (Average Directional Index)</li>
</ul>

<h2>Trading with the Trend</h2>
<p>"The trend is your friend" is a common saying in trading. Here's how to apply this wisdom:</p>

<h3>Trend Following Strategies</h3>
<p>In an uptrend, look for buying opportunities during pullbacks. In a downtrend, look for selling opportunities during rallies.</p>

<h3>Trend Reversal Signals</h3>
<p>Watch for pattern formations that might indicate a trend reversal:</p>
<ul>
  <li>Double tops/bottoms</li>
  <li>Head and shoulders patterns</li>
  <li>Divergence between price and indicators</li>
</ul>

<h2>Conclusion</h2>
<p>Understanding market trends is fundamental to successful trading. By combining various tools and techniques, traders can better identify the direction of the market and make more informed decisions.</p>
    `,
    authorId: "author-1",
    author: {
      name: "Sarah Johnson",
      title: "Market Analyst",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Sarah is a seasoned market analyst with over 10 years of experience in the financial industry. She specializes in technical analysis and market trends.",
    },
    category: "Technical Analysis",
    tags: ["market trends", "technical analysis", "trading strategies"],
    image: "/placeholder.svg?height=600&width=1200",
    readTime: 8,
    status: "published",
    isFeatured: true,
    views: 1245,
    likes: 87,
    publishedAt: new Date("2023-05-15"),
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-15"),
  }

  if (!post && !postData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
          <span className="text-foreground font-medium">{post.title}</span>
        </nav>

        {/* Post Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{post.category}</Badge>
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author?.avatar || "/placeholder.svg"} alt={post.author?.name || "Author"} />
                <AvatarFallback>{post.author?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <span>{post.author?.name || "Author Name"}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
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

        {/* Featured Image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        {/* Post Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-8/12">
            <article className="prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <Separator className="my-8" />

            {/* Post Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">{post.views} views</div>
            </div>

            {/* Author Bio */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author?.avatar || "/placeholder.svg"} alt={post.author?.name || "Author"} />
                    <AvatarFallback>{post.author?.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{post.author?.name || "Author Name"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{post.author?.title || "Market Expert"}</p>
                    <p className="text-sm mb-3">
                      {post.author?.bio ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                      <Button variant="ghost" size="sm">
                        More Articles
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Comments (12)</h3>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>

              <div className="space-y-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt="Commenter" />
                        <AvatarFallback>CM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Commenter Name</h4>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm">
                          Great article! I found the insights on market trends particularly helpful for my trading
                          strategy.
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                          <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                          <button className="text-xs text-muted-foreground hover:text-foreground">Like</button>
                        </div>
                      </div>
                    </div>
                  ))}

                <Button variant="outline" className="w-full">
                  Load More Comments
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-4/12 space-y-6">
            {/* Popular Posts */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Popular Posts</h3>
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image src="/placeholder.svg" alt="Popular Post" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium line-clamp-2 text-sm">
                          <Link href="#" className="hover:underline">
                            Popular Post Title That Might Be Long and Wrap to Multiple Lines
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>June 10, 2023</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Technical Analysis",
                  "Fundamental Analysis",
                  "Trading Psychology",
                  "Market News",
                  "Options Trading",
                  "Risk Management",
                ].map((category) => (
                  <Badge key={category} variant="outline" className="px-3 py-1">
                    <Link href={`/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}>{category}</Link>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["stocks", "trading", "investing", "analysis", "market", "finance", "economy", "trends"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    <Link href={`/blog/tag/${tag}`}>#{tag}</Link>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-muted-foreground">
                  Get the latest market insights and trading tips delivered to your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
