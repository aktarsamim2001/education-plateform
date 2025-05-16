"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { RouteGuard } from "@/components/route-guard"

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the user is authenticated and has the correct role
    if (status === "authenticated") {
      if (session?.user?.role !== "instructor" && session?.user?.role !== "admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    } else if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname || "/dashboard/instructor")}`)
    }
  }, [status, session, router, pathname])

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={["instructor", "admin"]}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2 md:gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                  <nav className="flex flex-col gap-4 py-4">
                    <Link href="/dashboard/instructor" className="flex items-center gap-2 text-lg font-semibold">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Instructor Portal</span>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard/instructor"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          isActive("/dashboard/instructor")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/instructor/courses"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          pathname?.startsWith("/dashboard/instructor/courses")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Courses</span>
                      </Link>
                      <Link
                        href="/dashboard/instructor/webinars"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          pathname?.startsWith("/dashboard/instructor/webinars")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Webinars</span>
                      </Link>
                      <Link
                        href="/dashboard/instructor/students"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          pathname?.startsWith("/dashboard/instructor/students")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </Link>
                      <Link
                        href="/dashboard/instructor/messages"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          pathname?.startsWith("/dashboard/instructor/messages")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                      <Link
                        href="/dashboard/instructor/settings"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          pathname?.startsWith("/dashboard/instructor/settings")
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link href="/dashboard/instructor" className="flex items-center gap-2 md:gap-3">
                <span className="text-xl font-bold">StockEdu</span>
                <span className="hidden text-sm font-medium md:inline-block">Instructor Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Instructor"} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || "I"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-flex">{session?.user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/instructor/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/instructor/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-8">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard/instructor"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive("/dashboard/instructor")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/instructor/courses"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname?.startsWith("/dashboard/instructor/courses")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link
                href="/dashboard/instructor/webinars"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname?.startsWith("/dashboard/instructor/webinars")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Webinars</span>
              </Link>
              <Link
                href="/dashboard/instructor/students"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname?.startsWith("/dashboard/instructor/students")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Students</span>
              </Link>
              <Link
                href="/dashboard/instructor/messages"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname?.startsWith("/dashboard/instructor/messages")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Link>
              <Link
                href="/dashboard/instructor/settings"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  pathname?.startsWith("/dashboard/instructor/settings")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">{children}</main>
        </div>
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RouteGuard>
  )
}
