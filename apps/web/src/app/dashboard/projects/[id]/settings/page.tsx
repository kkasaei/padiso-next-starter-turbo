import ProjectSettings from "@/components/projects/settings/ProjectSettings"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function SettingsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 border-b border-border px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">
        Manage settings for project {id}
      </p>
    </div>
    <div className="p-8">
    <ProjectSettings />
    </div>
  </div>
  )
}
