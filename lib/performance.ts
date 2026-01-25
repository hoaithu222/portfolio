/**
 * Performance monitoring utilities for Core Web Vitals
 * Tracks FCP, LCP, CLS, FID, TTFB metrics
 */

export interface PerformanceMetric {
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    delta?: number
    id?: string
}

// Thresholds for Core Web Vitals (in milliseconds)
const THRESHOLDS = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
}

export function reportWebVitals(metric: PerformanceMetric) {
    const { name, value, rating } = metric

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${name}:`, {
            value: `${Math.round(value)}${name === 'CLS' ? '' : 'ms'}`,
            rating,
        })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
        // Example: Send to Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', name, {
                value: Math.round(name === 'CLS' ? value * 1000 : value),
                event_category: 'Web Vitals',
                event_label: rating,
                non_interaction: true,
            })
        }

        // Example: Send to custom analytics endpoint
        // fetch('/api/analytics', {
        //   method: 'POST',
        //   body: JSON.stringify(metric),
        //   headers: { 'Content-Type': 'application/json' },
        // })
    }
}

// Helper to measure custom performance metrics
export function measurePerformance(name: string, startMark: string, endMark: string) {
    if (typeof window === 'undefined') return

    try {
        performance.mark(endMark)
        const measure = performance.measure(name, startMark, endMark)

        reportWebVitals({
            name,
            value: measure.duration,
            rating: getRating(name, measure.duration),
        })

        // Clean up marks
        performance.clearMarks(startMark)
        performance.clearMarks(endMark)
        performance.clearMeasures(name)
    } catch (error) {
        console.error('Performance measurement error:', error)
    }
}

// Create performance marks
export function createPerformanceMark(name: string) {
    if (typeof window === 'undefined') return
    performance.mark(name)
}
