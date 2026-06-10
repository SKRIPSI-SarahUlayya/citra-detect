import type { DetectionResult, ModelMetrics } from "./types"
import { mockHistory, mockMetrics } from "./mock-data"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

let localHistory: DetectionResult[] = [...mockHistory]

export async function detectImage(file: File): Promise<DetectionResult> {
  await delay(2200)
  const isPredictedAI = Math.random() > 0.45
  const result: DetectionResult = {
    id: `det_${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    fileMimeType: file.type,
    originalWidth: 1080,
    originalHeight: 1080,
    prediction: isPredictedAI ? "AI-Generated" : "Asli",
    confidence: 0.82 + Math.random() * 0.18,
    originalImageUrl: URL.createObjectURL(file),
    gradcamHeatmapUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
    preprocessing: { resizedTo: [224, 224], normalized: true },
    executionTimeSeconds: 1.2 + Math.random() * 0.8,
    createdAt: new Date().toISOString(),
  }
  return result
}

export async function getMetrics(): Promise<ModelMetrics> {
  await delay(500)
  return mockMetrics
}

export async function getHistory(): Promise<DetectionResult[]> {
  await delay(300)
  return [...localHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getDetectionById(id: string): Promise<DetectionResult | null> {
  await delay(200)
  return localHistory.find((d) => d.id === id) ?? null
}

export async function saveDetection(result: DetectionResult): Promise<void> {
  await delay(100)
  localHistory = [result, ...localHistory.filter((d) => d.id !== result.id)]
}

export async function deleteDetection(id: string): Promise<void> {
  await delay(150)
  localHistory = localHistory.filter((d) => d.id !== id)
}
