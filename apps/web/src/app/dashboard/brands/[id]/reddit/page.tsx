import RedditPage from '@/components/workspace/brands/reddit/RedditPage'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
        <h1 className="text-2xl font-semibold tracking-tight">Reddit Agent</h1>
      </div>
      <div className="flex flex-1">
        <RedditPage />
      </div>
    </div>
  )
}
