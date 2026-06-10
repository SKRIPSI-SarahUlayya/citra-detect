import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingHistory() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  )
}
