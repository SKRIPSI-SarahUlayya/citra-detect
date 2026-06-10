"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { mockDailyTrend } from "@/lib/mock-data"

const chartConfig = {
  aiGenerated: {
    label: "AI-Generated",
    color: "var(--chart-1)",
  },
  asli: {
    label: "Asli",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = mockDailyTrend.filter((item) => {
    const date = new Date(item.date)
    const refDate = new Date("2026-06-11")
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(refDate)
    startDate.setDate(startDate.getDate() - days)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren Deteksi Harian</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Frekuensi deteksi AI-Generated vs Asli</span>
          <span className="@[540px]/card:hidden">Tren deteksi</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 hari</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="30 hari" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">90 hari</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 hari</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-aiGenerated)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-aiGenerated)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAsli" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-asli)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-asli)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("id-ID", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" })
                  }
                  indicator="dot"
                />
              }
            />
            <Area dataKey="aiGenerated" type="natural" fill="url(#fillAI)" stroke="var(--color-aiGenerated)" stackId="a" />
            <Area dataKey="asli" type="natural" fill="url(#fillAsli)" stroke="var(--color-asli)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
