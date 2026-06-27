import { supabase } from "./supabase"
import { rowToDetection, buildModelMetrics } from "./mappers"
import type { DetectionResult, ModelMetrics } from "./types"

export async function getMetrics(): Promise<ModelMetrics> {
  const { data: activeModel } = await supabase
    .from("model_versions")
    .select("*")
    .eq("is_active", true)
    .single()

  if (!activeModel) {
    throw new Error("No active model version found")
  }

  const { data: metrics } = await supabase
    .from("model_metrics")
    .select("*")
    .eq("model_version_id", activeModel.id)
    .single()

  const { data: epochs } = await supabase
    .from("training_epochs")
    .select("*")
    .eq("model_version_id", activeModel.id)

  return buildModelMetrics(activeModel, metrics, epochs || [])
}

export async function getHistory(): Promise<DetectionResult[]> {
  const { data, error } = await supabase
    .from("detections")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching history:", error)
    return []
  }

  return (data || []).map(rowToDetection)
}

export async function getDetectionById(id: string): Promise<DetectionResult | null> {
  const { data, error } = await supabase
    .from("detections")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return null
  }

  return rowToDetection(data)
}

export async function saveDetection(result: DetectionResult): Promise<void> {
  const { error } = await supabase
    .from("detections")
    .upsert({
      id: result.id,
      file_name: result.fileName,
      file_size_bytes: result.fileSize,
      file_mime_type: result.fileMimeType,
      image_width: result.originalWidth,
      image_height: result.originalHeight,
      prediction: result.prediction,
      confidence: result.confidence,
      original_image_path: result.originalImageUrl.includes("detection-images/") 
        ? result.originalImageUrl.split("detection-images/").pop() 
        : result.originalImageUrl,
      gradcam_image_path: result.gradcamHeatmapUrl && result.gradcamHeatmapUrl.includes("gradcam-results/")
        ? result.gradcamHeatmapUrl.split("gradcam-results/").pop()
        : result.gradcamHeatmapUrl,
      preprocessing_info: {
        resized_to: result.preprocessing.resizedTo,
        normalized: result.preprocessing.normalized,
      },
      execution_time_seconds: result.executionTimeSeconds,
      status: result.status,
      error_message: result.errorMessage,
      model_version_id: result.modelVersionId,
      user_id: result.userId || null,
      created_at: result.createdAt,
    })

  if (error) {
    console.error("Error saving detection:", error)
    throw error
  }
}

export async function deleteDetection(id: string): Promise<void> {
  // First get paths to delete from storage
  const { data } = await supabase
    .from("detections")
    .select("original_image_path, gradcam_image_path")
    .eq("id", id)
    .single()

  if (data) {
    if (data.original_image_path) {
      await supabase.storage.from("detection-images").remove([data.original_image_path])
    }
    if (data.gradcam_image_path) {
      await supabase.storage.from("gradcam-results").remove([data.gradcam_image_path])
    }
  }

  const { error } = await supabase
    .from("detections")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting detection:", error)
    throw error
  }
}

export async function detectImage(file: File): Promise<DetectionResult> {
  // 1. Get active model
  const { data: activeModel } = await supabase
    .from("model_versions")
    .select("id")
    .eq("is_active", true)
    .single()

  const modelVersionId = activeModel?.id

  // Create temporary entry
  const { data: inserted, error: insertError } = await supabase
    .from("detections")
    .insert({
      file_name: file.name,
      file_size_bytes: file.size,
      file_mime_type: file.type,
      image_width: 1080, // Fallback, will be updated or computed if needed
      image_height: 1080,
      status: "processing",
      model_version_id: modelVersionId,
    })
    .select()
    .single()

  if (insertError || !inserted) {
    throw new Error(insertError?.message || "Failed to initialize detection row")
  }

  const detectionId = inserted.id

  try {
    // 2. Upload file to detection-images bucket
    const fileExt = file.name.split(".").pop() || "jpg"
    const originalPath = `anon/${detectionId}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from("detection-images")
      .upload(originalPath, file, { cacheControl: "3600", upsert: true })

    if (uploadError) throw uploadError

    // 3. Simulate inference (ML CNN + Heatmap generation)
    // Wait a short time to simulate network + processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isPredictedAI = Math.random() > 0.45
    const confidence = 0.82 + Math.random() * 0.18
    const executionTimeSeconds = 1.2 + Math.random() * 0.8

    // For the heatmap, fetch a dummy heatmap image and upload it
    const heatmapPath = `anon/${detectionId}_heatmap.png`
    const dummyHeatmapUrl = `https://picsum.photos/seed/${detectionId}/224/224`
    const heatmapResponse = await fetch(dummyHeatmapUrl)
    const heatmapBlob = await heatmapResponse.blob()

    const { error: heatmapUploadError } = await supabase.storage
      .from("gradcam-results")
      .upload(heatmapPath, heatmapBlob, { contentType: "image/png", upsert: true })

    if (heatmapUploadError) throw heatmapUploadError

    // 4. Update row with results
    const { data: updated, error: updateError } = await supabase
      .from("detections")
      .update({
        original_image_path: originalPath,
        gradcam_image_path: heatmapPath,
        prediction: isPredictedAI ? "AI-Generated" : "Asli",
        confidence: parseFloat(confidence.toFixed(4)),
        execution_time_seconds: parseFloat(executionTimeSeconds.toFixed(3)),
        status: "success",
      })
      .eq("id", detectionId)
      .select()
      .single()

    if (updateError || !updated) throw new Error(updateError?.message || "Failed to update detection results")

    return rowToDetection(updated)
  } catch (err: any) {
    console.error("Detection error:", err)
    
    // Mark as failed in DB
    await supabase
      .from("detections")
      .update({
        status: "failed",
        error_message: err.message || String(err),
      })
      .eq("id", detectionId)

    // Return the failed record representation
    const { data: failedRecord } = await supabase
      .from("detections")
      .select("*")
      .eq("id", detectionId)
      .single()

    return rowToDetection(failedRecord || inserted)
  }
}
