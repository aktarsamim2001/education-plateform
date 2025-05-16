"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Eye, Plus, Trash2, ArrowUpDown, MoreHorizontal, Calendar, Clock } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { DataTable } from "@/components/admin/data-table"

// Define the Webinar type
type Webinar = {
  id: string
  title: string
  slug: string
  thumbnail: string
  price: number
  isFree: boolean
  category: string
  date: string
  time: string
  status: string
  attendees: number
  instructor: string
  createdAt: string
  updatedAt: string
}

export default function AdminWebinarsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [webinarToDelete, setWebinarToDelete] = useState<Webinar | null>(null)

  // Fetch webinars
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/admin/webinars")
        if (!response.ok) throw new Error("Failed to fetch webinars")
        const data = await response.json()
        setWebinars(data.webinars)
      } catch (error) {
        console.error("Error fetching webinars:", error)
        toast({
          title: "Error",
          description: "Failed to load webinars. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebinars()
  }, [toast])

  const handleDelete = async () => {
    if (!webinarToDelete) return

    try {
      const response = await fetch(`/api/webinars/${webinarToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWebinars((prev) => prev.filter((webinar) => webinar.id !== webinarToDelete.id))
        toast({
          title: "Success",
          description: "Webinar deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete webinar")
      }
    } catch (error) {
      console.error("Error deleting webinar:", error)
      toast({
        title: "Error",
        description: "Failed to delete webinar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setWebinarToDelete(null)
    }
  }

  const confirmDelete = (webinar: Webinar) => {
    setWebinarToDelete(webinar)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = async (webinarId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/webinars/${webinarId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setWebinars((prev) =>
          prev.map((webinar) => (webinar.id === webinarId ? { ...webinar, status: newStatus } : webinar)),
        )
        toast({
          title: "Success",
          description: `Webinar status updated to ${newStatus}.`,
        })
      } else {
        throw new Error("Failed to update webinar status")
      }
    } catch (error) {
      console.error("Error updating webinar status:", error)
      toast({
        title: "Error",
        description: "Failed to update webinar status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo<ColumnDef<Webinar>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Webinar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-16 overflow-hidden rounded">
              <Image
                src={row.original.thumbnail || "/placeholder.svg?height=40&width=64"}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="font-medium">{row.original.title}</div>
          </div>
        ),
      },
      {
        accessorKey: "instructor",
        header: "Instructor",
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date & Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{row.original.date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-3 w-3" />
              <span>{row.original.time}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const isFree = row.original.isFree
          const price = row.original.price

          return <span className="font-medium">{isFree ? "Free" : `$${price}`}</span>
        },
      },
      {
        accessorKey: "attendees",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Attendees
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Badge
                    variant={
                      status === "live"
                        ? "destructive"
                        : status === "scheduled"
                          ? "default"
                          : status === "completed"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {status}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "scheduled")}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "live")}>Live</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, "cancelled")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const webinar = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/webinars/${webinar.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/admin/webinars/${webinar.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => confirmDelete(webinar)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Webinar Management</h1>
        <p className="text-muted-foreground">Manage all webinars on the platform</p>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/admin/webinars/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Webinar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webinars</CardTitle>
          <CardDescription>{isLoading ? "Loading webinars..." : `Showing ${webinars.length} webinars`}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={webinars}
            searchKey="title"
            searchPlaceholder="Search webinars..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the webinar "{webinarToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
