import { Suspense } from "react"
import { BrandTasksPage } from "@/components/workspace/tasks/BrandTasksPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      }>
        <BrandTasksPage projectId={id} />
      </Suspense>
    </div>
  )
}
