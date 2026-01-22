type PageProps = {
  params: Promise<{ id: string }>
}

export default async function TrackingPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b border-border px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Tracking</h1>
        <p className="text-muted-foreground">
          Analytics and tracking for project {id}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Tracking content coming soon</p>
      </div>
    </div>
  )
}
