"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Sparkles } from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core"
import {
  arrayMove,
} from "@dnd-kit/sortable"

import { type Project, type FilterCounts } from "@/lib/data/projects"
import { getProjectTasks, type ProjectTask } from "@/lib/data/project-details"
import { useProject } from "@/hooks/use-projects"
import { baseDetailsFromListItem } from "@/lib/data/project-details"
import { DEFAULT_VIEW_OPTIONS, type FilterChip as FilterChipType, type ViewOptions } from "@/lib/view-options"
import { TaskWeekBoardView } from "@/components/tasks/TaskWeekBoardView"
import {
  ProjectTaskGroup,
  ProjectTaskListView,
  filterTasksByChips,
  computeTaskFilterCounts,
} from "@/components/tasks/task-helpers"
import { Button } from "@workspace/ui/components/button"
import { FilterPopover } from "@/components/filter-popover"
import { ChipOverflow } from "@/components/chip-overflow"
import { ViewOptionsPopover } from "@/components/view-options-popover"
import { TaskQuickCreateModal, type CreateTaskContext } from "@/components/tasks/TaskQuickCreateModal"

interface ProjectTasksPageProps {
  projectId: string
}

export function ProjectTasksPage({ projectId }: ProjectTasksPageProps) {
  const { data: projectData, isLoading } = useProject(projectId)
  
  const [tasks, setTasks] = useState<ProjectTask[]>([])

  // Load project tasks when project data is available
  useEffect(() => {
    if (projectData) {
      // Transform tRPC project to ProjectListItem format
      const projectListItem = {
        id: projectData.id,
        name: projectData.name,
        taskCount: projectData.taskCount,
        progress: projectData.progress,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: projectData.status,
        priority: projectData.priority,
        tags: projectData.tags || [],
        members: projectData.members || [],
        client: projectData.client,
        typeLabel: projectData.typeLabel,
        durationLabel: projectData.durationLabel,
        tasks: [],
      }
      
      const details = baseDetailsFromListItem(projectListItem)
      const projectTasks = getProjectTasks(details)
      setTasks(projectTasks)
    }
  }, [projectData])

  const [filters, setFilters] = useState<FilterChipType[]>([])
  const [viewOptions, setViewOptions] = useState<ViewOptions>(DEFAULT_VIEW_OPTIONS)

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [createContext, setCreateContext] = useState<CreateTaskContext | undefined>(undefined)
  const [editingTask, setEditingTask] = useState<ProjectTask | undefined>(undefined)

  const counts = useMemo<FilterCounts>(() => {
    return computeTaskFilterCounts(tasks)
  }, [tasks])

  const visibleTasks = useMemo<ProjectTask[]>(() => {
    if (!filters.length) return tasks
    return filterTasksByChips(tasks, filters)
  }, [tasks, filters])

  // Create a single group for the project
  const visibleGroups = useMemo<ProjectTaskGroup[]>(() => {
    if (!projectData || visibleTasks.length === 0) return []
    return [{ project: projectData as Project, tasks: visibleTasks }]
  }, [projectData, visibleTasks])

  const openCreateTask = (context?: CreateTaskContext) => {
    setEditingTask(undefined)
    setCreateContext(context ?? { projectId })
    setIsCreateTaskOpen(true)
  }

  const openEditTask = (task: ProjectTask) => {
    setEditingTask(task)
    setCreateContext(undefined)
    setIsCreateTaskOpen(true)
  }

  const handleTaskCreated = (task: ProjectTask) => {
    setTasks((prev) => [...prev, task])
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "done" ? "todo" : "done",
            }
          : task
      )
    )
  }

  const changeTaskTag = (taskId: string, tagLabel?: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              tag: tagLabel,
            }
          : task
      )
    )
  }

  const moveTaskDate = (taskId: string, newDate: Date) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              startDate: newDate,
            }
          : task
      )
    )
  }

  const handleTaskUpdated = (updated: ProjectTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const activeIndex = tasks.findIndex((task) => task.id === active.id)
    const overIndex = tasks.findIndex((task) => task.id === over.id)

    if (activeIndex === -1 || overIndex === -1) return

    setTasks((prev) => arrayMove(prev, activeIndex, overIndex))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    )
  }

  if (!visibleTasks.length) {
    return (
      <>
        <header className="flex flex-col border-b border-border/40">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">Tasks</p>
              <p className="text-xs text-muted-foreground">
                {projectData?.name ? `Manage tasks for ${projectData.name}` : "No tasks available yet."}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => openCreateTask()}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first task to get started
            </p>
          </div>
          <Button onClick={() => openCreateTask()}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Task
          </Button>
        </div>

        <TaskQuickCreateModal
          open={isCreateTaskOpen}
          onClose={() => {
            setIsCreateTaskOpen(false)
            setEditingTask(undefined)
            setCreateContext(undefined)
          }}
          context={editingTask ? undefined : createContext}
          onTaskCreated={handleTaskCreated}
          editingTask={editingTask}
          onTaskUpdated={handleTaskUpdated}
        />
      </>
    )
  }

  return (
    <>
      <header className="flex flex-col border-b border-border/40">
        <div className="flex items-center justify-between px-4 border-b border-border/70">
        <div className="flex items-center gap-2 px-4 justify-center h-[82px]">
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openCreateTask()}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            <FilterPopover
              initialChips={filters}
              onApply={setFilters}
              onClear={() => setFilters([])}
              counts={counts}
            />
            <ChipOverflow
              chips={filters}
              onRemove={(key, value) =>
                setFilters((prev) => prev.filter((chip) => !(chip.key === key && chip.value === value)))
              }
              maxVisible={6}
            />
          </div>
          <div className="flex items-center gap-2">
            <ViewOptionsPopover options={viewOptions} onChange={setViewOptions} allowedViewTypes={["list", "board"]} />
            <div className="relative">
              <div className="relative rounded-xl border border-border bg-card/80 shadow-sm overflow-hidden">
                <Button className="h-8 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 relative z-10 px-3">
                  <Sparkles className="h-4 w-4 fill-current" />
                  Ask AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-4">
        {viewOptions.viewType === "list" && (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <ProjectTaskListView
              groups={visibleGroups}
              onToggleTask={toggleTask}
              onAddTask={(context) => openCreateTask(context)}
              hideProjectHeader
            />
          </DndContext>
        )}
        {viewOptions.viewType === "board" && (
          <TaskWeekBoardView
            tasks={visibleTasks}
            onAddTask={(context) => openCreateTask(context)}
            onToggleTask={toggleTask}
            onChangeTag={changeTaskTag}
            onMoveTaskDate={moveTaskDate}
            onOpenTask={openEditTask}
          />
        )}
      </div>

      <TaskQuickCreateModal
        open={isCreateTaskOpen}
        onClose={() => {
          setIsCreateTaskOpen(false)
          setEditingTask(undefined)
          setCreateContext(undefined)
        }}
        context={editingTask ? undefined : createContext}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  )
}
