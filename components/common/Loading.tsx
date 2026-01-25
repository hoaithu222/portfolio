'use client'

interface LoadingProps {
    text?: string
    size?: 'sm' | 'md' | 'lg'
    fullScreen?: boolean
}

export default function Loading({
    text = 'Loading...',
    size = 'md',
    fullScreen = false
}: LoadingProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 border-2',
        md: 'w-12 h-12 border-3',
        lg: 'w-16 h-16 border-4'
    }

    const containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
        : 'flex items-center justify-center py-12'

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4">
                <div
                    className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
                    role="status"
                    aria-label={text}
                />
                {text && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        </div>
    )
}
