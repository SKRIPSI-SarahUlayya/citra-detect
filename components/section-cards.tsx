"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp, IconTrendingDown, IconBrain, IconPhoto, IconPhotoAi, IconCircleCheck } from "@tabler/icons-react"
import { mockHistory, mockMetrics } from "@/lib/mock-data"

export function SectionCards() {
  const total = mockHistory.length
  const aiCount = mockHistory.filter((d) => d.prediction === "AI-Generated").length
  const asliCount = total - aiCount
  const aiPct = total > 0 ? Math.round((aiCount / total) * 100) : 0
  const asliPct = total > 0 ? Math.round((asliCount / total) * 100) : 0
  const accuracy = mockMetrics.accuracy

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconPhoto className="size-4" /> Total Deteksi
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3 minggu ini
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total citra dianalisis <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Sejak sistem aktif</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconPhotoAi className="size-4" /> Citra AI Terdeteksi
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {aiCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              {aiPct}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-orange-600">
            AI-Generated dari total
          </div>
          <div className="text-muted-foreground">{aiPct}% dari semua unggahan</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconPhoto className="size-4" /> Citra Asli Terdeteksi
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {asliCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 border-green-300">
              {asliPct}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Citra asli terverifikasi
          </div>
          <div className="text-muted-foreground">{asliPct}% dari semua unggahan</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconBrain className="size-4" /> Akurasi Model
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(accuracy * 100).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 border-green-300">
              <IconCircleCheck className="size-3" /> Ready
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Model CNN aktif <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">F1-Score: {(mockMetrics.f1Score * 100).toFixed(1)}%</div>
        </CardFooter>
      </Card>
    </div>
  )
}
