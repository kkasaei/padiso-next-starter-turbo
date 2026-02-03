"use client"

import { Brand } from "@workspace/db/schema"
import { BrandCard } from "@/components/brands/BrandCard"
import { Plus } from "lucide-react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { BrandsEmptyState } from "./BrandsEmptyState"

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
        <BrandsEmptyState
          description="Create your first brand to get started"
          onCreateBrand={() => onCreateBrand?.()}
        />
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
