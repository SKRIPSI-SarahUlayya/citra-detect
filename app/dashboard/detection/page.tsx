"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PredictionBadge } from "@/components/prediction-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { ProcessingStepper } from "@/components/processing-stepper"
import { GradcamViewer } from "@/components/gradcam-viewer"
import { detectImage, saveDetection } from "@/lib/api"
import type { DetectionResult } from "@/lib/types"
import { getMetrics } from "@/lib/api"
import { IconUpload, IconX, IconChartBar } from "@tabler/icons-react"
import Link from "next/link"

type State = "upload" | "processing" | "result"

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 10 * 1024 * 1024

export default function DetectionPage() {
  const [metrics, setMetrics] = React.useState<any>(null)

  React.useEffect(() => {
    getMetrics().then(setMetrics).catch(console.error)
  }, [])

  const [state, setState] = React.useState<State>("upload")
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [processingStep, setProcessingStep] = React.useState(0)
  const [result, setResult] = React.useState<DetectionResult | null>(null)
  const [saved, setSaved] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropRef = React.useRef<HTMLDivElement>(null)

  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Sistem hanya mendukung citra statis format RGB (JPG, PNG, WebP).")
      return
    }
    if (f.size > MAX_SIZE) {
      toast.error("Ukuran file melebihi batas 10 MB.")
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const startAnalysis = async () => {
    if (!file) return
    setState("processing")
    setProcessingStep(0)
    const stepDelay = 500
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, stepDelay))
      setProcessingStep(i)
    }
    try {
      const res = await detectImage(file)
      setResult(res)
      setState("result")
    } catch {
      toast.error("Deteksi gagal. Coba lagi.")
      setState("upload")
    }
  }

  const handleSave = async () => {
    if (!result) return
    await saveDetection(result)
    setSaved(true)
    toast.success("Hasil disimpan ke riwayat.")
  }

  const reset = () => {
    setState("upload")
    setFile(null)
    setPreview(null)
    setResult(null)
    setSaved(false)
    setProcessingStep(0)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">Deteksi Citra</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Unggah citra Instagram (JPG/PNG/WebP) untuk dianalisis model CNN + Grad-CAM.
        </p>
      </div>

      {state === "upload" && (
        <Card>
          <CardContent className="pt-6">
            {!file ? (
              <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/30 py-16 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <IconUpload className="size-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Tarik & letakkan citra, atau klik untuk memilih</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP · Maks. 10 MB</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview!} alt="Pratinjau" className="size-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB · {file.type.split("/")[1].toUpperCase()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <IconX className="size-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset} className="flex-1">Ganti Gambar</Button>
                  <Button onClick={startAnalysis} className="flex-1">Mulai Analisis</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {state === "processing" && (
        <Card>
          <CardHeader><CardTitle>Memproses Citra…</CardTitle></CardHeader>
          <CardContent>
            <ProcessingStepper currentStep={processingStep} />
          </CardContent>
        </Card>
      )}

      {state === "result" && result && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Hasil Klasifikasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <PredictionBadge prediction={result.prediction} size="lg" />
              </div>
              <ConfidenceBar confidence={result.confidence} />
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>Waktu: <strong>{result.executionTimeSeconds !== null ? `${result.executionTimeSeconds.toFixed(2)}s` : "Mengukur…"}</strong></span>
                <span>
                  {new Date(result.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

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

          <details className="rounded-xl border bg-card px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
              <IconChartBar className="size-4" /> Konteks Performa Model
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
               {[
                ["Akurasi", metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : "Loading…"],
                ["Presisi", metrics ? `${(metrics.precision * 100).toFixed(1)}%` : "Loading…"],
                ["Recall", metrics ? `${(metrics.recall * 100).toFixed(1)}%` : "Loading…"],
                ["F1-Score", metrics ? `${(metrics.f1Score * 100).toFixed(1)}%` : "Loading…"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/performance" className="mt-2 block text-xs text-primary hover:underline">
              Detail performa →
            </Link>
          </details>

          <div className="flex gap-2 flex-wrap">
            {!result.id.startsWith("temp_") && (
              <Button onClick={handleSave} disabled={saved} variant="outline">
                {saved ? "Tersimpan ✓" : "Simpan ke Riwayat"}
              </Button>
            )}
            <Button onClick={reset} variant="outline">Deteksi Citra Lain</Button>
            {result.gradcamHeatmapUrl && (
              <Button asChild variant="outline">
                <a href={result.gradcamHeatmapUrl} download="gradcam-heatmap.png">
                  Unduh Heatmap
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
