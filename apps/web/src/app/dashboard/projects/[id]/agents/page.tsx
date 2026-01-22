type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AgentsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 border-b border-border px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
      <p className="text-muted-foreground">
        Project agents and workflows for project {id}
      </p>
    </div>
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-muted-foreground">Agents content coming soon</p>
    </div>
  </div>
  )
}
