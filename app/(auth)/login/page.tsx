"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { IconScan, IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [form, setForm] = React.useState({ email: "", password: "" })
  const [errors, setErrors] = React.useState({ email: "", password: "" })

  const validate = () => {
    const e = { email: "", password: "" }
    if (!form.email) e.email = "Email wajib diisi."
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid."
    if (!form.password) e.password = "Kata sandi wajib diisi."
    else if (form.password.length < 6) e.password = "Kata sandi minimal 6 karakter."
    setErrors(e)
    return !e.email && !e.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Login berhasil! Selamat datang kembali.")
        router.push("/dashboard")
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.")
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }))
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
          <IconScan className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CitraDetect</h1>
        <p className="text-sm text-muted-foreground">AI Image Detection System</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Masuk</CardTitle>
          <CardDescription>Masukkan kredensial akun Anda untuk melanjutkan.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="peneliti@example.com"
                value={form.email}
                onChange={set("email")}
                disabled={loading}
                autoComplete="email"
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  disabled={loading}
                  autoComplete="current-password"
                  className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Memproses…
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            <Separator />

            <p className="text-center text-sm text-muted-foreground flex flex-col gap-2">
              <span>
                Belum punya akun?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Daftar sekarang
                </Link>
              </span>
              <Link href="/" className="text-xs hover:underline mt-2">
                ← Kembali ke Halaman Utama (Landing Page)
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
