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

      <div className="px-4 lg:px-6">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <IconPhotoScan className="size-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Mulai Deteksi Baru</h3>
              <p className="text-muted-foreground text-sm">
                Unggah citra Instagram untuk dianalisis oleh model CNN + Grad-CAM
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/dashboard/detection">Deteksi Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
