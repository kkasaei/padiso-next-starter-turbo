type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AgentDetailsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Agent Details</h1>
    </div>
    <div className="flex flex-1 p-4">
      <p className="text-muted-foreground">Agents content coming soon</p>
    </div>
  </div>
  )
}
