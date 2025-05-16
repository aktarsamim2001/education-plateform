"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article"
  twitterHandle?: string
}

export function SEO({
  title = "Stock Market Education Platform",
  description = "Learn trading strategies, technical analysis, and market fundamentals from industry experts.",
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterHandle = "@stockedu",
}: SEOProps) {
  const router = useRouter()
  const url = canonical || `https://stockedu.com${router.asPath}`
  const fullTitle = `${title} | StockEdu`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`https://stockedu.com${ogImage}`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="StockEdu" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://stockedu.com${ogImage}`} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}
