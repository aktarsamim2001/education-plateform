"use client"

import { useEffect, useState } from "react"

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
  })

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const firstEntry = entries[0]
      setMetrics((prev) => ({ ...prev, fcp: firstEntry.startTime }))
    })
    fcpObserver.observe({ type: "paint", buffered: true })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }))
    })
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      setMetrics((prev) => ({ ...prev, cls: clsValue }))
    })
    clsObserver.observe({ type: "layout-shift", buffered: true })

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const firstEntry = entries[0]
      setMetrics((prev) => ({ ...prev, fid: firstEntry.processingStart - firstEntry.startTime }))
    })
    fidObserver.observe({ type: "first-input", buffered: true })

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      clsObserver.disconnect()
      fidObserver.disconnect()
    }
  }, [])

  // Don't render anything in the UI
  return null
}
