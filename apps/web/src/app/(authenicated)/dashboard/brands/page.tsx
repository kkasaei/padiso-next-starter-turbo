import { Suspense } from "react"
import { BrandsListPage } from "@/components/brands/BrandsListPage"

export default function BrandsPage() {
  return (
    <Suspense fallback={null}>
      <BrandsListPage />
    </Suspense>
  )
}
