"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart2, BookOpen, Calendar, Home, LogOut, Settings, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RouteGuard } from "@/components/route-guard"

function isActive(pathname: string) {
  return usePathname() === pathname
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar className="border-r bg-card">
            <SidebarHeader className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="text-xl font-bold">StockEdu</span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/courses")}>
                    <Link href="/dashboard/courses" className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      <span>My Courses</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/webinars")}>
                    <Link href="/dashboard/webinars" className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>My Webinars</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/progress")}>
                    <Link href="/dashboard/progress" className="flex items-center gap-3">
                      <BarChart2 className="h-5 w-5" />
                      <span>Progress</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/instructors")}>
                    <Link href="/dashboard/instructors" className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Instructors</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/profile")}>
                    <Link href="/dashboard/profile" className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                    <Link href="/dashboard/settings" className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="text-red-500 focus:text-red-500">
                        <Link href="/auth/login" className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Student</span>
                  </div>
                </div>
                <SidebarTrigger />
              </div>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container py-6 md:py-8 lg:py-10">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </RouteGuard>
  )
}
