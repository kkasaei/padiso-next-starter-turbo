import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ProjectsContent } from "@/components/projects-content"
import { SidebarProvider, SidebarInset } from "@workspace/ui/components/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={null}>
          <ProjectsContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
