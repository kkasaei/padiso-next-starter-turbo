"use client"

import { Brand } from "@workspace/db/schema"
import { BrandCard } from "@/components/brands/BrandCard"
import { Plus, FolderOpen } from "lucide-react"
import { Skeleton } from "@workspace/ui/components/skeleton"

type BrandCardsViewProps = {
  brands?: Brand[]
  loading?: boolean
  onCreateBrand?: () => void
}

export function BrandCardsView({ brands = [], loading = false, onCreateBrand }: BrandCardsViewProps) {
  const isEmpty = !loading && brands.length === 0

  return (
    <div className="p-4">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex h-60 flex-col items-center justify-center text-center">
          <div className="p-3 bg-muted rounded-md mb-4">
            <FolderOpen className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No brands yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">Create your first brand to get started</p>
          <button
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
            onClick={onCreateBrand}
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Create new brand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
          <button
            className="rounded-2xl border border-dashed border-border/60 bg-background p-6 text-center text-sm text-muted-foreground hover:border-solid hover:border-border/80 hover:text-foreground transition-colors min-h-[180px] flex flex-col items-center justify-center cursor-pointer"
            onClick={onCreateBrand}
          >
            <Plus className="mb-2 h-5 w-5" />
            Create new brand
          </button>
        </div>
      )}
    </div>
  )
}
