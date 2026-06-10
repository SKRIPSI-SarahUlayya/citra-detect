# Laporan Progress — MVP Plan UI CitraDetect

**Tanggal:** 11 Juni 2026  
**Status Keseluruhan:** ✅ Semua milestone M1–M8 selesai

---

## Ringkasan Eksekusi

Seluruh 8 milestone dalam dokumen **MVP Plan UI.md** telah diimplementasikan. Web berhasil bertransformasi dari template dashboard shadcn kosong menjadi aplikasi CitraDetect yang fungsional secara visual menggunakan mock data.

---

## Detail Per Milestone

### ✅ M1 — Scaffolding, Routing & Sidebar

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| Redirect `/` → `/dashboard` | ✅ | `app/page.tsx` menggunakan `redirect()` server-side |
| `app/dashboard/layout.tsx` | ✅ | DashboardLayout dengan SidebarProvider + SidebarInset |
| `components/app-sidebar.tsx` | ✅ | Dirombak total: logo CitraDetect, 4 menu utama + 1 menu sekunder |
| Ikon `@tabler/icons-react` | ✅ | `IconPhotoScan`, `IconLayoutDashboard`, `IconChartBar`, `IconHistory`, `IconInfoCircle` |
| Breadcrumb dinamis | ✅ | `components/site-header.tsx` parse segmen URL → label Indonesia |
| Semua rute placeholder R1–R6 | ✅ | Dibuat beserta `loading.tsx` dan `not-found.tsx` |
| Active state sidebar | ✅ | Menggunakan `usePathname()` untuk highlight menu aktif |

---

### ✅ M2 — Lapisan Tipe & Mock Data

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| `lib/types.ts` | ✅ | `DetectionResult`, `ModelMetrics`, `ConfusionMatrix`, `EpochPoint`, `ModelInfo`, `Prediction` |
| `lib/mock-data.ts` | ✅ | 20 entri riwayat dummy, metrik model, 30 titik epoch, tren harian 90 hari |
| `lib/api.ts` | ✅ | `detectImage()`, `getMetrics()`, `getHistory()`, `getDetectionById()`, `saveDetection()`, `deleteDetection()` — semua async dengan delay simulasi |

**Catatan integrasi:** Saat backend Python siap, hanya `lib/api.ts` yang perlu diganti dengan `fetch` ke FastAPI/Flask — kontrak data sudah identik dengan spesifikasi di MVP Plan §7.

---

### ✅ M3 — Dashboard Ringkasan (R1)

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| 4 Kartu Statistik | ✅ | Total Deteksi, Citra AI, Citra Asli, Akurasi Model — data dari mock |
| Chart Area Interaktif | ✅ | Tren harian AI-Generated vs Asli, toggle 7/30/90 hari |
| Tabel "Deteksi Terbaru" | ✅ | 5 baris terakhir dengan thumbnail, nama file, badge prediksi, confidence bar |
| Kartu Aksi Cepat | ✅ | CTA "Deteksi Sekarang" → `/dashboard/detection` |

**File dimodifikasi:** `components/section-cards.tsx`, `components/chart-area-interactive.tsx`, `app/dashboard/page.tsx`

---

### ✅ M4 — Halaman Deteksi (R2)

Implementasi **single-page flow 3 state**:

| State | Item | Status |
| :--- | :--- | :---: |
| **State A — Upload** | Dropzone drag-and-drop | ✅ |
| | Validasi format (JPG/PNG/WebP) + ukuran maks. 10 MB | ✅ |
| | Toast error format/ukuran tidak valid | ✅ |
| | Pratinjau thumbnail + metadata file | ✅ |
| **State B — Processing** | `ProcessingStepper` 4 tahap animasi | ✅ |
| | Tombol dinonaktifkan selama proses | ✅ |
| **State C — Hasil** | `PredictionBadge` besar (AI/Asli) | ✅ |
| | `ConfidenceBar` dengan persentase | ✅ |
| | `GradcamViewer` side-by-side + overlay | ✅ |
| | Slider opacity 0–100% pada mode overlay | ✅ |
| | Panel Konteks Model (collapsible) | ✅ |
| | Aksi: Simpan, Deteksi Lain, Unduh Heatmap | ✅ |

**Komponen baru:** `prediction-badge.tsx`, `confidence-bar.tsx`, `processing-stepper.tsx`, `gradcam-viewer.tsx`, `empty-state.tsx`  
**Dependensi ditambah:** `ui/slider.tsx`, `ui/dialog.tsx` (via `npx shadcn add`)

---

### ✅ M5 — Detail Hasil Deteksi (R3)

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| Rute dinamis `[id]` | ✅ | Client component, fetch via `getDetectionById()` |
| `not-found.tsx` | ✅ | Tampilan custom dengan tombol kembali ke Riwayat |
| `GradcamViewer` ukuran penuh | ✅ | Mode overlay default dengan slider opacity |
| Kartu Metadata | ✅ | Dimensi, ukuran file, format, preprocessing, waktu eksekusi |
| Dialog konfirmasi hapus | ✅ | Menggunakan `ui/dialog.tsx` via shadcn |
| Unduh heatmap | ✅ | Link download ke URL heatmap |

---

### ✅ M6 — Performa Model (R4)

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| 4 `MetricCard` | ✅ | Akurasi, Presisi, Recall, F1-Score + deskripsi per metrik |
| `ConfusionMatrix` | ✅ | Grid 2×2 intensitas warna proporsional + tooltip TP/TN/FP/FN |
| Kurva Training Accuracy | ✅ | Line chart Train vs Val Accuracy per epoch (Recharts) |
| Kurva Training Loss | ✅ | Line chart Train vs Val Loss per epoch (Recharts) |
| Kartu Informasi Model | ✅ | Arsitektur, input size, kelas, tanggal training, ukuran dataset |

**Komponen baru:** `metric-card.tsx`, `confusion-matrix.tsx`

---

### ✅ M7 — Riwayat Deteksi (R5)

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| Tabel TanStack Table | ✅ | Kolom: Thumbnail, Nama File, Prediksi, Keyakinan, Tanggal, Aksi |
| Search bar global | ✅ | Filter nama file secara real-time |
| Filter label prediksi | ✅ | Dropdown: Semua / Asli / AI-Generated |
| Sortable columns | ✅ | Nama File, Keyakinan, Tanggal (default: terbaru) |
| Pagination | ✅ | 10/25/50 baris per halaman |
| `EmptyState` | ✅ | Tampil jika tidak ada hasil atau filter kosong |
| Dropdown aksi baris | ✅ | Lihat Grad-CAM, Unduh Heatmap, Hapus |

---

### ✅ M8 — Polish & Finalisasi

| Item | Status | Keterangan |
| :--- | :---: | :--- |
| Halaman About (R6) | ✅ | Deskripsi sistem, alur IPO, batasan, informasi dataset |
| `loading.tsx` per rute | ✅ | Detection, Performance, History |
| `Toaster` Sonner | ✅ | Dipasang di `app/layout.tsx` untuk notifikasi toast global |
| Komponen `EmptyState` | ✅ | Digunakan di History, siap pakai di halaman lain |

---

## Struktur File Akhir (Dihasilkan / Dimodifikasi)

```
app/
├── layout.tsx                   ← DIUBAH: tambah <Toaster />
├── page.tsx                     ← DIUBAH: redirect("/dashboard")
└── dashboard/
    ├── layout.tsx               ← BARU: DashboardLayout
    ├── page.tsx                 ← DIUBAH: R1 Dashboard
    ├── detection/
    │   ├── page.tsx             ← DIUBAH: R2 Deteksi (3 state)
    │   ├── loading.tsx          ← BARU
    │   └── [id]/
    │       ├── page.tsx         ← DIUBAH: R3 Detail
    │       └── not-found.tsx    ← BARU
    ├── performance/
    │   ├── page.tsx             ← DIUBAH: R4 Performa
    │   └── loading.tsx          ← BARU
    ├── history/
    │   ├── page.tsx             ← DIUBAH: R5 Riwayat
    │   └── loading.tsx          ← BARU
    └── about/
        └── page.tsx             ← DIUBAH: R6 Tentang

components/
├── app-sidebar.tsx              ← DIUBAH: CitraDetect nav
├── site-header.tsx              ← DIUBAH: breadcrumb dinamis
├── section-cards.tsx            ← DIUBAH: stats CitraDetect
├── chart-area-interactive.tsx   ← DIUBAH: tren AI vs Asli
├── prediction-badge.tsx         ← BARU
├── confidence-bar.tsx           ← BARU
├── gradcam-viewer.tsx           ← BARU
├── processing-stepper.tsx       ← BARU
├── confusion-matrix.tsx         ← BARU
├── metric-card.tsx              ← BARU
├── empty-state.tsx              ← BARU
└── ui/
    ├── slider.tsx               ← BARU (via shadcn add)
    └── dialog.tsx               ← BARU (via shadcn add)

lib/
├── types.ts                     ← BARU
├── mock-data.ts                 ← BARU (20 entri, 30 epoch, 90 hari tren)
└── api.ts                       ← BARU (async mock dengan delay simulasi)
```

---

## Status Definition of Done

| Kriteria DoD | Status |
| :--- | :---: |
| Seluruh rute R1–R6 navigable tanpa error, breadcrumb dan metadata benar | ✅ |
| Alur deteksi penuh (upload → stepper → hasil + Grad-CAM slider opacity) | ✅ |
| Semua data dari `lib/mock-data.ts`, akses via `lib/api.ts` | ✅ |
| Tabel riwayat: search, filter, sort, pagination | ✅ |
| Halaman performa: 4 metrik, Confusion Matrix, 2 kurva training interaktif | ✅ |
| TypeScript `tsc --noEmit` bersih (0 error) | ✅ |

---

## Catatan untuk Fase Integrasi Backend

Saat backend Python (FastAPI/Flask) siap:

1. Ganti implementasi di **`lib/api.ts`** saja — fungsi `detectImage()`, `getMetrics()`, `getHistory()`, dll. cukup diganti dengan `fetch` ke endpoint yang sesuai.
2. Kontrak response JSON sudah identik dengan spesifikasi §7 MVP Plan (`POST /api/detect`, `GET /api/model/metrics`, `GET /api/history`).
3. Validasi format RGB diduplikasi di backend (tidak hanya di client).
4. Aktifkan CORS untuk origin Next.js saat development.
