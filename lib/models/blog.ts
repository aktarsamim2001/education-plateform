export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  authorId: string
  category: string
  tags: string[]
  image: string
  readTime: number // in minutes
  status: "draft" | "published" | "archived"
  isFeatured: boolean
  views: number
  likes: number
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface BlogComment {
  id: string
  postId: string
  userId: string
  content: string
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}
