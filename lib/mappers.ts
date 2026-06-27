import { supabase } from "./supabase"
import type { DetectionResult, ModelMetrics, EpochPoint, Prediction, DetectionStatus } from "./types"

export async function rowToDetection(row: any): Promise<DetectionResult> {
  let originalImageUrl = ""
  if (row.original_image_path) {
    const { data } = await supabase.storage.from("detection-images").createSignedUrl(row.original_image_path, 3600)
    originalImageUrl = data?.signedUrl || ""
  }

  let gradcamHeatmapUrl: string | null = null
  if (row.gradcam_image_path) {
    const { data } = await supabase.storage.from("gradcam-results").createSignedUrl(row.gradcam_image_path, 3600)
    gradcamHeatmapUrl = data?.signedUrl || null
  }

  let preprocessing = { resizedTo: [224, 224] as [number, number], normalized: true }
  if (row.preprocessing_info) {
    const info = typeof row.preprocessing_info === "string" 
      ? JSON.parse(row.preprocessing_info) 
      : row.preprocessing_info
    preprocessing = {
      resizedTo: info.resized_to || [224, 224],
      normalized: info.normalized !== undefined ? info.normalized : true,
    }
  }

  return {
    id: row.id,
    fileName: row.file_name,
    fileSize: row.file_size_bytes || 0,
    fileMimeType: row.file_mime_type || "image/jpeg",
    originalWidth: row.image_width || 1080,
    originalHeight: row.image_height || 1080,
    prediction: row.prediction as Prediction | null,
    confidence: row.confidence !== null ? parseFloat(row.confidence) : null,
    originalImageUrl,
    gradcamHeatmapUrl,
    preprocessing,
    executionTimeSeconds: row.execution_time_seconds !== null ? parseFloat(row.execution_time_seconds) : null,
    createdAt: row.created_at,
    status: row.status as DetectionStatus,
    errorMessage: row.error_message,
    modelVersionId: row.model_version_id,
    userId: row.user_id,
  }
}

export function buildModelMetrics(activeModel: any, metrics: any, epochs: any[]): ModelMetrics {
  const epochPoints: EpochPoint[] = epochs.map((e) => ({
    epoch: e.epoch_number,
    trainAcc: parseFloat(e.train_accuracy || 0),
    valAcc: parseFloat(e.val_accuracy || 0),
    trainLoss: parseFloat(e.train_loss || 0),
    valLoss: parseFloat(e.val_loss || 0),
  })).sort((a, b) => a.epoch - b.epoch)

  const classLabels = activeModel.class_labels 
    ? (typeof activeModel.class_labels === "string" ? JSON.parse(activeModel.class_labels) : activeModel.class_labels)
    : ["Asli", "AI-Generated"]

  return {
    accuracy: parseFloat(metrics?.accuracy || 0),
    precision: parseFloat(metrics?.precision_score || 0),
    recall: parseFloat(metrics?.recall || 0),
    f1Score: parseFloat(metrics?.f1_score || 0),
    confusionMatrix: {
      tp: metrics?.cm_true_positive || 0,
      tn: metrics?.cm_true_negative || 0,
      fp: metrics?.cm_false_positive || 0,
      fn: metrics?.cm_false_negative || 0,
    },
    epochs: epochPoints,
    modelInfo: {
      architecture: activeModel.architecture || "Custom CNN",
      inputSize: [activeModel.input_width || 224, activeModel.input_height || 224, 3],
      classes: classLabels,
      trainedAt: activeModel.trained_at || activeModel.created_at,
      trainDatasetSize: activeModel.train_dataset_size || 0,
      testDatasetSize: activeModel.test_dataset_size || 0,
    },
  }
}
