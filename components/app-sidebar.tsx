"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconPhotoScan,
  IconChartBar,
  IconHistory,
  IconInfoCircle,
  IconScan,
  IconLogout,
  IconLogin,
} from "@tabler/icons-react"
import { supabase } from "@/lib/supabase"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Deteksi Citra", url: "/dashboard/detection", icon: IconPhotoScan },
  { title: "Performa Model", url: "/dashboard/performance", icon: IconChartBar },
  { title: "Riwayat Deteksi", url: "/dashboard/history", icon: IconHistory },
]

const navSecondary = [
  { title: "Tentang Sistem", url: "/dashboard/about", icon: IconInfoCircle },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault()
      await supabase.auth.signOut()
      window.location.href = "/login"
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard">
                <IconScan className="size-5!" />
                <span className="text-base font-semibold">CitraDetect</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Lainnya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={user ? "Keluar" : "Masuk"}
              className={user ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : ""}
            >
              <Link href={user ? "#" : "/login"} onClick={handleLogout}>
                {user ? <IconLogout /> : <IconLogin />}
                <span>{user ? "Keluar" : "Masuk"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-3 pb-2 text-xs text-muted-foreground">
          <p className="font-medium">CitraDetect v0.1.0</p>
          <p>CNN + Grad-CAM XAI</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
