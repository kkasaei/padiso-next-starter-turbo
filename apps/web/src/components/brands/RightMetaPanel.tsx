import type { ProjectDetails } from "@/lib/mocks/legacy-project-details"
import { TimeCard } from "@/components/workspace/brands/TimeCard"
import { BacklogCard } from "@/components/workspace/brands/BacklogCard"
import { QuickLinksCard } from "@/components/workspace/brands/QuickLinksCard"
import { Separator } from "@workspace/ui/components/separator"

type RightMetaPanelProps = {
  project: ProjectDetails
}

export function RightMetaPanel({ project }: RightMetaPanelProps) {
  return (
    <aside className="flex flex-col gap-10 p-4 pt-8 lg:sticky lg:self-start">
      <TimeCard time={project.time} />
      <Separator />
      <BacklogCard backlog={project.backlog} />
      <Separator />
      <QuickLinksCard links={project.quickLinks} />
    </aside>
  )
}
