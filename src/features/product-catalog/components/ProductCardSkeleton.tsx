import { Skeleton } from '@/shared/components'

export function ProductCardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading product"
      className="w-full max-w-[calc(300px+2rem)] rounded-lg bg-white p-4 shadow-md"
    >
      {/* The inner skeletons are decorative: only the card announces "loading" */}
      <div aria-hidden="true">
        <div className="mb-2">
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>
        <div className="flex h-7 items-center justify-center">
          <Skeleton width={180} height={18} />
        </div>
        <div className="flex h-10 max-w-[300px] flex-col justify-center gap-2">
          <Skeleton height={12} />
          <Skeleton width="70%" height={12} />
        </div>
        <div className="flex h-[26px] items-center justify-center">
          <Skeleton width={72} height={16} />
        </div>
        <div className="mt-2 flex justify-center">
          <Skeleton variant="rectangular" width={112} height={44} />
        </div>
      </div>
    </div>
  )
}
