"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

// Hooks
import { useBrand } from "@/hooks/use-brands";
import { useTasksByBrand, useCreateTask, useUpdateTask } from "@/hooks/use-tasks";

// Types
import { dbTaskToUI, uiTaskToCreateDB, uiTaskToUpdateDB, type UITask } from "@/lib/types/tasks";
import { DEFAULT_VIEW_OPTIONS, type FilterChip as FilterChipType, type ViewOptions } from "@/lib/view-options";

// Local Task Components
import {
  type ProjectTaskGroup,
  ProjectTaskListView,
  filterTasksByChips,
  computeTaskFilterCounts,
} from "./TaskHelpers";
import { TaskWeekBoardView } from "./TaskWeekBoardView";
import { FilterPopover } from "./FilterPopover";
import { ChipOverflow } from "./ChipOverflow";
import { ViewOptionsPopover } from "./ViewOptionsPopover";
import { TaskQuickCreateModal, type CreateTaskContext } from "./TaskQuickCreateModal";

interface BrandTasksPageProps {
  projectId: string;
}

/**
 * BrandTasksPage Component
 * 
 * Displays all tasks for a specific brand/project.
 * Supports multiple view types: List (with drag-drop) and Board (weekly timeline).
 * Fully integrated with database via tRPC.
 * 
 * @component
 */
export function BrandTasksPage({ projectId }: BrandTasksPageProps) {
  // ============================================================
  // DATA FETCHING
  // ============================================================
  const { data: brandData, isLoading: isBrandLoading } = useBrand(projectId);
  const { data: dbTasks = [], isLoading: isTasksLoading } = useTasksByBrand(projectId);
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const isLoading = isBrandLoading || isTasksLoading;

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [filters, setFilters] = useState<FilterChipType[]>([]);
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    ...DEFAULT_VIEW_OPTIONS,
    viewType: "list" // Brand page defaults to list view
  });
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createContext, setCreateContext] = useState<CreateTaskContext | undefined>();
  const [editingTask, setEditingTask] = useState<UITask | undefined>();

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  
  // Convert DB tasks to UI format
  const tasks = useMemo(() => {
    return dbTasks.map((dbTask) => dbTaskToUI(dbTask, brandData?.brandName || undefined));
  }, [dbTasks, brandData?.brandName]);

  // Apply filters
  const visibleTasks = useMemo(() => {
    if (filters.length === 0) return tasks;
    return filterTasksByChips(tasks, filters);
  }, [tasks, filters]);

  // Create task groups for list view
  const visibleGroups = useMemo<ProjectTaskGroup[]>(() => {
    if (!brandData || visibleTasks.length === 0) return [];
    
    return [{
      project: {
        id: brandData.id,
        name: brandData.brandName || "Untitled Brand",
        status: brandData.status,
      },
      tasks: visibleTasks,
    }];
  }, [brandData, visibleTasks]);

  // Filter counts for popover
  const counts = useMemo(() => {
    return computeTaskFilterCounts(tasks);
  }, [tasks]);

  // ============================================================
  // EVENT HANDLERS - Modal Management
  // ============================================================
  const openCreateTask = (context?: CreateTaskContext) => {
    setEditingTask(undefined);
    setCreateContext(context ?? { brandId: projectId });
    setIsCreateTaskOpen(true);
  };

  const openEditTask = (task: UITask) => {
    setEditingTask(task);
    setCreateContext(undefined);
    setIsCreateTaskOpen(true);
  };

  const closeTaskModal = () => {
    setIsCreateTaskOpen(false);
    setEditingTask(undefined);
    setCreateContext(undefined);
  };

  // ============================================================
  // EVENT HANDLERS - Task CRUD Operations
  // ============================================================
  const handleTaskCreated = async (taskData: Partial<UITask>) => {
    if (!taskData.brandId || !taskData.name || !taskData.status) {
      toast.error("Missing required fields");
      return;
    }

    try {
      const dbData = uiTaskToCreateDB({
        ...taskData,
        brandId: taskData.brandId,
        name: taskData.name,
        status: taskData.status,
      });

      await createTaskMutation.mutateAsync(dbData);
      toast.success("Task created");
      closeTaskModal();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleTaskUpdated = async (taskData: UITask) => {
    try {
      const dbData = uiTaskToUpdateDB(taskData);
      await updateTaskMutation.mutateAsync({
        id: taskData.id,
        ...dbData,
      });
      toast.success("Task updated");
      closeTaskModal();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      await updateTaskMutation.mutateAsync({
        id: taskId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to update task");
    }
  };

  const changeTaskTag = async (taskId: string, tagLabel?: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        tag: tagLabel,
      });
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error("Failed to update tag");
    }
  };

  const moveTaskDate = async (taskId: string, newDate: Date) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        startDate: newDate.toISOString(),
      });
    } catch (error) {
      console.error("Error updating date:", error);
      toast.error("Failed to update date");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = tasks.findIndex((task) => task.id === active.id);
    const overIndex = tasks.findIndex((task) => task.id === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    // Note: Drag-drop reordering would need a 'sortOrder' field in DB
    // For now, this is visual-only. To persist, add sortOrder to schema
    const reordered = arrayMove(tasks, activeIndex, overIndex);
    console.log("Tasks reordered (visual only, not persisted):", reordered);
  };

  // ============================================================
  // RENDER - Loading & Empty States
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Brand not found</p>
      </div>
    );
  }

  if (visibleTasks.length === 0) {
    return (
      <>
        <header className="flex flex-col border-b border-border/40">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">Tasks</p>
              <p className="text-xs text-muted-foreground">
                {brandData?.brandName ? `Manage tasks for ${brandData.brandName}` : "No tasks available yet"}
              </p>
            </div>
            <Button size="sm" onClick={() => openCreateTask()}>
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
              {tasks.length === 0 ? "Create your first task to get started" : "No tasks match your filters"}
            </p>
          </div>
          <Button onClick={() => openCreateTask()}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </>
    );
  }

  // ============================================================
  // RENDER - Main UI
  // ============================================================
  return (
    <>
      <header className="flex flex-col border-b border-border/40">
        {/* Title Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-medium text-foreground">Tasks</h1>
            <span className="text-sm text-muted-foreground">
              {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => openCreateTask()}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Filter & View Options Row */}
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
                setFilters((prev) => 
                  prev.filter((chip) => !(chip.key === key && chip.value === value))
                )
              }
              maxVisible={6}
            />
          </div>
          <div className="flex items-center gap-2">
            <ViewOptionsPopover 
              options={viewOptions} 
              onChange={setViewOptions} 
              allowedViewTypes={["list", "board"]} 
            />
          </div>
        </div>
      </header>

      {/* Content Section - View-dependent Rendering */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
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

      {/* Task Creation/Edit Modal */}
      <TaskQuickCreateModal
        open={isCreateTaskOpen}
        onClose={closeTaskModal}
        context={editingTask ? undefined : createContext}
        onTaskCreated={(task) => handleTaskCreated(task)}
        editingTask={editingTask}
        onTaskUpdated={(task) => handleTaskUpdated(task)}
      />
    </>
  );
}
