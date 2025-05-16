"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"

type BreakpointConfig = {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  "2xl"?: number
}

interface ResponsiveGridProps {
  children: ReactNode
  columns: BreakpointConfig
  gap?: BreakpointConfig | number
  className?: string
}

export function ResponsiveGrid({ children, columns, gap = 4, className = "" }: ResponsiveGridProps) {
  const [gridStyle, setGridStyle] = useState<React.CSSProperties>({})

  // Update grid style based on window size
  useEffect(() => {
    const updateGridStyle = () => {
      const width = window.innerWidth
      let cols: number
      let gapSize: number | undefined

      // Determine columns based on breakpoints
      if (width < 640 && columns.xs !== undefined) {
        cols = columns.xs
      } else if (width < 768 && columns.sm !== undefined) {
        cols = columns.sm
      } else if (width < 1024 && columns.md !== undefined) {
        cols = columns.md
      } else if (width < 1280 && columns.lg !== undefined) {
        cols = columns.lg
      } else if (width < 1536 && columns.xl !== undefined) {
        cols = columns.xl
      } else if (columns["2xl"] !== undefined) {
        cols = columns["2xl"]
      } else {
        // Default to 1 column if no matching breakpoint
        cols = 1
      }

      // Determine gap based on breakpoints if it's an object
      if (typeof gap === "object") {
        if (width < 640 && gap.xs !== undefined) {
          gapSize = gap.xs
        } else if (width < 768 && gap.sm !== undefined) {
          gapSize = gap.sm
        } else if (width < 1024 && gap.md !== undefined) {
          gapSize = gap.md
        } else if (width < 1280 && gap.lg !== undefined) {
          gapSize = gap.lg
        } else if (width < 1536 && gap.xl !== undefined) {
          gapSize = gap.xl
        } else if (gap["2xl"] !== undefined) {
          gapSize = gap["2xl"]
        } else {
          // Default to 4 if no matching breakpoint
          gapSize = 4
        }
      } else {
        gapSize = gap
      }

      setGridStyle({
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gapSize * 0.25}rem`,
      })
    }

    // Initial update
    updateGridStyle()

    // Add event listener for window resize
    window.addEventListener("resize", updateGridStyle)

    // Clean up
    return () => {
      window.removeEventListener("resize", updateGridStyle)
    }
  }, [columns, gap])

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  )
}
