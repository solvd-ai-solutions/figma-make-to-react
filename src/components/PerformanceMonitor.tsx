'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            // Fix: Use proper FID calculation with type assertion
            const fidEntry = entry as any
            if (fidEntry.processingStart) {
              console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
            }
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })

      return () => observer.disconnect()
    }
  }, [])

  return null
}
