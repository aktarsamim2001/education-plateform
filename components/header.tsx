"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, Search, User, LogOut, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
    setIsLogoutDialogOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? "bg-background/95 shadow-sm" : "bg-background/80"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="py-4 border-b">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    StockEdu
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 py-6 flex-1 overflow-auto">
                  <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                  <Link href="/courses" className="text-lg font-medium transition-colors hover:text-primary">
                    Courses
                  </Link>
                  <Link href="/webinars" className="text-lg font-medium transition-colors hover:text-primary">
                    Webinars
                  </Link>
                  <Link href="/instructors" className="text-lg font-medium transition-colors hover:text-primary">
                    Instructors
                  </Link>
                  <Link href="/blog" className="text-lg font-medium transition-colors hover:text-primary">
                    Blog
                  </Link>
                  <Link href="/contact" className="text-lg font-medium transition-colors hover:text-primary">
                    Contact
                  </Link>
                  {session && (
                    <Link href="/student/courses" className="text-lg font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                  )}
                </nav>
                {!session && (
                  <div className="py-4 border-t flex flex-col gap-2">
                    <Link href="/auth/login" passHref>
                      <Button variant="outline" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" passHref>
                      <Button className="w-full justify-center">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">StockEdu</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto">
                  <span
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${
                      pathname.startsWith("/courses") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Courses <ChevronDown className="ml-1 h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/courses" className="flex items-center">
                    All Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/courses?category=intraday" className="flex items-center">
                    Intraday Trading
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/courses?category=options" className="flex items-center">
                    Options Trading
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/courses?category=fundamental" className="flex items-center">
                    Fundamental Analysis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/courses?category=technical" className="flex items-center">
                    Technical Analysis
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/webinars"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/webinars") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Webinars
            </Link>
            <Link
              href="/instructors"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/instructors") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Instructors
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/blog") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="relative hidden md:flex">
              <Input
                placeholder="Search courses..."
                className="w-[200px] lg:w-[300px]"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              2
            </span>
            <span className="sr-only">Shopping cart</span>
          </Button>

          {status === "loading" ? (
            <Button variant="ghost" size="sm" disabled className="hidden md:inline-flex">
              Loading...
            </Button>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex font-medium">{session.user?.name}</span>
                  <ChevronDown className="h-4 w-4 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/student/courses" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/student/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setIsLogoutDialogOpen(true)
                      }}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DialogTrigger>
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
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button size="sm" className="hidden md:inline-flex">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
