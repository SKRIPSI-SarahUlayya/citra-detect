export type Prediction = "AI-Generated" | "Asli"

export interface DetectionResult {
  id: string
  fileName: string
  fileSize: number
  fileMimeType: string
  originalWidth: number
  originalHeight: number
  prediction: Prediction
  confidence: number
  originalImageUrl: string
  gradcamHeatmapUrl: string
  preprocessing: {
    resizedTo: [number, number]
    normalized: boolean
  }
  executionTimeSeconds: number
  createdAt: string
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
