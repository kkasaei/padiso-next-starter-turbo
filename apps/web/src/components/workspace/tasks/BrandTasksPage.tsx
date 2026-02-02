"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";

// Hooks
import { useBrand } from "@/hooks/use-brands";
import { useTasksByBrand, useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useTaskTagsByBrand, useCreateTaskTag, useDeleteTaskTag } from "@/hooks/use-task-tags";

// Types
import { dbTaskToUI, uiTaskToCreateDB, uiTaskToUpdateDB, type UITask } from "@workspace/common/lib/types/tasks";
import { DEFAULT_VIEW_OPTIONS, type FilterChip as FilterChipType, type ViewOptions } from "@workspace/common/lib";

// Local Task Components
import {
  type ProjectTaskGroup,
  ProjectTaskListView,
} from "./TaskHelpers";
import { TaskWeekBoardView } from "./TaskWeekBoardView";
import { TaskFilterPopover } from "./TaskFilterPopover";
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
  const { membershipList } = useOrganization({
    membershipList: {}
  });
  const { data: brandData, isLoading: isBrandLoading } = useBrand(projectId);
  const { data: dbTasks = [], isLoading: isTasksLoading } = useTasksByBrand(projectId);
  const { data: dbTaskTags = [] } = useTaskTagsByBrand(projectId);
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const createTagMutation = useCreateTaskTag();
  const deleteTagMutation = useDeleteTaskTag();

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

    return tasks.filter((task) => {
      return filters.every((chip) => {
        const key = chip.key.toLowerCase();
        const value = chip.value.toLowerCase();

        if (key === "status") {
          return task.status === value;
        }
        
        if (key === "priority") {
          return task.priority?.toLowerCase() === value;
        }
        
        if (key === "tag") {
          // value is now a tag ID, need to map to tag name
          const tagObj = dbTaskTags.find((t: any) => t.id === value);
          return tagObj && task.tag?.toLowerCase() === tagObj.name.toLowerCase();
        }
        
        if (key === "brand") {
          return task.brandId === value || task.projectId === value;
        }
        
        if (key === "assignee") {
          return task.assignee?.id === value;
        }

        return true;
      });
    });
  }, [tasks, filters, dbTaskTags]);

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

  // Get workspace members as potential assignees
  const assigneesForFilter = useMemo(() => {
    if (!membershipList?.data) return [];
    
    return membershipList.data.map((membership) => ({
      id: membership.publicUserData.userId,
      name: membership.publicUserData.firstName && membership.publicUserData.lastName
        ? `${membership.publicUserData.firstName} ${membership.publicUserData.lastName}`
        : membership.publicUserData.identifier || 'Unknown User',
    }));
  }, [membershipList]);

  // Brands for filter (current brand only)
  const brandsForFilter = useMemo(() => {
    if (!brandData) return [];
    return [{
      id: brandData.id,
      name: brandData.brandName || "Untitled Brand",
    }];
  }, [brandData]);

  // Prepare tags for filter
  const tagsForFilter = useMemo(() => {
    return dbTaskTags.map((tag: any) => ({
      id: tag.id,
      label: tag.name,
      color: tag.color,
    }));
  }, [dbTaskTags]);

  // Filter counts for popover
  const counts = useMemo(() => {
    const filterCounts: { 
      status?: Record<string, number>
      priority?: Record<string, number>
      tag?: Record<string, number>
      brand?: Record<string, number>
      assignee?: Record<string, number>
    } = { 
      status: {}, 
      priority: {}, 
      tag: {}, 
      brand: {}, 
      assignee: {} 
    };

    tasks.forEach((task) => {
      if (task.status) {
        filterCounts.status![task.status] = (filterCounts.status![task.status] || 0) + 1;
      }
      if (task.priority) {
        filterCounts.priority![task.priority] = (filterCounts.priority![task.priority] || 0) + 1;
      }
      if (task.tag) {
        // Map tag name to tag ID
        const tagObj = dbTaskTags.find((t: any) => t.name.toLowerCase() === task.tag?.toLowerCase());
        if (tagObj) {
          filterCounts.tag![tagObj.id] = (filterCounts.tag![tagObj.id] || 0) + 1;
        }
      }
      if (task.brandId) {
        filterCounts.brand![task.brandId] = (filterCounts.brand![task.brandId] || 0) + 1;
      }
      if (task.assignee?.id) {
        filterCounts.assignee![task.assignee.id] = (filterCounts.assignee![task.assignee.id] || 0) + 1;
      }
    });

    return filterCounts;
  }, [tasks, dbTaskTags]);

  // ============================================================
  // EVENT HANDLERS - Tag Management
  // ============================================================
  const handleCreateTag = async (name: string, color: string) => {
    try {
      await createTagMutation.mutateAsync({
        brandId: projectId,
        name,
        color,
      });
      toast.success("Tag created");
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTagMutation.mutateAsync({ id: tagId });
      toast.success("Tag deleted");
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  };

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

        <div className="flex flex-1 flex-col min-w-0 p-6">
          <div className="md:dark:bg-polar-900 dark:border-polar-700 w-full md:rounded-xl md:border md:border-gray-100 md:bg-gray-50 md:p-8 lg:rounded-4xl items-center justify-center gap-y-6 md:flex md:flex-col md:py-48">
            <div className="text-gray-300 dark:text-gray-600">
              <Plus className="h-12 w-12" />
            </div>
            <div className="flex flex-col items-center gap-y-6">
              <div className="flex flex-col items-center gap-y-2">
                <h3 className="text-lg font-medium">No tasks yet</h3>
                <p className="dark:text-polar-500 text-gray-500 text-center max-w-md">
                  {tasks.length === 0 ? "Create your first task to get started" : "No tasks match your filters"}
                </p>
              </div>
              <Button onClick={() => openCreateTask()} className="rounded-2xl gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </div>
          </div>
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
            <TaskFilterPopover
              initialChips={filters}
              onApply={setFilters}
              onClear={() => setFilters([])}
              counts={counts}
              brands={brandsForFilter}
              assignees={assigneesForFilter}
              tags={tagsForFilter}
              onCreateTag={handleCreateTag}
              onDeleteTag={handleDeleteTag}
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
            tags={tagsForFilter}
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
