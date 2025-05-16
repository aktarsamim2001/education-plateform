import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CourseCard } from "@/components/course-card"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getCourses(searchParams) {
  await dbConnect()

  // Build query
  const query: any = { status: "published" }

  if (searchParams.category) {
    query.category = searchParams.category
  }

  if (searchParams.level) {
    query.level = searchParams.level
  }

  // Build sort
  let sortOptions = {}
  if (searchParams.sort === "popular") {
    sortOptions = { enrolledStudents: -1 }
  } else if (searchParams.sort === "price-low") {
    sortOptions = { price: 1 }
  } else if (searchParams.sort === "price-high") {
    sortOptions = { price: -1 }
  } else if (searchParams.sort === "rating") {
    sortOptions = { rating: -1 }
  } else {
    // Default sort by newest
    sortOptions = { createdAt: -1 }
  }

  // Execute query
  const courses = await Course.find(query).sort(sortOptions).populate("instructor", "firstName lastName avatar").lean()

  return courses
}

export default async function CoursesPage({ searchParams }) {
  const courses = await getCourses(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Browse our comprehensive courses on stock market trading and investment
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
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

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => <CourseCard key={course._id} course={course} />)
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold">No courses found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
