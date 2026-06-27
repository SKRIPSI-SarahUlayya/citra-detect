"use client"

import * as React from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PredictionBadge } from "@/components/prediction-badge"
import { ConfidenceBar } from "@/components/confidence-bar"
import { EmptyState } from "@/components/empty-state"
import { getHistory, deleteDetection } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import type { DetectionResult, Prediction } from "@/lib/types"
import { IconArrowUp, IconArrowDown, IconDotsVertical, IconEye, IconDownload, IconTrash, IconChevronLeft, IconChevronRight, IconLock } from "@tabler/icons-react"

function SortableHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8"
    >
      {label}
      {column.getIsSorted() === "asc" ? (
        <IconArrowUp className="ml-1 size-3" />
      ) : column.getIsSorted() === "desc" ? (
        <IconArrowDown className="ml-1 size-3" />
      ) : null}
    </Button>
  )
}

const columns: ColumnDef<DetectionResult>[] = [
  {
    id: "thumbnail",
    header: "Citra",
    cell: ({ row }) => (
      <Link href={`/dashboard/detection/${row.original.id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.original.originalImageUrl}
          alt={row.original.fileName}
          className="size-12 rounded-md object-cover hover:opacity-80 transition-opacity"
        />
      </Link>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "fileName",
    header: ({ column }) => <SortableHeader column={column} label="Nama File" />,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/detection/${row.original.id}`}
        className="text-sm font-medium hover:underline max-w-[200px] truncate block"
      >
        {row.original.fileName}
      </Link>
    ),
  },
  {
    accessorKey: "prediction",
    header: "Prediksi",
    cell: ({ row }) => <PredictionBadge prediction={row.original.prediction} size="sm" />,
    filterFn: (row, _, value) => value === "all" || row.original.prediction === value,
  },
  {
    accessorKey: "confidence",
    header: ({ column }) => <SortableHeader column={column} label="Keyakinan" />,
    cell: ({ row }) => <ConfidenceBar confidence={row.original.confidence} mini />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} label="Tanggal" />,
    cell: ({ row }) => {
      const d = new Date(row.original.createdAt)
      const rel = (() => {
        const diff = Date.now() - d.getTime()
        const h = Math.floor(diff / 3600000)
        if (h < 1) return "Baru saja"
        if (h < 24) return `${h} jam lalu`
        return `${Math.floor(h / 24)} hari lalu`
      })()
      return (
        <span title={d.toLocaleString("id-ID")} className="text-sm text-muted-foreground cursor-default">
          {rel}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/detection/${row.original.id}`} className="flex items-center gap-2">
              <IconEye className="size-4" /> Lihat Grad-CAM
            </Link>
          </DropdownMenuItem>
          {row.original.gradcamHeatmapUrl && (
            <DropdownMenuItem asChild>
              <a href={row.original.gradcamHeatmapUrl} download className="flex items-center gap-2">
                <IconDownload className="size-4" /> Unduh Heatmap
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            className="text-destructive flex items-center gap-2 cursor-pointer"
            onClick={() => (table.options.meta as any)?.onDelete(row.original.id)}
          >
            <IconTrash className="size-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
]

export default function HistoryPage() {
  const [user, setUser] = React.useState<any>(null)
  const [authLoading, setAuthLoading] = React.useState(true)
  const [data, setData] = React.useState<DetectionResult[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [predFilter, setPredFilter] = React.useState("all")

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await getHistory()
      setData(res)
    } catch (err) {
      console.error("Failed to load history:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
      if (session?.user) {
        loadData()
      }
    })
  }, [loadData])

  const handleDelete = async (id: string) => {
    try {
      await deleteDetection(id)
      setData((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    meta: {
      onDelete: handleDelete,
    },
  })

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground text-sm">
        Memuat status otentikasi…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto py-24">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <IconLock className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Riwayat Deteksi Terkunci</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman ini hanya dapat diakses oleh peneliti terdaftar. Silakan masuk atau daftarkan akun peneliti Anda untuk menyimpan dan mengelola riwayat analisis citra.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/login">Masuk</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Daftar Akun</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handlePredFilter = (val: string) => {
    setPredFilter(val)
    if (val === "all") {
      table.getColumn("prediction")?.setFilterValue(undefined)
    } else {
      table.getColumn("prediction")?.setFilterValue(val as Prediction)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Riwayat Deteksi</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Seluruh citra yang pernah dianalisis oleh sistem.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Cari nama file…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select value={predFilter} onValueChange={handlePredFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter prediksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Asli">Asli</SelectItem>
            <SelectItem value="AI-Generated">AI-Generated</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {table.getFilteredRowModel().rows.length} hasil
        </span>
      </div>

      {table.getFilteredRowModel().rows.length === 0 ? (
        <EmptyState
          title="Tidak ada riwayat"
          description="Belum ada deteksi yang dilakukan. Mulai deteksi citra pertama Anda."
        />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Baris per halaman:</span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
              </span>
              <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <IconChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <IconChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
