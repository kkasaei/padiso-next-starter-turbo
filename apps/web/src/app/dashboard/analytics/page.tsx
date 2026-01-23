import { ChartBar } from "@phosphor-icons/react/dist/ssr"

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-foreground">Analytics</p>
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ChartBar className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
            <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </>
  )
}
