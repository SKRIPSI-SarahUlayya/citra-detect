import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConfusionMatrix as CM } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ConfusionMatrixProps {
  data: CM
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  const { tp, tn, fp, fn } = data
  const total = tp + tn + fp + fn
  const max = Math.max(tp, tn, fp, fn)

  const cells = [
    { label: "TP", value: tp, row: "Asli", col: "Asli", type: "correct", detail: "True Positive: Diprediksi Asli, sebenarnya Asli" },
    { label: "FP", value: fp, row: "Asli", col: "AI-Generated", type: "wrong", detail: "False Positive: Diprediksi AI, sebenarnya Asli" },
    { label: "FN", value: fn, row: "AI-Generated", col: "Asli", type: "wrong", detail: "False Negative: Diprediksi Asli, sebenarnya AI" },
    { label: "TN", value: tn, row: "AI-Generated", col: "AI-Generated", type: "correct", detail: "True Negative: Diprediksi AI, sebenarnya AI" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-1">
        <span className="font-medium">Baris</span> = label sebenarnya &nbsp;|&nbsp; <span className="font-medium">Kolom</span> = prediksi model
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-32 text-left text-muted-foreground font-normal pb-2" />
              <th className="text-center font-medium pb-2">Pred: Asli</th>
              <th className="text-center font-medium pb-2">Pred: AI-Generated</th>
            </tr>
          </thead>
          <tbody>
            {[["Asli", tp, fp], ["AI-Generated", fn, tn]].map(([rowLabel, v1, v2], ri) => (
              <tr key={ri}>
                <td className="pr-3 py-2 font-medium text-right text-muted-foreground">{rowLabel as string}</td>
                {[v1, v2].map((val, ci) => {
                  const cell = cells[ri * 2 + ci]
                  const intensity = Math.round(((val as number) / max) * 80)
                  return (
                    <td key={ci} className="p-1.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex flex-col items-center justify-center rounded-lg p-4 cursor-default select-none transition-opacity",
                              cell.type === "correct"
                                ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200"
                                : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200"
                            )}
                            style={{ opacity: 0.3 + (intensity / 100) * 0.7 }}
                          >
                            <span className="text-2xl font-bold tabular-nums">{(val as number).toLocaleString()}</span>
                            <span className="text-xs font-medium opacity-70">{cell.label}</span>
                            <span className="text-xs opacity-60">{((val as number / total) * 100).toFixed(1)}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px] text-xs">{cell.detail}</p>
                          <p className="text-xs font-medium mt-1">{(val as number).toLocaleString()} sampel ({((val as number / total) * 100).toFixed(1)}%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Total sampel uji: {total.toLocaleString()} citra</p>
    </div>
  )
}
