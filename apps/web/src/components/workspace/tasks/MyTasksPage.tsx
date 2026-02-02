"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

// Hooks
import { useBrands } from "@/hooks/use-brands";
import { useWorkspaceByClerkOrgId } from "@/hooks/use-workspace";
import { useTasksByWorkspace, useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useTaskTagsByWorkspace, useCreateTaskTag, useDeleteTaskTag } from "@/hooks/use-task-tags";

// Types
import { dbTaskToUI, uiTaskToCreateDB, uiTaskToUpdateDB, type UITask } from "@workspace/common/lib/types/tasks";
import { DEFAULT_VIEW_OPTIONS, type FilterChip as FilterChipType, type ViewOptions } from "@workspace/common/lib";

// Local Task Components
import { TaskTableView } from "./TaskTableView";
import { TaskKanbanView } from "./TaskKanbanView";
import { TaskFilterPopover } from "./TaskFilterPopover";
import { ChipOverflow } from "./ChipOverflow";
import { TaskViewOptionsPopover } from "./TaskViewOptionsPopover";
import { TaskQuickCreateModal, type CreateTaskContext } from "./TaskQuickCreateModal";
import { TasksEmptyState } from "./TasksEmptyState";


/**
 * MyTasksPage Component
 * 
 * Displays all tasks across all brands/projects for the current workspace.
 * Supports multiple view types: Table and Kanban.
 * Fully integrated with database via tRPC.
 * 
 * @component
 */
export function MyTasksPage() {
  // ============================================================
  // DATA FETCHING
  // ============================================================
  const { organization, membershipList } = useOrganization({
    membershipList: {}
  });
  const { data: workspace } = useWorkspaceByClerkOrgId(organization?.id || "");
  const { data: brands = [] } = useBrands(workspace?.id);
  const { data: dbTasks = [], isLoading } = useTasksByWorkspace(workspace?.id || "");
  const { data: dbTaskTags = [] } = useTaskTagsByWorkspace(workspace?.id || "");
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const createTagMutation = useCreateTaskTag();
  const deleteTagMutation = useDeleteTaskTag();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [filters, setFilters] = useState<FilterChipType[]>([]);
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    ...DEFAULT_VIEW_OPTIONS,
    viewType: "table" // Override default to table for this page
  });
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createContext, setCreateContext] = useState<CreateTaskContext | undefined>();
  const [editingTask, setEditingTask] = useState<UITask | undefined>();

  // ============================================================
  // COMPUTED VALUES
  // ============================================================
  
  // Convert DB tasks to UI format with brand names
  const tasks = useMemo(() => {
    return dbTasks.map((dbTask) => {
      const brand = brands.find(b => b.id === dbTask.brandId);
      return dbTaskToUI(dbTask, brand?.brandName || undefined);
    });
  }, [dbTasks, brands]);


  // Apply filters
  const filteredTasks = useMemo(() => {
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

  // Prepare brands for filter
  const brandsForFilter = useMemo(() => {
    return brands.map((brand: any) => ({
      id: brand.id,
      name: brand.brandName || "Untitled Brand",
    }));
  }, [brands]);

  // Prepare tags for filter
  const tagsForFilter = useMemo(() => {
    return dbTaskTags.map((tag: any) => ({
      id: tag.id,
      label: tag.name,
      color: tag.color,
    }));
  }, [dbTaskTags]);

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

  // Filter counts for popover
  const filterCounts = useMemo(() => {
    const counts: { 
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
        counts.status![task.status] = (counts.status![task.status] || 0) + 1;
      }
      if (task.priority) {
        counts.priority![task.priority] = (counts.priority![task.priority] || 0) + 1;
      }
      if (task.tag) {
        // Map tag name to tag ID
        const tagObj = dbTaskTags.find((t: any) => t.name.toLowerCase() === task.tag?.toLowerCase());
        if (tagObj) {
          counts.tag![tagObj.id] = (counts.tag![tagObj.id] || 0) + 1;
        }
      }
      if (task.brandId) {
        counts.brand![task.brandId] = (counts.brand![task.brandId] || 0) + 1;
      }
      if (task.assignee?.id) {
        counts.assignee![task.assignee.id] = (counts.assignee![task.assignee.id] || 0) + 1;
      }
    });

    return counts;
  }, [tasks, dbTaskTags]);

  // ============================================================
  // EVENT HANDLERS - Modal Management
  // ============================================================
  const openCreateTask = (context?: CreateTaskContext) => {
    setEditingTask(undefined);
    setCreateContext(context);
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
  // EVENT HANDLERS - Tag Management
  // ============================================================
  const handleCreateTag = async (name: string, color: string) => {
    // Create tag for the first brand in the workspace
    // In a real app, you might want to prompt which brand or create for all
    const firstBrandId = brands[0]?.id;
    if (!firstBrandId) {
      toast.error("No brand found to create tag");
      return;
    }

    try {
      await createTagMutation.mutateAsync({
        brandId: firstBrandId,
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

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">No workspace found</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <>
        <header className="flex flex-col border-b border-border/40">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-medium text-foreground">Tasks</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => openCreateTask()}>
                <Plus className="mr-1.5 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </header>

        <TasksEmptyState
          description={tasks.length === 0 ? "Create your first task to get started" : "No tasks match your filters"}
          onCreateTask={() => openCreateTask()}
        />

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
      {/* Header Section */}
      <header className="flex flex-col border-b border-border/40">
        {/* Title Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-medium text-foreground">Tasks</h1>
            <span className="text-sm text-muted-foreground">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
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
              counts={filterCounts}
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
            <TaskViewOptionsPopover 
              options={viewOptions} 
              onChange={setViewOptions} 
              allowedViewTypes={["table", "kanban"]} 
            />
          </div>
        </div>
      </header>

      {/* Content Section - View-dependent Rendering */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {viewOptions.viewType === "table" && (
          <TaskTableView
            tasks={filteredTasks}
            onToggleTask={toggleTask}
            onOpenTask={(task) => openEditTask(task)}
          />
        )}
        
        {viewOptions.viewType === "kanban" && (
          <TaskKanbanView
            tasks={filteredTasks}
            onToggleTask={toggleTask}
            onOpenTask={(task) => openEditTask(task)}
            onAddTask={openCreateTask}
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
