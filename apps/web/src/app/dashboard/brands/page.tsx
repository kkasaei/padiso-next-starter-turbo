import { Suspense } from "react"
import { BrandsContent } from "@/components/brands-content"

export default function BrandsPage() {
  return (
    <Suspense fallback={null}>
      <BrandsContent />
    </Suspense>
  )
}
