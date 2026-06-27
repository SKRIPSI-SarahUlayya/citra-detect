import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Prediction } from "@/lib/types"

interface PredictionBadgeProps {
  prediction: Prediction | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PredictionBadge({ prediction, size = "md", className }: PredictionBadgeProps) {
  if (!prediction) {
    return (
      <Badge
        className={cn(
          "font-semibold select-none bg-muted text-muted-foreground border-border",
          size === "sm" && "text-xs px-2 py-0.5",
          size === "md" && "text-sm px-2.5 py-1",
          size === "lg" && "text-base px-4 py-1.5",
          className
        )}
        variant="outline"
      >
        ⌛ Memproses
      </Badge>
    )
  }

  const isAI = prediction === "AI-Generated"
  return (
    <Badge
      className={cn(
        "font-semibold select-none",
        isAI
          ? "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700"
          : "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-700",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-2.5 py-1",
        size === "lg" && "text-base px-4 py-1.5",
        className
      )}
      variant="outline"
    >
      {isAI ? "🤖 AI-Generated" : "✅ Asli"}
    </Badge>
  )
}
