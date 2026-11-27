type SkeletonVariant = 'text' | 'rectangular' | 'circular'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
}

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  rectangular: 'h-24 w-full rounded-md',
  circular: 'h-10 w-10 rounded-full',
}

export function Skeleton({
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{ width, height }}
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${VARIANT_CLASSES[variant]}`}
    />
  )
}
