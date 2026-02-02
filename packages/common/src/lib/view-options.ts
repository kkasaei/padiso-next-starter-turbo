export type ViewType = "calendar" | "card" | "list" | "table" | "kanban"

export type Ordering = "alphabetical" | "date"

export type ViewOptions = {
    viewType: ViewType
    ordering: Ordering
    showClosedProjects: boolean
}

export type FilterChip = {
    key: string
    value: string
}

export const DEFAULT_VIEW_OPTIONS: ViewOptions = {
    viewType: "list",
    ordering: "alphabetical",
    showClosedProjects: true,
}
