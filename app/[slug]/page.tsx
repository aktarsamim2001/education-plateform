import type { Metadata } from "next"
import { notFound } from "next/navigation"
import dbConnect from "@/lib/db-connect"
import { Page } from "@/lib/models/mongodb/page"
import RichContent from "@/components/rich-content"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect()

  const page = await Page.findOne({
    slug: params.slug,
    status: "published",
  }).lean()

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist.",
    }
  }

  return {
    title: page.title,
    description: page.description || page.title,
  }
}

export default async function DynamicPage({ params }: Props) {
  await dbConnect()

  const page = await Page.findOne({
    slug: params.slug,
    status: "published",
  }).lean()

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose prose-lg mx-auto max-w-4xl">
        <h1>{page.title}</h1>
        {page.content && (
          <div className="mt-6">
            <RichContent content={page.content} />
          </div>
        )}
      </div>
    </div>
  )
}
