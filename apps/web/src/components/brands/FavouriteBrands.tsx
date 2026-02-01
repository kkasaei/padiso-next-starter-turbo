"use client"

import type { Brand } from "@workspace/db"

interface FavouriteBrandsProps {
  brands: Brand[]
}

export function FavouriteBrands({ brands }: FavouriteBrandsProps) {
  // Don't render if there are no favourite brands
  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <div className="flex-1 p-2 overflow-y-auto">
      <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
        Favourite Brands
      </p>
      <ul className="flex flex-col gap-1">
        {brands.map((brand) => (
          <li key={brand.id}>
            <button className="flex w-full items-center gap-2 h-9 rounded-lg px-3 hover:bg-accent transition-colors group">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: brand.brandColor || "#6366f1" }}
              />
              <span className="flex-1 truncate text-sm text-left">{brand.brandName}</span>
              <span className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-accent">
                <span className="text-muted-foreground text-lg">···</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
