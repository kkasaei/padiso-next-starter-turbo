/**
 * Prompts Module - Self-contained prompt management components
 * 
 * All prompts integrated with database via tRPC with zero mock data.
 */

// ============================================================
// MAIN COMPONENT
// ============================================================
export { PromptsContent } from "./PromptsContent";

// ============================================================
// SUB-COMPONENTS
// ============================================================
export { PromptHeader } from "./PromptHeader";
export { PromptCard } from "./PromptCard";
export { PromptCardsView } from "./PromptCardsView";
export { PromptTableView } from "./PromptTableView";
export { PromptPagination } from "./PromptPagination";
export { CreatePromptModal } from "./CreatePromptModal";
export { PromptDetailModal } from "./PromptDetailModal";
export { PromptsViewOptionsPopover } from "./PromptsViewOptionsPopover";

// ============================================================
// FILTER COMPONENTS
// ============================================================
export { FilterPopover } from "./FilterPopover";
export { FilterChip } from "./FilterChip";

// ============================================================
// TYPES
// ============================================================
export type { FilterChip as FilterChipType } from "./FilterPopover";
