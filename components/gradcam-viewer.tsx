"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface GradcamViewerProps {
  originalImageUrl: string
  heatmapUrl: string
  fileName?: string
}

export function GradcamViewer({ originalImageUrl, heatmapUrl, fileName }: GradcamViewerProps) {
  const [opacity, setOpacity] = React.useState(60)

  return (
    <Tabs defaultValue="side-by-side" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="side-by-side">Berdampingan</TabsTrigger>
        <TabsTrigger value="overlay">Overlay</TabsTrigger>
      </TabsList>

      <TabsContent value="side-by-side">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-center text-muted-foreground">Citra Asli</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalImageUrl}
              alt={fileName ?? "Citra asli"}
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-center text-muted-foreground">Grad-CAM Heatmap</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heatmapUrl}
              alt="Grad-CAM heatmap"
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overlay">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalImageUrl}
              alt={fileName ?? "Citra asli"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heatmapUrl}
              alt="Grad-CAM overlay"
              className="absolute inset-0 h-full w-full object-cover transition-opacity"
              style={{ opacity: opacity / 100 }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Opacity Heatmap</span>
              <span className="font-medium tabular-nums">{opacity}%</span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={(v) => setOpacity(v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
