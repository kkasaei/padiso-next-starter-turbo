import { Suspense } from "react"

import { MyTasksPage } from "@/components/workspace/tasks/MyTasksPage"

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <MyTasksPage />
    </Suspense>
  )
}
