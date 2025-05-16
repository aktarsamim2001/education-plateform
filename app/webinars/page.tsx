import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WebinarCard } from "@/components/webinar-card"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getWebinars(searchParams) {
  await dbConnect()

  // Build query
  const query: any = { status: "published" }

  if (searchParams.category) {
    query.category = searchParams.category
  }

  // Filter by upcoming/past
  const now = new Date()
  if (searchParams.timeframe === "upcoming") {
    query.date = { $gte: now }
  } else if (searchParams.timeframe === "past") {
    query.date = { $lt: now }
  }

  // Build sort
  let sortOptions = {}
  if (searchParams.sort === "popular") {
    sortOptions = { registrations: -1 }
  } else if (searchParams.timeframe === "past") {
    sortOptions = { date: -1 } // Most recent past webinars first
  } else {
    // Default sort upcoming webinars by date (soonest first)
    sortOptions = { date: 1 }
  }

  // Execute query
  const webinars = await Webinar.find(query)
    .sort(sortOptions)
    .populate("instructor", "firstName lastName avatar")
    .lean()

  return webinars
}

export default async function WebinarsPage({ searchParams }) {
  const webinars = await getWebinars(searchParams)

  // Separate upcoming and past webinars
  const now = new Date()
  const upcomingWebinars = webinars.filter((webinar) => new Date(webinar.date) >= now)
  const pastWebinars = webinars.filter((webinar) => new Date(webinar.date) < now)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Webinars</h1>
          <p className="text-muted-foreground">
            Join our live webinars to learn from industry experts and improve your trading skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search webinars..." className="w-full pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Sort</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming Webinars</h2>
          {upcomingWebinars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingWebinars.map((webinar) => (
                <WebinarCard key={webinar._id} webinar={webinar} isUpcoming={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="text-xl font-semibold">No upcoming webinars</h3>
              <p className="text-muted-foreground mt-2">Check back soon for new webinar announcements.</p>
            </div>
          )}
        </div>

        {/* Past Webinars */}
        {pastWebinars.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Past Webinars</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastWebinars.map((webinar) => (
                <WebinarCard key={webinar._id} webinar={webinar} isUpcoming={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
