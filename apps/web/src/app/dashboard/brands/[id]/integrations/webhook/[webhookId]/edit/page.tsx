import { default as WebhookEditPageComponent } from '@/components/workspace/brands/integrations/WebhookEditPage'

type PageProps = {
  params: Promise<{ id: string; webhookId: string }>
}

export default async function WebhookEditPage({ params }: PageProps) {
  const { id, webhookId } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Webhook</h1>
      </div>
      <div className="flex flex-1 p-4">
        <WebhookEditPageComponent projectId={id} webhookId={webhookId} />
      </div>
    </div>
  )
}
