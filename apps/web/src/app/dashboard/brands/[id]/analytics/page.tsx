import AnalyticsPageComponent from "@/components/brands/analytics/AnalyticaPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
    <div className="flex flex-col gap-2 px-4 justify-center h-[82px] border-b border-border">
      <h1 className="text-2xl font-semibold tracking-tight px-4">Analytics</h1>
    </div>
    <div className="flex flex-1">
     <AnalyticsPageComponent />
    </div>
  </div>
  )
}
