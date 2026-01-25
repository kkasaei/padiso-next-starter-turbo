import { default as AuditPageComponent } from "@/components/projects/audit/AuditPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Audit</h1>
    </div>
    <div className="flex flex-1 p-4">
      <AuditPageComponent />
    </div>
  </div>
  )
}
