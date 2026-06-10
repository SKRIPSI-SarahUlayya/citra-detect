import Link from "next/link"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { PredictionBadge } from "@/components/prediction-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockHistory } from "@/lib/mock-data"
import { IconPhotoScan, IconArrowRight } from "@tabler/icons-react"

export const metadata = { title: "Dashboard" }

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "Baru saja"
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

export default function DashboardPage() {
  const recent = mockHistory.slice(0, 5)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Link href="/dashboard/detection">
          <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 transition-colors hover:from-primary/15 hover:to-primary/10">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconPhotoScan className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">Mulai Deteksi Baru</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Unggah citra untuk dianalisis CNN + Grad-CAM
              </p>
            </div>
            <IconArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </Link>
      </div>

      <SectionCards />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Deteksi Terbaru</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/history" className="flex items-center gap-1">
                Lihat semua <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Citra</TableHead>
                  <TableHead>Nama File</TableHead>
                  <TableHead>Prediksi</TableHead>
                  <TableHead className="hidden md:table-cell">Keyakinan</TableHead>
                  <TableHead className="hidden sm:table-cell">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((d) => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/dashboard/detection/${d.id}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.originalImageUrl}
                          alt={d.fileName}
                          className="size-10 rounded-md object-cover"
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/detection/${d.id}`}
                        className="text-sm font-medium hover:underline max-w-[180px] truncate block"
                      >
                        {d.fileName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PredictionBadge prediction={d.prediction} size="sm" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <ConfidenceBar confidence={d.confidence} mini />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {formatRelative(d.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
