/**
 * Tasks Module - Self-contained task management components
 * 
 * All components are encapsulated within this module with no external
 * dependencies on shared or brands folders. This ensures modularity
 * and maintainability.
 */

// ============================================================
// MAIN PAGE COMPONENTS
// ============================================================
export { MyTasksPage } from "./MyTasksPage";
export { BrandTasksPage } from "./BrandTasksPage";
export { WorkspaceTasksPage } from "./WorkspaceTasksPage";

// ============================================================
// VIEW COMPONENTS
// ============================================================
export { TaskTableView } from "./TaskTableView";
export { TaskKanbanView } from "./TaskKanbanView";
export { TaskWeekBoardView } from "./TaskWeekBoardView";

// ============================================================
// FILTER & UI COMPONENTS (Encapsulated)
// ============================================================
export { FilterPopover } from "./FilterPopover";
export { FilterChip } from "./FilterChip";
export { ChipOverflow } from "./ChipOverflow";
export { ProgressCircle } from "./ProgressCircle";
export { ViewOptionsPopover } from "./ViewOptionsPopover";
export { TaskViewOptionsPopover } from "./TaskViewOptionsPopover";

// ============================================================
// MODAL & LAYOUT COMPONENTS
// ============================================================
export { QuickCreateModalLayout } from "./QuickCreateModalLayout";
export { TaskQuickCreateModal } from "./TaskQuickCreateModal";

// ============================================================
// TASK-SPECIFIC COMPONENTS
// ============================================================
export { TaskRowBase } from "./TaskRowBase";
export { TaskBoardCard } from "./TaskBoardCard";
export { GenericPicker, DatePicker } from "./TaskPickers";
export { ProjectDescriptionEditor } from "./TaskDescriptionEditor";

// ============================================================
// HELPERS & UTILITIES
// ============================================================
export * from "./TaskHelpers";

// ============================================================
// TYPES
// ============================================================
export type { FilterChip as FilterChipType } from "./FilterPopover";
export type { Chip } from "./ChipOverflow";
