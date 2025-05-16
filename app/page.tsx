import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import components
import Header from "@/components/header"
import Footer from "@/components/footer"

// Define metadata for SEO
export const metadata: Metadata = {
  title: "Stock Market Education Platform - Learn Trading & Investing",
  description:
    "Learn stock market trading and investing with our comprehensive courses and webinars. Expert instructors, real-world strategies, and a supportive community.",
  keywords: "stock market, trading, investing, finance education, stock courses, webinars",
}

// Import dynamic components with loading fallbacks
const FeaturedCourses = dynamic(() => import("@/components/featured-courses"), {
  loading: () => <CoursesLoadingSkeleton />,
  ssr: false,
})

const UpcomingWebinars = dynamic(() => import("@/components/upcoming-webinars"), {
  loading: () => <WebinarsLoadingSkeleton />,
  ssr: false,
})

const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => <TestimonialsLoadingSkeleton />,
  ssr: false,
})

const BlogPosts = dynamic(() => import("@/components/blog-posts"), {
  loading: () => <BlogLoadingSkeleton />,
  ssr: false,
})

import dynamic from "next/dynamic"
import CoursesLoadingSkeleton from "@/components/skeletons/courses-skeleton"
import WebinarsLoadingSkeleton from "@/components/skeletons/webinars-skeleton"
import TestimonialsLoadingSkeleton from "@/components/skeletons/testimonials-skeleton"
import BlogLoadingSkeleton from "@/components/skeletons/blog-skeleton"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                  Master the Stock Market
                </h1>
                <p className="mb-6 text-lg md:text-xl">
                  Learn trading strategies, investment techniques, and market analysis from industry experts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link href="/webinars">Upcoming Webinars</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Stock market education"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Why Choose Our Platform</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
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
                      className="h-6 w-6 text-blue-600"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Expert Instructors</h3>
                  <p className="text-muted-foreground">
                    Learn from industry professionals with years of experience in the stock market.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
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
                      className="h-6 w-6 text-blue-600"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Comprehensive Curriculum</h3>
                  <p className="text-muted-foreground">
                    From basics to advanced strategies, our courses cover all aspects of stock market trading.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3">
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
                      className="h-6 w-6 text-blue-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Real-Time Practice</h3>
                  <p className="text-muted-foreground">
                    Apply what you learn with simulated trading environments and real market data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Content Tabs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Featured Content</h2>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="webinars">Webinars</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
              </TabsList>
              <TabsContent value="courses">
                <Suspense fallback={<CoursesLoadingSkeleton />}>
                  <FeaturedCourses />
                </Suspense>
              </TabsContent>
              <TabsContent value="webinars">
                <Suspense fallback={<WebinarsLoadingSkeleton />}>
                  <UpcomingWebinars />
                </Suspense>
              </TabsContent>
              <TabsContent value="blog">
                <Suspense fallback={<BlogLoadingSkeleton />}>
                  <BlogPosts />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">What Our Students Say</h2>
            <Suspense fallback={<TestimonialsLoadingSkeleton />}>
              <Testimonials />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Your Trading Journey?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Join thousands of students who have transformed their understanding of the stock market and improved their
              trading results.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              <Link href="/auth/register">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
