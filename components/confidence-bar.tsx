import { cn } from "@/lib/utils"

interface ConfidenceBarProps {
  confidence: number
  mini?: boolean
  className?: string
}

export function ConfidenceBar({ confidence, mini = false, className }: ConfidenceBarProps) {
  const pct = Math.round(confidence * 100)
  const color =
    pct >= 90 ? "bg-green-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500"

  if (mini) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs tabular-nums">{pct}%</span>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Keyakinan Model</span>
        <span className="font-semibold tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
