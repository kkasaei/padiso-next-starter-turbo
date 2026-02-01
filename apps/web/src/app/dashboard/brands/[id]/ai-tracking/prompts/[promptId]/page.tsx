import {default as PromptTrackingPageComponent} from '@/components/workspace/brands/tracking/PromptTracking'
import {default as ProjectTrackingBreadcrumbs} from '@/components/workspace/brands/tracking/Breadcrumbs'

type PageProps = {
  params: Promise<{ id: string; promptId: string }>
}

export default async function TrackingPage({ params }: PageProps) {
  const { id, promptId } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Tracking</h1>
        <ProjectTrackingBreadcrumbs projectId={id} />
      </div>
      <div className="flex flex-1 p-4">
        <PromptTrackingPageComponent projectId={id} promptId={promptId} />
      </div>
      </div>
    )
}

