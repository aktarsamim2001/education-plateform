"use client"

interface RichContentProps {
  content: string
  className?: string
}

export default function RichContent({ content, className = "" }: RichContentProps) {
  return (
    <div
      className={`prose prose-sm sm:prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
