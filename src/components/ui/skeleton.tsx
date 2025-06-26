
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function ContactSkeleton() {
  return (
    <div className="premium-card p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function DealSkeleton() {
  return (
    <div className="premium-card p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export { Skeleton, ContactSkeleton, DealSkeleton }
