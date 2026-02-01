import ToolsPageContent from '@/components/workspace/brands/tools/llmtext-generator/page'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ToolsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
      </div>
      <div className="flex flex-1">
        <ToolsPageContent projectId={id} />
      </div>
  </div>
  )
}
