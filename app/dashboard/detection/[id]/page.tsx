"use client"

import * as React from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PredictionBadge } from "@/components/prediction-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { GradcamViewer } from "@/components/gradcam-viewer"
import { getDetectionById, deleteDetection } from "@/lib/api"
import type { DetectionResult } from "@/lib/types"
import { IconArrowLeft, IconTrash, IconDownload } from "@tabler/icons-react"

function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`
}

export default function DetectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [result, setResult] = React.useState<DetectionResult | null | undefined>(undefined)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    getDetectionById(id).then(setResult)
  }, [id])

  if (result === undefined) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Memuat…
      </div>
    )
  }

  if (result === null) notFound()

  const handleDelete = async () => {
    setDeleting(true)
    await deleteDetection(result.id)
    toast.success("Hasil deteksi dihapus.")
    router.push("/dashboard/history")
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/history"><IconArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold truncate max-w-sm">{result.fileName}</h1>
          <p className="text-sm text-muted-foreground">ID: {result.id} · {new Date(result.createdAt).toLocaleString("id-ID")}</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Visualisasi Grad-CAM</CardTitle></CardHeader>
        <CardContent>
          <GradcamViewer
            originalImageUrl={result.originalImageUrl}
            heatmapUrl={result.gradcamHeatmapUrl}
            fileName={result.fileName}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Hasil Klasifikasi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <PredictionBadge prediction={result.prediction} size="lg" />
          <ConfidenceBar confidence={result.confidence} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              ["Dimensi Asli", `${result.originalWidth} × ${result.originalHeight} px`],
              ["Ukuran File", formatBytes(result.fileSize)],
              ["Format", result.fileMimeType.split("/")[1].toUpperCase()],
              ["Setelah Preprocessing", `${result.preprocessing.resizedTo[0]} × ${result.preprocessing.resizedTo[1]} px`],
              ["Normalisasi", result.preprocessing.normalized ? "Ya" : "Tidak"],
              ["Waktu Eksekusi", result.executionTimeSeconds !== null ? `${result.executionTimeSeconds.toFixed(2)} detik` : "Menghitung…"],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {result.gradcamHeatmapUrl && (
          <Button asChild variant="outline">
            <a href={result.gradcamHeatmapUrl} download="gradcam-heatmap.png">
              <IconDownload className="size-4 mr-1.5" /> Unduh Heatmap
            </a>
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="ml-auto">
              <IconTrash className="size-4 mr-1.5" /> Hapus dari Riwayat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Hasil Deteksi?</DialogTitle>
              <DialogDescription>
                Hasil deteksi <strong>{result.fileName}</strong> akan dihapus secara permanen dan tidak dapat dipulihkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>Batal</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Menghapus…" : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
