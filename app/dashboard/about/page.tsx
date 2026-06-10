import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconScan, IconBrain, IconPhoto, IconAlertTriangle, IconArrowRight } from "@tabler/icons-react"

export const metadata = { title: "Tentang Sistem" }

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Tentang Sistem</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Informasi metodologi, batasan, dan transparansi CitraDetect.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconScan className="size-5" /> CitraDetect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            <strong>CitraDetect</strong> adalah sistem deteksi kualitas visual citra AI-generated
            yang berfokus pada konten dari feed Instagram. Sistem menggunakan model{" "}
            <strong>Convolutional Neural Network (CNN)</strong> untuk mengklasifikasikan citra
            sebagai <em>Asli</em> (diambil oleh kamera) atau <em>AI-Generated</em> (dihasilkan
            oleh model generatif seperti Midjourney, DALL-E, Stable Diffusion).
          </p>
          <p>
            Untuk meningkatkan transparansi dan kepercayaan hasil, sistem dilengkapi teknik{" "}
            <strong>Explainable AI (XAI)</strong> berupa visualisasi{" "}
            <strong>Gradient-weighted Class Activation Mapping (Grad-CAM)</strong> yang
            menampilkan area piksel yang paling memengaruhi keputusan klasifikasi.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconArrowRight className="size-5" /> Alur Sistem (IPO)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {[
              ["Input", "Citra statis RGB (JPG/PNG/WebP) dari feed Instagram, maks. 10 MB"],
              ["Preprocessing", "Resize ke 224×224 piksel + normalisasi nilai piksel [0, 1]"],
              ["Proses CNN", "Ekstraksi fitur (ketajaman, tekstur, artefak kompresi) → klasifikasi biner"],
              ["Grad-CAM", "Pembangkitan heatmap untuk visualisasi area berpengaruh"],
              ["Output", "Label prediksi + persentase keyakinan + overlay heatmap Grad-CAM"],
            ].map(([step, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {i + 1}
                </span>
                <span>
                  <strong>{step}:</strong> {desc}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-yellow-300 dark:border-yellow-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <IconAlertTriangle className="size-5" /> Batasan Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {[
              "Hanya memproses citra statis RGB — tidak mendukung video atau GIF.",
              "Tidak menganalisis teks/caption yang menyertai citra.",
              "Menggunakan satu model CNN — tidak membandingkan beberapa model secara bersamaan.",
              "Objek deteksi mencakup campuran: wajah manusia dan objek umum (bukan khusus wajah).",
              "Performa optimal pada citra dengan resolusi ≥ 224×224 piksel.",
              "Sistem belum mendukung autentikasi multi-pengguna di versi MVP.",
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 shrink-0">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrain className="size-5" /> Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            Model dilatih menggunakan kombinasi dataset:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Dataset publik citra AI-generated (Midjourney, DALL-E, Stable Diffusion, Firefly)</li>
            <li>Citra asli dari feed Instagram (fotografi kamera smartphone & DSLR)</li>
          </ul>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="outline">8.000 citra latih</Badge>
            <Badge variant="outline">2.000 citra uji</Badge>
            <Badge variant="outline">2 kelas: Asli / AI-Generated</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground border-t pt-4">
        CitraDetect v0.1.0 — Proyek Tugas Akhir · CNN + Grad-CAM XAI untuk Deteksi Kualitas Visual Citra AI-Generated
      </div>
    </div>
  )
}
