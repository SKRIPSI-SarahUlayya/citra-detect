export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/40 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
