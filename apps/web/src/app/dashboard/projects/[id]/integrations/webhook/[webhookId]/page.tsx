import { default as WebhookDetailPageComponent } from '@/components/projects/integrations/WebhookDetailPage'

type PageProps = {
  params: Promise<{ id: string; webhookId: string }>
}

export default async function WebhookDetailPage({ params }: PageProps) {
  const { id, webhookId } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Webhook Details</h1>
      </div>
      <div className="flex flex-1 p-4">
        <WebhookDetailPageComponent projectId={id} webhookId={webhookId} />
      </div>
    </div>
  )
}
