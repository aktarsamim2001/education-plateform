import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BlogCardProps {
  post: any
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.coverImage || "/placeholder.svg?height=200&width=300"}
          alt={post.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{post.category}</Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="line-clamp-2 mt-2 text-lg">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author?.avatar || "/placeholder.svg"} alt={post.author?.name} />
            <AvatarFallback>
              {post.author?.firstName?.charAt(0)}
              {post.author?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {post.author?.firstName} {post.author?.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{post.readTime || 5} min read</span>
        </div>
      </CardFooter>
    </Card>
  )
}
