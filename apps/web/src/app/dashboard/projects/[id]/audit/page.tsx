type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 border-b border-border px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Audit</h1>
      <p className="text-muted-foreground">
        Project audit and compliance overview for project {id}
      </p>
    </div>
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-muted-foreground">Audit content coming soon</p>
    </div>
  </div>
  )
}
