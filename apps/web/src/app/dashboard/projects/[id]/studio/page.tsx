type PageProps = {
  params: Promise<{ id: string }>
}

export default async function StudioPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Studio</h1>
        <p className="text-muted-foreground">
          Creative studio workspace for project {id}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
        <p className="text-muted-foreground">Studio content coming soon</p>
      </div>
    </div>
  )
}
