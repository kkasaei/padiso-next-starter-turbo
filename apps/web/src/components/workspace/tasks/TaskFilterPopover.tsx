"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { cn } from "@workspace/ui/lib/utils"
import {
  CheckCircle2,
  BarChart3,
  Tag as TagIcon,
  Folder,
  User,
} from "lucide-react"

export type FilterChip = { key: string; value: string }

type FilterTemp = {
  status: Set<string>
  priority: Set<string>
  tag: Set<string>
  brand: Set<string>
  assignee: Set<string>
}

interface FilterCounts {
  status?: Record<string, number>
  priority?: Record<string, number>
  tag?: Record<string, number>
  brand?: Record<string, number>
  assignee?: Record<string, number>
}

interface TaskFilterPopoverProps {
  initialChips?: FilterChip[]
  onApply: (chips: FilterChip[]) => void
  onClear: () => void
  counts?: FilterCounts
  brands?: Array<{ id: string; name: string }>
  assignees?: Array<{ id: string; name: string }>
  tags?: Array<{ id: string; label: string; color?: string | null }>
  onCreateTag?: (name: string, color: string) => void
  onDeleteTag?: (id: string) => void
}

const CATEGORIES = [
  { id: "status", label: "Status", icon: CheckCircle2 },
  { id: "priority", label: "Priority", icon: BarChart3 },
  { id: "tag", label: "Tag", icon: TagIcon },
  { id: "brand", label: "Brand", icon: Folder },
  { id: "assignee", label: "Assignee", icon: User },
] as const

export function TaskFilterPopover({ 
  initialChips, 
  onApply, 
  onClear, 
  counts, 
  brands = [], 
  assignees = [],
  tags = [],
  onCreateTag,
  onDeleteTag,
}: TaskFilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<"status" | "priority" | "tag" | "brand" | "assignee">("status")

  const [temp, setTemp] = useState<FilterTemp>(() => ({
    status: new Set<string>(),
    priority: new Set<string>(),
    tag: new Set<string>(),
    brand: new Set<string>(),
    assignee: new Set<string>(),
  }))

  const [searchQueries, setSearchQueries] = useState({
    brand: "",
    assignee: "",
    tag: "",
  })

  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#8b5cf6")

  // Preselect from chips when opening
  useEffect(() => {
    if (!open) return
    const next: FilterTemp = {
      status: new Set<string>(),
      priority: new Set<string>(),
      tag: new Set<string>(),
      brand: new Set<string>(),
      assignee: new Set<string>(),
    }
    for (const c of initialChips || []) {
      const k = c.key.toLowerCase()
      const v = c.value.toLowerCase()
      if (k === "status") next.status.add(v)
      if (k === "priority") next.priority.add(v)
      if (k === "tag") next.tag.add(v)
      if (k === "brand") next.brand.add(c.value)
      if (k === "assignee") next.assignee.add(c.value)
    }
    setTemp(next)
  }, [open, initialChips])

  const statusOptions = [
    { id: "todo", label: "To Do", color: "#6b7280" },
    { id: "in-progress", label: "In Progress", color: "#f97316" },
    { id: "done", label: "Done", color: "#10b981" },
  ]

  const priorityOptions = [
    { id: "no-priority", label: "No Priority", color: "#9ca3af" },
    { id: "low", label: "Low", color: "#3b82f6" },
    { id: "medium", label: "Medium", color: "#f59e0b" },
    { id: "high", label: "High", color: "#ef4444" },
    { id: "urgent", label: "Urgent", color: "#dc2626" },
  ]

  const filteredTags = useMemo(() => {
    const q = searchQueries.tag.toLowerCase();
    if (!q) return tags;
    return tags.filter((tag) => tag.label.toLowerCase().includes(q));
  }, [tags, searchQueries.tag]);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q))
  }, [query])

  const toggleSet = (set: Set<string>, v: string) => {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    return n
  }

  const handleApply = () => {
    const chips: FilterChip[] = []
    temp.status.forEach((v) => chips.push({ key: "status", value: v }))
    temp.priority.forEach((v) => chips.push({ key: "priority", value: v }))
    temp.tag.forEach((v) => chips.push({ key: "tag", value: v }))
    temp.brand.forEach((v) => chips.push({ key: "brand", value: v }))
    temp.assignee.forEach((v) => chips.push({ key: "assignee", value: v }))
    onApply(chips)
    setOpen(false)
  }

  const handleClear = () => {
    setTemp({
      status: new Set<string>(),
      priority: new Set<string>(),
      tag: new Set<string>(),
      brand: new Set<string>(),
      assignee: new Set<string>(),
    })
    setSearchQueries({
      brand: "",
      assignee: "",
      tag: "",
    })
    onClear()
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    onCreateTag?.(newTagName.trim(), newTagColor);
    setNewTagName("");
    setNewTagColor("#8b5cf6");
  }

  const handleDeleteTag = (tagId: string) => {
    onDeleteTag?.(tagId);
    // Also remove from temp selection if it was selected
    setTemp((t) => ({ ...t, tag: toggleSet(t.tag, tagId) }));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/60 px-3 bg-transparent">
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[720px] p-0 rounded-xl">
        <div className="grid grid-cols-[260px_minmax(0,1fr)]">
          <div className="p-3 border-r border-border/40">
            <div className="px-1 pb-2">
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="h-8" />
            </div>
            <div className="space-y-1">
              {filteredCategories.map((cat) => {
                const categoryCount = counts?.[cat.id as keyof FilterCounts]
                const totalCount = categoryCount 
                  ? Object.values(categoryCount).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0)
                  : 0
                
                return (
                  <button
                    key={cat.id}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent",
                      active === cat.id && "bg-accent"
                    )}
                    onClick={() => setActive(cat.id)}
                  >
                    <cat.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{cat.label}</span>
                    {totalCount > 0 && (
                      <span className="text-xs text-muted-foreground">{totalCount}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-3">
            {active === "status" && (
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <Checkbox
                      checked={temp.status.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, status: toggleSet(t.status, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.status?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.status[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {active === "priority" && (
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <Checkbox
                      checked={temp.priority.has(opt.id)}
                      onCheckedChange={() => setTemp((t) => ({ ...t, priority: toggleSet(t.priority, opt.id) }))}
                    />
                    <span className="text-sm flex-1">{opt.label}</span>
                    {counts?.priority?.[opt.id] != null && (
                      <span className="text-xs text-muted-foreground">{counts.priority[opt.id]}</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {active === "tag" && (
              <div className="space-y-3">
                {/* Create New Tag */}
                {onCreateTag && (
                  <div className="flex gap-2 pb-3 border-b border-border/40">
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="h-8 w-12 cursor-pointer rounded border border-border"
                    />
                    <Input
                      placeholder="New tag name..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                      className="h-8 flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                      className="h-8"
                    >
                      Add
                    </Button>
                  </div>
                )}

                {/* Tag List */}
                <div className="pb-2">
                  <Input
                    placeholder="Search tags..."
                    value={searchQueries.tag}
                    onChange={(e) => setSearchQueries((s) => ({ ...s, tag: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {filteredTags.map((tag) => (
                    <div key={tag.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent group">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color || "#8b5cf6" }} />
                      <Checkbox
                        checked={temp.tag.has(tag.id)}
                        onCheckedChange={() => setTemp((t) => ({ ...t, tag: toggleSet(t.tag, tag.id) }))}
                      />
                      <span className="text-sm flex-1">{tag.label}</span>
                      {counts?.tag?.[tag.id] != null && (
                        <span className="text-xs text-muted-foreground">{counts.tag[tag.id]}</span>
                      )}
                      {onDeleteTag && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteTag(tag.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {filteredTags.length === 0 && (
                    <p className="col-span-2 text-center text-sm text-muted-foreground py-4">
                      {tags.length === 0 ? "No tags yet. Create one above." : "No tags match your search."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {active === "brand" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search brands..."
                    value={searchQueries.brand}
                    onChange={(e) => setSearchQueries((s) => ({ ...s, brand: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {brands
                    .filter((brand) => brand.name.toLowerCase().includes(searchQueries.brand.toLowerCase()))
                    .map((brand) => (
                      <label key={brand.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.brand.has(brand.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, brand: toggleSet(s.brand, brand.id) }))}
                        />
                        <span className="text-sm flex-1">{brand.name}</span>
                        {counts?.brand?.[brand.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.brand[brand.id]}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {active === "assignee" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search assignees..."
                    value={searchQueries.assignee}
                    onChange={(e) => setSearchQueries((s) => ({ ...s, assignee: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {assignees
                    .filter((assignee) => assignee.name.toLowerCase().includes(searchQueries.assignee.toLowerCase()))
                    .map((assignee) => (
                      <label key={assignee.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.assignee.has(assignee.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, assignee: toggleSet(s.assignee, assignee.id) }))}
                        />
                        <span className="text-sm flex-1">{assignee.name}</span>
                        {counts?.assignee?.[assignee.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.assignee[assignee.id]}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
              <button onClick={handleClear} className="text-sm text-primary hover:underline">
                Clear
              </button>
              <Button size="sm" className="h-8 rounded-lg" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
