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

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Deteksi", url: "/dashboard/detection", icon: IconPhotoScan },
  { title: "Performa", url: "/dashboard/performance", icon: IconChartBar },
  { title: "Riwayat", url: "/dashboard/history", icon: IconHistory },
  { title: "Tentang", url: "/dashboard/about", icon: IconInfoCircle },
]

export function MobileBottomBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <nav className="flex items-center gap-1 rounded-2xl border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-md">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url))

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-5 shrink-0" />
              <span className="text-[10px] font-medium leading-none">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
