'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays, BarChart3, Paperclip, Tag as TagIcon, Mic, CircleUser, X, Folder } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

import type { UITask } from "@workspace/common/lib/types/tasks";
import type { User } from '@/lib/mocks/legacy-project-details';

// Backward compatibility
type ProjectTask = UITask;
import { useBrands } from '@/hooks/use-brands'
import { Button } from '@workspace/ui/components/button'
import { Switch } from '@workspace/ui/components/switch'
import { GenericPicker, DatePicker } from './TaskPickers'
import { ProjectDescriptionEditor } from './TaskDescriptionEditor'
import { QuickCreateModalLayout } from './QuickCreateModalLayout'
import { toast } from 'sonner'

export type CreateTaskContext = {
  brandId?: string
}

interface TaskQuickCreateModalProps {
  open: boolean
  onClose: () => void
  context?: CreateTaskContext
  onTaskCreated?: (task: Partial<ProjectTask>) => void
  editingTask?: ProjectTask
  onTaskUpdated?: (task: ProjectTask) => void
}

type TaskStatusId = 'todo' | 'in-progress' | 'done'

type StatusOption = {
  id: TaskStatusId
  label: string
}

type AssigneeOption = {
  id: string
  name: string
  avatarUrl?: string
}

type PriorityOption = {
  id: "no-priority" | "low" | "medium" | "high" | "urgent"
  label: string
}

export type TagOption = {
  id: string
  label: string
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
]

// Assignees will be loaded from Clerk organization members

const PRIORITY_OPTIONS: PriorityOption[] = [
  { id: 'no-priority', label: 'No priority' },
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export const TAG_OPTIONS: TagOption[] = [
  { id: 'feature', label: 'Feature' },
  { id: 'bug', label: 'Bug' },
  { id: 'internal', label: 'Internal' },
]

function toUser(option: AssigneeOption | undefined): User | undefined {
  if (!option) return undefined
  return {
    id: option.id,
    name: option.name,
    avatarUrl: option.avatarUrl,
  }
}

export function TaskQuickCreateModal({ open, onClose, context, onTaskCreated, editingTask, onTaskUpdated }: TaskQuickCreateModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>(undefined)
  const [createMore, setCreateMore] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const [brandId, setBrandId] = useState<string | undefined>(undefined)
  
  // Get all brands
  const { data: brandsData = [] } = useBrands()
  const brands = brandsData as any[] // Cast to handle tRPC date serialization
  
  // Get current user
  const { user } = useUser()

  // Convert current user to assignee option
  const assigneeOptions = useMemo<AssigneeOption[]>(() => {
    const options: AssigneeOption[] = [
      { id: 'unassigned', name: 'Unassigned' },
    ]
    
    // Add current user
    if (user) {
      options.push({
        id: user.id,
        name: user.fullName || user.firstName || 'You',
        avatarUrl: user.imageUrl,
      })
    }
    
    return options
  }, [user])

  const [assignee, setAssignee] = useState<AssigneeOption | undefined>(undefined)
  const [status, setStatus] = useState<StatusOption>(STATUS_OPTIONS[0]!)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<PriorityOption | undefined>(PRIORITY_OPTIONS[0])
  const [selectedTag, setSelectedTag] = useState<TagOption | undefined>(undefined)

  // Set default assignee when options load
  useEffect(() => {
    if (assigneeOptions.length > 0 && !assignee) {
      setAssignee(assigneeOptions[0])
    }
  }, [assigneeOptions, assignee])

  useEffect(() => {
    if (!open) return

    if (editingTask) {
      setBrandId(editingTask.projectId)
      setTitle(editingTask.name)
      setDescription(editingTask.description)
      setCreateMore(false)
      setIsDescriptionExpanded(false)

      if (editingTask.assignee && assigneeOptions.length > 0) {
        const assigneeOption = assigneeOptions.find((a) => a.id === editingTask.assignee?.id)
        setAssignee(assigneeOption || assigneeOptions[0])
      }

      const statusOption = STATUS_OPTIONS.find((s) => s.id === editingTask.status) || STATUS_OPTIONS[0]!
      setStatus(statusOption)

      setStartDate(editingTask.startDate ?? new Date())
      setTargetDate(undefined)

      const priorityOption = editingTask.priority
        ? PRIORITY_OPTIONS.find((p) => p.id === editingTask.priority)
        : PRIORITY_OPTIONS[0]
      setPriority(priorityOption)

      const tagOption = editingTask.tag
        ? TAG_OPTIONS.find((t) => t.label === editingTask.tag)
        : undefined
      setSelectedTag(tagOption)

      return
    }

    // New task - use context brand ID
    setBrandId(context?.brandId)
    setTitle('')
    setDescription(undefined)
    setCreateMore(false)
    setIsDescriptionExpanded(false)
    setStatus(STATUS_OPTIONS[0]!)
    setStartDate(new Date())
    setTargetDate(undefined)
    setPriority(PRIORITY_OPTIONS[0])
    setSelectedTag(undefined)
  }, [open, context?.brandId, editingTask, assigneeOptions])

  const brandOptions = useMemo(
    () => brands.map((b: any) => ({ id: b.id, label: b.brandName || 'Untitled Brand' })),
    [brands],
  )

  const handleSubmit = () => {
    if (editingTask) {
      const effectiveBrandId = brandId ?? editingTask.projectId
      const brand = effectiveBrandId
        ? brands.find((b: any) => b.id === effectiveBrandId)
        : undefined

      const updatedTask: ProjectTask = {
        ...editingTask,
        name: title.trim() || 'Untitled task',
        status: status.id,
        dueLabel: targetDate ? format(targetDate, 'dd/MM/yyyy') : editingTask.dueLabel,
        assignee: toUser(assignee),
        startDate,
        priority: priority?.id,
        tag: selectedTag?.label,
        description,
        projectId: effectiveBrandId ?? editingTask.projectId,
        projectName: brand?.brandName ?? editingTask.projectName,
        workstreamId: editingTask.workstreamId,
        workstreamName: editingTask.workstreamName,
      }

      onTaskUpdated?.(updatedTask)
      toast.success("Task updated successfully")
      onClose()
      return
    }

    const effectiveBrandId = brandId ?? brands[0]?.id
    if (!effectiveBrandId) {
      toast.error("Please select a brand")
      return
    }

    const brand = brands.find((b: any) => b.id === effectiveBrandId)
    if (!brand) return

    const newTask: Partial<ProjectTask> = {
      brandId: effectiveBrandId,
      projectId: effectiveBrandId,
      name: title.trim() || 'Untitled task',
      status: status.id,
      dueLabel: targetDate ? format(targetDate, 'dd/MM/yyyy') : undefined,
      assignee: toUser(assignee),
      startDate,
      priority: priority?.id,
      tag: selectedTag?.label,
      description,
      projectName: brand.brandName || 'Untitled Brand',
    }

    onTaskCreated?.(newTask)

    if (createMore) {
      toast.success("Task created! Ready for another.")
      setTitle('')
      setDescription(undefined)
      setStatus(STATUS_OPTIONS[0]!)
      setTargetDate(undefined)
      return
    }

    toast.success("Task created successfully")
    onClose()
  }

  const brandLabel = brandOptions.find((b) => b.id === brandId)?.label

  return (
    <QuickCreateModalLayout
      open={open}
      onClose={onClose}
      isDescriptionExpanded={isDescriptionExpanded}
      onSubmitShortcut={handleSubmit}
    >
      {/* Context row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <GenericPicker
            items={brandOptions}
            selectedId={brandId}
            onSelect={(item) => setBrandId(item.id)}
            placeholder="Choose brand..."
            renderItem={(item) => (
              <div className="flex items-center justify-between w-full gap-2">
                <span>{item.label}</span>
              </div>
            )}
            trigger={
              <button
                className="bg-background flex gap-2 h-7 items-center px-2 py-1 rounded-lg border border-background hover:border-primary/50 transition-colors text-xs disabled:opacity-60"
              >
                <Folder className="size-4 text-muted-foreground" />
                <span className="truncate max-w-[160px] font-medium text-foreground">
                  {brandLabel ?? 'Choose brand'}
                </span>
              </button>
            }
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2 w-full shrink-0 mt-1">
        <div className="flex gap-1 h-10 items-center w-full">
          <input
            id="task-create-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full font-normal leading-7 text-foreground placeholder:text-muted-foreground text-xl outline-none bg-transparent border-none p-0"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Description */}
      <ProjectDescriptionEditor
        value={description}
        onChange={setDescription}
        onExpandChange={setIsDescriptionExpanded}
        placeholder="Briefly describe the goal or details of this task..."
        showTemplates={false}
      />

      {/* Properties */}
      <div className="flex flex-wrap gap-2.5 items-start w-full shrink-0">
        {/* Assignee */}
        <GenericPicker
          items={assigneeOptions}
          onSelect={setAssignee}
          selectedId={assignee?.id}
          placeholder="Assign owner..."
          renderItem={(item) => (
            <div className="flex items-center gap-2 w-full">
              <div className="size-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                {item.name.charAt(0)}
              </div>
              <span className="flex-1">{item.name}</span>
            </div>
          )}
          trigger={
            <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="size-4 rounded-full bg-background flex items-center justify-center text-[10px] font-medium">
                {assignee?.name.charAt(0) ?? '?'}
              </div>
              <span className="font-medium text-foreground text-sm leading-5">
                {assignee?.name ?? 'Assignee'}
              </span>
            </button>
          }
        />

        {/* Start date */}
        <DatePicker
          date={startDate}
          onSelect={setStartDate}
          trigger={
            <button className="bg-muted flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {startDate ? `Start: ${format(startDate, 'dd/MM/yyyy')}` : 'Start date'}
              </span>
            </button>
          }
        />

        {/* Status */}
        <GenericPicker
          items={STATUS_OPTIONS}
          onSelect={setStatus}
          selectedId={status.id}
          placeholder="Change status..."
          renderItem={(item) => (
            <div className="flex items-center gap-2 w-full">
              <span className="flex-1">{item.label}</span>
            </div>
          )}
          trigger={
            <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
              <CircleUser className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {status.label}
              </span>
            </button>
          }
        />

        {/* Target date */}
        <DatePicker
          date={targetDate}
          onSelect={setTargetDate}
          trigger={
            <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {targetDate ? format(targetDate, 'dd/MM/yyyy') : 'Target'}
              </span>
            </button>
          }
        />

        {/* Priority */}
        <GenericPicker
          items={PRIORITY_OPTIONS}
          onSelect={setPriority}
          selectedId={priority?.id}
          placeholder="Set priority..."
          renderItem={(item) => (
            <div className="flex items-center gap-2 w-full">
              <span className="flex-1">{item.label}</span>
            </div>
          )}
          trigger={
            <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
              <BarChart3 className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {priority?.label ?? 'Priority'}
              </span>
            </button>
          }
        />

        {/* Tag */}
        <GenericPicker
          items={TAG_OPTIONS}
          onSelect={setSelectedTag}
          selectedId={selectedTag?.id}
          placeholder="Add tag..."
          renderItem={(item) => (
            <div className="flex items-center gap-2 w-full">
              <span className="flex-1">{item.label}</span>
            </div>
          )}
          trigger={
            <button className="bg-background flex gap-2 h-9 items-center px-3 py-2 rounded-lg border border-border hover:bg-black/5 transition-colors">
              <TagIcon className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm leading-5">
                {selectedTag?.label ?? 'Tag'}
              </span>
            </button>
          }
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto w-full pt-4 shrink-0">
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center size-10 rounded-lg hover:bg-muted transition-colors">
            <Paperclip className="size-4 text-muted-foreground" />
          </button>
          <button className="flex items-center justify-center size-10 rounded-lg hover:bg-muted transition-colors">
            <Mic className="size-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {!editingTask && (
            <div className="flex items-center gap-2">
              <Switch
                checked={createMore}
                onCheckedChange={(value) => setCreateMore(Boolean(value))}
              />
              <span className="text-sm font-medium text-foreground">Create more</span>
            </div>
          )}

          <Button type="button" onClick={handleSubmit} className="h-10 px-4 rounded-xl">
            {editingTask ? 'Save changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </QuickCreateModalLayout>
  )
}
