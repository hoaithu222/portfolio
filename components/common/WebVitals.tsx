'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { reportWebVitals } from '@/lib/performance'

export function WebVitals() {
    useReportWebVitals((metric) => {
        reportWebVitals({
            name: metric.name,
            value: metric.value,
            rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
            delta: metric.delta,
            id: metric.id,
        })
    })

    return null
}
