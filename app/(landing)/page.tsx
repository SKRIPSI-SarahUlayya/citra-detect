import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconScan,
  IconPhotoScan,
  IconBrain,
  IconEye,
  IconChartBar,
  IconShieldCheck,
  IconArrowRight,
  IconSparkles,
  IconPhoto,
  IconZoomScan,
} from "@tabler/icons-react"

/* ─── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-2xl border bg-background/70 px-4 py-2.5 shadow-sm backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconScan className="size-4" />
            </div>
            <span className="font-bold text-sm">CitraDetect</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground transition-colors">Fitur</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Cara Kerja</Link>
            <Link href="#stats" className="hover:text-foreground transition-colors">Performa</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Mulai Gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
      {/* dot grid background */}
      <div className="dot-grid absolute inset-0 opacity-60" />

      {/* glow orbs */}
      <div className="animate-glow pointer-events-none absolute left-1/4 top-1/4 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="animate-glow pointer-events-none absolute right-1/4 bottom-1/4 size-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl animation-delay-300" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* badge */}
        <div className="animate-fade-up">
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium border-primary/30 bg-primary/5 text-primary"
          >
            <IconSparkles className="size-3" />
            CNN + Grad-CAM Explainable AI
          </Badge>
        </div>

        {/* heading */}
        <h1 className="animate-fade-up animation-delay-100 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Deteksi Citra{" "}
          <span className="text-gradient">AI-Generated</span>
          {" "}dari Feed Instagram
        </h1>

        <p className="animate-fade-up animation-delay-200 max-w-xl text-base text-muted-foreground md:text-lg">
          Sistem berbasis CNN yang mengklasifikasikan citra asli vs buatan AI, dilengkapi
          visualisasi <strong>Grad-CAM</strong> untuk transparansi penuh hasil deteksi.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up animation-delay-300 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-2 px-6 shadow-lg shadow-primary/30" asChild>
            <Link href="/register">
              Coba Sekarang
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2 px-6" asChild>
            <Link href="/dashboard">
              Lihat Demo
              <IconPhotoScan className="size-4" />
            </Link>
          </Button>
        </div>

        {/* trust bar */}
        <div className="animate-fade-up animation-delay-400 flex items-center gap-2 text-xs text-muted-foreground">
          <IconShieldCheck className="size-3.5 text-green-500" />
          <span>Akurasi 94.2% · F1-Score 94.2% · Dataset 10.000 citra</span>
        </div>

        {/* mock UI card */}
        <div className="animate-fade-up animation-delay-500 animate-float relative mt-6 w-full max-w-sm">
          <div className="glow-border rounded-2xl border bg-card/80 p-4 shadow-2xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-400" />
                <div className="size-2 rounded-full bg-yellow-400" />
                <div className="size-2 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-muted-foreground">CitraDetect · Hasil Analisis</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square rounded-lg bg-muted animate-shimmer" />
              <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-500/30 via-red-400/20 to-yellow-300/10 border border-primary/20" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Prediksi</span>
                <Badge className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300 text-xs">
                  🤖 AI-Generated
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Keyakinan</span>
                  <span className="font-semibold text-foreground">98.7%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[98.7%] rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ────────────────────────────────────────────────── */
const features = [
  {
    icon: IconBrain,
    title: "Klasifikasi CNN",
    description:
      "Model Convolutional Neural Network 5-layer yang terlatih pada 10.000 citra untuk membedakan citra asli dari kamera vs buatan AI generatif.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: IconEye,
    title: "Grad-CAM Explainable AI",
    description:
      "Visualisasi heatmap Grad-CAM menampilkan area piksel paling berpengaruh, memberi transparansi penuh atas setiap keputusan model.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: IconZoomScan,
    title: "Preprocessing Otomatis",
    description:
      "Citra diproses otomatis — resize ke 224×224, normalisasi piksel, dan validasi format RGB — sebelum masuk ke model.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: IconChartBar,
    title: "Evaluasi Transparan",
    description:
      "Akurasi, Presisi, Recall, F1-Score, Confusion Matrix, dan kurva training tersedia penuh untuk keperluan riset akademik.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: IconPhoto,
    title: "Multi-format Citra",
    description:
      "Mendukung JPG, PNG, dan WebP hingga 10 MB. Cocok untuk berbagai jenis citra yang umum ditemui di feed Instagram.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: IconShieldCheck,
    title: "Riwayat & Audit",
    description:
      "Semua hasil deteksi tersimpan otomatis lengkap dengan timestamp, metadata file, dan Grad-CAM yang bisa diunduh kapan saja.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
]

function Features() {
  return (
    <section id="features" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary">
            Fitur Utama
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Semua yang Anda butuhkan untuk<br className="hidden sm:block" />{" "}
            <span className="text-gradient">deteksi citra AI</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Dibangun untuk peneliti — akurat, transparan, dan mudah digunakan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
            >
              <div className="animate-shimmer absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl ${f.bg}`}>
                <f.icon className={`size-5 ${f.color}`} />
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How it works ────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Unggah Citra",
    description: "Tarik & lepas atau pilih citra JPG/PNG/WebP dari feed Instagram. Sistem memvalidasi format dan ukuran secara otomatis.",
    icon: IconPhoto,
  },
  {
    number: "02",
    title: "Proses CNN + Grad-CAM",
    description: "Model CNN mengekstraksi fitur visual — ketajaman, tekstur, artefak kompresi — lalu mengklasifikasikan dan membangkitkan heatmap Grad-CAM.",
    icon: IconBrain,
  },
  {
    number: "03",
    title: "Terima Hasil & Analisis",
    description: "Dapatkan label prediksi, persentase keyakinan, dan overlay heatmap interaktif yang menunjukkan area piksel paling berpengaruh.",
    icon: IconEye,
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-24 overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary">
            Cara Kerja
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tiga langkah menuju{" "}
            <span className="text-gradient">deteksi akurat</span>
          </h2>
        </div>

        <div className="relative">
          {/* connector line */}
          <div className="absolute left-8 top-10 hidden h-[calc(100%-80px)] w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:block md:left-1/2 md:-translate-x-px md:h-full" />

          <div className="flex flex-col gap-10 md:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`flex items-start gap-6 md:items-center md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex flex-1 ${i % 2 === 0 ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12"}`}>
                  <div className="max-w-sm rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10">
                        <step.icon className="size-5 text-primary" />
                      </div>
                      <span className="text-2xl font-black text-primary/20">{step.number}</span>
                    </div>
                    <h3 className="mb-2 font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* center dot */}
                <div className="relative z-10 hidden md:flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md shadow-primary/30">
                  <div className="size-2 rounded-full bg-primary" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ───────────────────────────────────────────────────── */
const stats = [
  { value: "94.2%", label: "Akurasi Model", sub: "Pada dataset uji 2.000 citra" },
  { value: "95.1%", label: "Presisi", sub: "AI-Generated detection" },
  { value: "93.3%", label: "Recall", sub: "Sensitivitas deteksi AI" },
  { value: "10K+", label: "Citra Dataset", sub: "8K latih + 2K uji" },
]

function Stats() {
  return (
    <section id="stats" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-4 rounded-full border-primary/30 bg-primary/5 text-primary">
            Performa Model
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Angka yang{" "}
            <span className="text-gradient">bicara sendiri</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
            >
              <div className="animate-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-gradient text-4xl font-black tabular-nums md:text-5xl">{s.value}</p>
              <p className="mt-2 font-semibold text-sm">{s.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-10 text-center shadow-xl">
          <div className="animate-glow pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="dot-grid absolute inset-0 opacity-30" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
              <IconScan className="size-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Siap mulai deteksi?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Buat akun gratis dan analisis citra Instagram pertama Anda sekarang.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-8 shadow-lg shadow-primary/30" asChild>
                <Link href="/register">
                  Buat Akun Gratis
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sudah punya akun? Masuk</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconScan className="size-3.5" />
          </div>
          <span className="text-sm font-semibold">CitraDetect</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Proyek Tugas Akhir · CNN + Grad-CAM XAI untuk Deteksi Kualitas Visual Citra AI-Generated
        </p>
        <p className="text-xs text-muted-foreground">v0.1.0</p>
      </div>
    </footer>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
