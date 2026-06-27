export type Prediction = "AI-Generated" | "Asli"

export type DetectionStatus = "processing" | "success" | "failed"

export interface DetectionResult {
  id: string
  fileName: string
  fileSize: number
  fileMimeType: string
  originalWidth: number
  originalHeight: number
  prediction: Prediction | null
  confidence: number | null
  originalImageUrl: string
  gradcamHeatmapUrl: string | null
  preprocessing: {
    resizedTo: [number, number]
    normalized: boolean
  }
  executionTimeSeconds: number | null
  createdAt: string
  status: DetectionStatus
  errorMessage?: string | null
  modelVersionId?: string
  userId?: string | null
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  confusionMatrix: ConfusionMatrix
  epochs: EpochPoint[]
  modelInfo: ModelInfo
}

export interface ConfusionMatrix {
  tp: number
  tn: number
  fp: number
  fn: number
}

export interface EpochPoint {
  epoch: number
  trainAcc: number
  valAcc: number
  trainLoss: number
  valLoss: number
}

export interface ModelInfo {
  architecture: string
  inputSize: [number, number, number]
  classes: string[]
  trainedAt: string
  trainDatasetSize: number
  testDatasetSize: number
}
