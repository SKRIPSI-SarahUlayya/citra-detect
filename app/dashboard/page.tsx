"use client"

import * as React from "react"
import Link from "next/link"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { PredictionBadge } from "@/components/prediction-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getHistory } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import { IconPhotoScan, IconArrowRight, IconLock, IconInfoCircle } from "@tabler/icons-react"

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "Baru saja"
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null)
  const [recent, setRecent] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getHistory().then((history) => {
          setRecent(history.slice(0, 5))
          setLoading(false)
        }).catch(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getHistory().then((history) => {
          setRecent(history.slice(0, 5))
        }).catch(console.error)
      } else {
        setRecent([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Guest Banner */}
      {!user && !loading && (
        <div className="px-4 lg:px-6">
          <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-950/10">
            <IconInfoCircle className="size-5 shrink-0 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Mode Tamu Aktif</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-500/80 leading-relaxed">
                Anda dapat menggunakan fitur deteksi gambar secara gratis. Namun, hasil deteksi Anda **tidak akan disimpan** ke database/storage Supabase. Silakan <Link href="/login" className="font-semibold underline">Masuk</Link> atau <Link href="/register" className="font-semibold underline">Daftar Akun</Link> untuk mengaktifkan riwayat deteksi.
              </p>
            </div>
          </div>
        </div>
      )}

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
        {!user ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <IconLock className="size-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">Riwayat Deteksi Terkunci</CardTitle>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Silakan masuk atau daftarkan akun peneliti Anda untuk menyimpan dan melihat riwayat hasil deteksi citra.
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              Memuat riwayat deteksi...
            </CardContent>
          </Card>
        ) : recent.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-2">
              <p className="text-sm font-semibold">Belum Ada Riwayat Deteksi</p>
              <p className="text-xs text-muted-foreground">
                Lakukan deteksi citra pertama Anda untuk melihat riwayat di sini.
              </p>
              <Button size="sm" asChild className="mt-2">
                <Link href="/dashboard/detection">Mulai Deteksi</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </div>
  )
}
