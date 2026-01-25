import dynamic from 'next/dynamic'
import Loading from '@/components/common/Loading'

/**
 * Dynamic import helper for lazy loading components
 * Use this for heavy 3D components or any component that's not critical for initial render
 */

// Example: Lazy load 3D components
export const DynamicCanvas = dynamic(
    () => import('@react-three/fiber').then(mod => mod.Canvas),
    {
        ssr: false, // Disable SSR for 3D canvas
        loading: () => <Loading text="Loading 3D scene..." size="md" />
    }
)

// Helper function to create dynamic imports with loading state
export function createDynamicComponent<T = any>(
    importFn: () => Promise<any>,
    options?: {
        ssr?: boolean
        loadingText?: string
        loadingSize?: 'sm' | 'md' | 'lg'
    }
) {
    return dynamic(importFn, {
        ssr: options?.ssr ?? true,
        loading: () => (
            <Loading
                text={options?.loadingText ?? 'Loading...'}
                size={options?.loadingSize ?? 'md'}
            />
        ),
    })
}

// Export common dynamic components
export const DynamicScrollAnimation = createDynamicComponent(
    () => import('@/components/common/SmoothScroll'),
    { loadingText: 'Initializing animations...', loadingSize: 'sm' }
)

export const DynamicPointerTrail = createDynamicComponent(
    () => import('@/components/common/PointerTrail'),
    { loadingText: 'Loading effects...', loadingSize: 'sm' }
)
