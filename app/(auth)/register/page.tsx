"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { IconScan, IconLoader2, IconEye, IconEyeOff, IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

const PASSWORD_RULES = [
  { label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
  { label: "Mengandung huruf besar", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Mengandung angka", test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [agreed, setAgreed] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: "",
  })

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(form.password))

  const validate = () => {
    const e = { name: "", email: "", password: "", confirmPassword: "", agreed: "" }
    if (!form.name.trim()) e.name = "Nama wajib diisi."
    if (!form.email) e.email = "Email wajib diisi."
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid."
    if (!form.password) e.password = "Kata sandi wajib diisi."
    else if (passwordStrength.length < PASSWORD_RULES.length)
      e.password = "Kata sandi belum memenuhi semua persyaratan."
    if (!form.confirmPassword) e.confirmPassword = "Konfirmasi kata sandi wajib diisi."
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Kata sandi tidak cocok."
    if (!agreed) e.agreed = "Anda harus menyetujui syarat & ketentuan."
    setErrors(e)
    return Object.values(e).every((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
          },
        },
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Registrasi sukses! Silakan cek email Anda untuk verifikasi atau silakan masuk.")
        router.push("/login")
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
          <CardTitle className="text-lg">Buat Akun</CardTitle>
          <CardDescription>Daftarkan diri sebagai peneliti CitraDetect.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Sarah Ulayya"
                value={form.name}
                onChange={set("name")}
                disabled={loading}
                autoComplete="name"
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

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
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  disabled={loading}
                  autoComplete="new-password"
                  className={cn(
                    "pr-10",
                    errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
              {form.password && (
                <ul className="space-y-1 mt-1.5">
                  {PASSWORD_RULES.map((rule) => {
                    const pass = rule.test(form.password)
                    return (
                      <li key={rule.label} className={cn("flex items-center gap-1.5 text-xs", pass ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
                        {pass ? <IconCheck className="size-3 shrink-0" /> : <IconX className="size-3 shrink-0" />}
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  disabled={loading}
                  autoComplete="new-password"
                  className={cn(
                    "pr-10",
                    errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="agreed"
                  checked={agreed}
                  onCheckedChange={(v) => {
                    setAgreed(!!v)
                    if (v) setErrors((p) => ({ ...p, agreed: "" }))
                  }}
                  disabled={loading}
                  className={errors.agreed ? "border-destructive" : ""}
                />
                <Label htmlFor="agreed" className="text-sm font-normal leading-snug cursor-pointer">
                  Saya menyetujui{" "}
                  <span className="text-primary underline cursor-pointer">syarat & ketentuan</span>{" "}
                  penggunaan CitraDetect.
                </Label>
              </div>
              {errors.agreed && <p className="text-xs text-destructive">{errors.agreed}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Membuat akun…
                </>
              ) : (
                "Buat Akun"
              )}
            </Button>

            <Separator />

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
