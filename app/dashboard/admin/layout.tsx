"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Settings,
  Video,
  FileQuestion,
  TrendingUp,
  Award,
  Loader2,
  BarChart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RouteGuard } from "@/components/route-guard"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the user is authenticated and has the correct role
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    } else if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname || "/dashboard/admin")}`)
    }
  }, [status, session, router, pathname])

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/admin/courses", label: "Courses", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/dashboard/admin/modules", label: "Learning Modules", icon: <Video className="h-5 w-5" /> },
    { href: "/dashboard/admin/quizzes", label: "Quizzes", icon: <FileQuestion className="h-5 w-5" /> },
    { href: "/dashboard/admin/simulations", label: "Market Simulations", icon: <TrendingUp className="h-5 w-5" /> },
    { href: "/dashboard/admin/webinars", label: "Webinars", icon: <Video className="h-5 w-5" /> },
    { href: "/dashboard/admin/blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/admin/progress", label: "Student Progress", icon: <Award className="h-5 w-5" /> },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> },
    { href: "/dashboard/admin/content", label: "Content", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/admin/pages", label: "Pages", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

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
    <RouteGuard allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
          <div className="flex h-20 items-center justify-between px-4">
            <h1 className={`text-xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}>Admin Dashboard</h1>
            <button onClick={toggleSidebar} className="rounded-md p-2 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mt-1 flex items-center rounded-md px-4 py-3 transition-colors ${
                  pathname === item.href ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden"}`}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/*<header className="sticky top-0 z-40 border-b bg-background">
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
                      <Link href="/dashboard/admin" className="flex items-center gap-2 text-lg font-semibold">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/dashboard/admin"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            isActive("/dashboard/admin")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Home className="h-4 w-4" />
                          <span>Overview</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/users"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/users")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Users className="h-4 w-4" />
                          <span>Users</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/courses"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/courses")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Courses</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/webinars"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/webinars")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Video className="h-4 w-4" />
                          <span>Webinars</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/blog"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/blog")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Blog</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/analytics"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/analytics")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <BarChart2 className="h-4 w-4" />
                          <span>Analytics</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/content"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/content")
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Globe className="h-4 w-4" />
                          <span>Pages</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/settings"
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                            pathname?.startsWith("/dashboard/admin/settings")
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
                <Link href="/dashboard/admin" className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl font-bold">StockEdu</span>
                  <span className="hidden text-sm font-medium md:inline-block">Admin Portal</span>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
                        <AvatarFallback>{session?.user?.name?.charAt(0) || "A"}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-flex">{session?.user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin/settings">Settings</Link>
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
                  href="/dashboard/admin"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    isActive("/dashboard/admin")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/users")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/dashboard/admin/courses"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/courses")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </Link>
                <Link
                  href="/dashboard/admin/webinars"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/webinars")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>Webinars</span>
                </Link>
                <Link
                  href="/dashboard/admin/blog"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/blog")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Blog</span>
                </Link>
                <Link
                  href="/dashboard/admin/analytics"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/analytics")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/dashboard/admin/content"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/content")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>Pages</span>
                </Link>
                <Link
                  href="/dashboard/admin/settings"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                    pathname?.startsWith("/dashboard/admin/settings")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            </aside>*/}
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
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
