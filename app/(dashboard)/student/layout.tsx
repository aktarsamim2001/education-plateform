"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Video,
  FileQuestion,
  TrendingUp,
  Award,
  GraduationCap,
} from "lucide-react"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/student/courses", label: "My Courses", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/student/modules", label: "Learning Modules", icon: <Video className="h-5 w-5" /> },
    { href: "/student/quizzes", label: "Quizzes", icon: <FileQuestion className="h-5 w-5" /> },
    { href: "/student/simulations", label: "Market Simulations", icon: <TrendingUp className="h-5 w-5" /> },
    { href: "/student/webinars", label: "Webinars", icon: <Video className="h-5 w-5" /> },
    { href: "/student/progress", label: "My Progress", icon: <Award className="h-5 w-5" /> },
    { href: "/student/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/student/instructor", label: "Become Instructor", icon: <GraduationCap className="h-5 w-5" /> },
    { href: "/student/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex h-20 items-center justify-between px-4">
          <h1 className={`text-xl font-bold ${isSidebarOpen ? "block" : "hidden"}`}>Student Dashboard</h1>
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
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}
