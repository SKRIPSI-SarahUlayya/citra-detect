"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { MetricCard } from "@/components/metric-card"
import { ConfusionMatrix } from "@/components/confusion-matrix"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMetrics } from "@/lib/api"
import type { ModelMetrics } from "@/lib/types"

const accConfig: ChartConfig = {
  trainAcc: { label: "Train Accuracy", color: "var(--chart-1)" },
  valAcc: { label: "Val Accuracy", color: "var(--chart-2)" },
}
const lossConfig: ChartConfig = {
  trainLoss: { label: "Train Loss", color: "var(--chart-3)" },
  valLoss: { label: "Val Loss", color: "var(--chart-4)" },
}

export default function PerformancePage() {
  const [metrics, setMetrics] = React.useState<ModelMetrics | null>(null)

  React.useEffect(() => {
    getMetrics().then(setMetrics).catch(console.error)
  }, [])

  if (!metrics) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Memuat metrik performa model...
      </div>
    )
  }

  const m = metrics
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Performa Model</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Evaluasi model CNN untuk deteksi citra AI-Generated vs Asli.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <MetricCard
          title="Akurasi"
          value={`${(m.accuracy * 100).toFixed(1)}%`}
          description="Persentase prediksi benar dari seluruh sampel uji."
        />
        <MetricCard
          title="Presisi"
          value={`${(m.precision * 100).toFixed(1)}%`}
          description="Dari semua yang diprediksi AI, berapa yang benar-benar AI."
        />
        <MetricCard
          title="Recall"
          value={`${(m.recall * 100).toFixed(1)}%`}
          description="Dari semua citra AI sesungguhnya, berapa yang terdeteksi."
        />
        <MetricCard
          title="F1-Score"
          value={`${(m.f1Score * 100).toFixed(1)}%`}
          description="Rata-rata harmonik antara presisi dan recall."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>Distribusi prediksi model pada dataset uji</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfusionMatrix data={m.confusionMatrix} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kurva Pelatihan</CardTitle>
            <CardDescription>Akurasi dan loss selama training per epoch</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accuracy">
              <TabsList className="mb-4">
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="loss">Loss</TabsTrigger>
              </TabsList>
              <TabsContent value="accuracy">
                <ChartContainer config={accConfig} className="h-[220px] w-full">
                  <LineChart data={m.epochs}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" tickLine={false} axisLine={false} tickMargin={6} />
                    <YAxis domain={[0.5, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} width={42} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line dataKey="trainAcc" type="monotone" stroke="var(--color-trainAcc)" dot={false} strokeWidth={2} />
                    <Line dataKey="valAcc" type="monotone" stroke="var(--color-valAcc)" dot={false} strokeWidth={2} strokeDasharray="4 2" />
                  </LineChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="loss">
                <ChartContainer config={lossConfig} className="h-[220px] w-full">
                  <LineChart data={m.epochs}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" tickLine={false} axisLine={false} tickMargin={6} />
                    <YAxis domain={[0, 0.8]} width={42} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line dataKey="trainLoss" type="monotone" stroke="var(--color-trainLoss)" dot={false} strokeWidth={2} />
                    <Line dataKey="valLoss" type="monotone" stroke="var(--color-valLoss)" dot={false} strokeWidth={2} strokeDasharray="4 2" />
                  </LineChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Arsitektur Model</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {[
              ["Arsitektur", m.modelInfo.architecture],
              ["Input Size", `${m.modelInfo.inputSize[0]}×${m.modelInfo.inputSize[1]} RGB`],
              ["Jumlah Kelas", m.modelInfo.classes.join(", ")],
              ["Tanggal Training", new Date(m.modelInfo.trainedAt).toLocaleDateString("id-ID")],
              ["Dataset Latih", `${m.modelInfo.trainDatasetSize.toLocaleString()} citra`],
              ["Dataset Uji", `${m.modelInfo.testDatasetSize.toLocaleString()} citra`],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
