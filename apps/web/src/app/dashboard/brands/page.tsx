import { Suspense } from "react"
import { ProjectsContent } from "@/components/projects-content"

export default function BrandsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsContent />
    </Suspense>
  )
}
