import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h2 className="text-2xl font-bold">Hasil Deteksi Tidak Ditemukan</h2>
      <p className="text-muted-foreground">ID hasil deteksi tidak valid atau telah dihapus.</p>
      <Button asChild>
        <Link href="/dashboard/history">Kembali ke Riwayat</Link>
      </Button>
    </div>
  )
}
