"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconPhotoScan,
  IconChartBar,
  IconHistory,
  IconInfoCircle,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const leftItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Performa", url: "/dashboard/performance", icon: IconChartBar },
]

const rightItems = [
  { title: "Riwayat", url: "/dashboard/history", icon: IconHistory },
  { title: "Tentang", url: "/dashboard/about", icon: IconInfoCircle },
]

const deteksiItem = { title: "Deteksi", url: "/dashboard/detection", icon: IconPhotoScan }

export function MobileBottomBar() {
  const pathname = usePathname()

  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url))

  const isDeteksiActive = isActive(deteksiItem.url)

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <nav className="relative flex items-center rounded-2xl border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-md">
        {leftItems.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors",
              isActive(item.url)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="text-[10px] font-medium leading-none">{item.title}</span>
          </Link>
        ))}

        {/* Deteksi — FAB style, menonjol ke atas */}
        <div className="relative mx-1 flex flex-col items-center">
          <Link
            href={deteksiItem.url}
            className={cn(
              "absolute -top-7 flex flex-col items-center gap-1 transition-transform active:scale-95",
            )}
          >
            <span
              className={cn(
                "flex size-14 items-center justify-center rounded-full shadow-lg transition-colors",
                isDeteksiActive
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <deteksiItem.icon className="size-6" />
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold leading-none",
                isDeteksiActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {deteksiItem.title}
            </span>
          </Link>
          {/* spacer agar item kanan-kiri tetap sejajar */}
          <div className="w-14 py-2 opacity-0 pointer-events-none">
            <div className="size-5" />
            <span className="text-[10px]">_</span>
          </div>
        </div>

        {rightItems.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors",
              isActive(item.url)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="text-[10px] font-medium leading-none">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
