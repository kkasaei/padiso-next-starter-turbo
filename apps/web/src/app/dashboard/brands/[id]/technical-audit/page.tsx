import { default as AuditPageComponent } from "@/components/brands/audit/AuditPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col px-4">
    <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Technical Audit</h1>
    </div>
    <div className="flex flex-1">
      <AuditPageComponent />
    </div>
  </div>
  )
}
