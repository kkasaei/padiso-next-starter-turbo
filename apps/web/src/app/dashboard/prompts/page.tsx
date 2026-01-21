import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Lightning } from "@phosphor-icons/react/dist/ssr"

export default function PromptsPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0 m-2 bg-background rounded-xl border border-border">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-accent text-muted-foreground" />
        <p className="text-base font-medium text-foreground">Prompts</p>
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Lightning className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Prompts</h1>
          <p className="mt-2 text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
