"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"

interface LazyLoadProps {
  children: ReactNode
  height?: string | number
  width?: string | number
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
  className?: string
}

export function LazyLoad({
  children,
  height = "auto",
  width = "auto",
  threshold = 0.1,
  rootMargin = "0px",
  placeholder,
  className,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  useEffect(() => {
    if (isVisible) {
      // Add a small delay to ensure smooth transitions
      const timer = setTimeout(() => {
        setHasLoaded(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: !hasLoaded ? height : "auto",
        width: !hasLoaded ? width : "auto",
        overflow: "hidden",
        transition: "opacity 0.3s ease-in-out",
        opacity: hasLoaded ? 1 : 0,
      }}
    >
      {isVisible ? children : placeholder || null}
    </div>
  )
}
