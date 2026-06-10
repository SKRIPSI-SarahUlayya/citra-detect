import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPhotoScan } from "@tabler/icons-react"

interface EmptyStateProps {
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyState({
  title = "Belum ada data",
  description = "Mulai deteksi citra pertama Anda.",
  ctaLabel = "Mulai Deteksi",
  ctaHref = "/dashboard/detection",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <IconPhotoScan className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
      </div>
      {ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  )
}
