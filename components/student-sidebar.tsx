"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { BookOpen, Calendar, Home, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export default function StudentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      window.location.href = "/auth/login"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      name: "My Webinars",
      href: "/student/webinars",
      icon: Calendar,
    },
    {
      name: "Messages",
      href: "/student/messages",
      icon: MessageSquare,
      badge: 3,
    },
    {
      name: "Profile",
      href: "/student/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/student/settings",
      icon: Settings,
    },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Home className="h-5 w-5" />
          <span>StockEdu</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-medium text-primary">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{session?.user?.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="flex h-14 items-center border-b px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="ml-4 font-bold">Student Dashboard</div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-shrink-0 border-r lg:block">
        <SidebarContent />
      </div>
    </>
  )
}
