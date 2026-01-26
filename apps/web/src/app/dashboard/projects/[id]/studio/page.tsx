import ContentListPage from "@/components/projects/content/ContentListPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function StudioPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col px-4">
    <div className="flex flex-col gap-2 px-4 justify-center h-[82px]">
      <h1 className="text-2xl font-semibold tracking-tight">Studio</h1>
    </div>
    <div className="flex flex-1">
     <ContentListPage />
    </div>
  </div>
  )
}
