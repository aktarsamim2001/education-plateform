"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface A11yContextType {
  highContrast: boolean
  toggleHighContrast: () => void
  largeText: boolean
  toggleLargeText: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  screenReaderAnnounce: (message: string, politeness?: "polite" | "assertive") => void
}

const A11yContext = createContext<A11yContextType | undefined>(undefined)

interface A11yProviderProps {
  children: ReactNode
}

export function A11yProvider({ children }: A11yProviderProps) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const [announcementPoliteness, setAnnouncementPoliteness] = useState<"polite" | "assertive">("polite")

  // Initialize from user preferences
  useEffect(() => {
    // Check for saved preferences
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    const savedLargeText = localStorage.getItem("largeText") === "true"
    const savedReducedMotion = localStorage.getItem("reducedMotion") === "true"

    // Check for system preferences
    const prefersHighContrast = window.matchMedia("(prefers-contrast: more)").matches
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    setHighContrast(savedHighContrast || prefersHighContrast)
    setLargeText(savedLargeText)
    setReducedMotion(savedReducedMotion || prefersReducedMotion)
  }, [])

  // Apply accessibility classes to document
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    localStorage.setItem("highContrast", String(highContrast))
  }, [highContrast])

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }
    localStorage.setItem("largeText", String(largeText))
  }, [largeText])

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }
    localStorage.setItem("reducedMotion", String(reducedMotion))
  }, [reducedMotion])

  // Clear announcements after they've been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [announcement])

  const toggleHighContrast = () => setHighContrast((prev) => !prev)
  const toggleLargeText = () => setLargeText((prev) => !prev)
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev)

  const screenReaderAnnounce = (message: string, politeness: "polite" | "assertive" = "polite") => {
    setAnnouncement(message)
    setAnnouncementPoliteness(politeness)
  }

  const value = {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    reducedMotion,
    toggleReducedMotion,
    screenReaderAnnounce,
  }

  return (
    <A11yContext.Provider value={value}>
      {children}
      {/* Screen reader announcements */}
      <div aria-live={announcementPoliteness} aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </A11yContext.Provider>
  )
}

export function useA11y() {
  const context = useContext(A11yContext)
  if (context === undefined) {
    throw new Error("useA11y must be used within an A11yProvider")
  }
  return context
}
