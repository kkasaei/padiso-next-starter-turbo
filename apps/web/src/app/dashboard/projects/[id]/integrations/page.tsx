import { default as IntegrationsPageComponent } from '@/components/projects/integrations/IntegrationsPage'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function IntegrationsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
      </div>
      <div className="flex flex-1 p-4">
        <IntegrationsPageComponent projectId={id} />
      </div>
    </div>
  )
}
