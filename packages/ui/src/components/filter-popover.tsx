"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Input } from "./input"
import { Checkbox } from "./checkbox"
import { cn } from "../lib/utils"
import {
  Loader2 as Spinner,
  Languages,
} from "lucide-react"

export type FilterChip = { key: string; value: string }

type FilterTemp = {
  status: Set<string>
  languages: Set<string>
}

interface FilterCounts {
  status?: Record<string, number>
  languages?: Record<string, number>
}

interface FilterPopoverProps {
  initialChips?: FilterChip[]
  onApply: (chips: FilterChip[]) => void
  onClear: () => void
  counts?: FilterCounts
}

const CATEGORIES = [
  { id: "status", label: "Status", icon: Spinner },
  { id: "languages", label: "Languages", icon: Languages },
] as const

export function FilterPopover({ initialChips, onApply, onClear, counts }: FilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState<"status" | "languages">("status")

  const [temp, setTemp] = useState<FilterTemp>(() => ({
    status: new Set<string>(),
    languages: new Set<string>(),
  }))

  const [languageSearch, setLanguageSearch] = useState("")

  // Preselect from chips when opening
  useEffect(() => {
    if (!open) return
    const next: FilterTemp = {
      status: new Set<string>(),
      languages: new Set<string>(),
    }
    for (const c of initialChips || []) {
      const k = c.key.toLowerCase()
      if (k === "status") next.status.add(c.value.toLowerCase())
      if (k === "language" || k === "languages") next.languages.add(c.value)
    }
    setTemp(next)
  }, [open, initialChips])

  const statusOptions = [
    { id: "active", label: "Active", color: "#10b981" },
    { id: "planned", label: "Planned", color: "#6b7280" },
    { id: "backlog", label: "Backlog", color: "#f97316" },
    { id: "completed", label: "Completed", color: "#3b82f6" },
    { id: "cancelled", label: "Cancelled", color: "#ef4444" },
  ]

  const languageOptions = [
    { id: "en-US", label: "English (US)", flag: "🇺🇸" },
    { id: "en-GB", label: "English (UK)", flag: "🇬🇧" },
    { id: "es", label: "Spanish", flag: "🇪🇸" },
    { id: "fr", label: "French", flag: "🇫🇷" },
    { id: "de", label: "German", flag: "🇩🇪" },
    { id: "pt", label: "Portuguese", flag: "🇵🇹" },
    { id: "it", label: "Italian", flag: "🇮🇹" },
    { id: "nl", label: "Dutch", flag: "🇳🇱" },
    { id: "pl", label: "Polish", flag: "🇵🇱" },
    { id: "ru", label: "Russian", flag: "🇷🇺" },
    { id: "ja", label: "Japanese", flag: "🇯🇵" },
    { id: "zh", label: "Chinese", flag: "🇨🇳" },
    { id: "ko", label: "Korean", flag: "🇰🇷" },
    { id: "ar", label: "Arabic", flag: "🇸🇦" },
    { id: "hi", label: "Hindi", flag: "🇮🇳" },
    { id: "bg", label: "Bulgarian", flag: "🇧🇬" },
    { id: "hu", label: "Hungarian", flag: "🇭🇺" },
    { id: "hr", label: "Croatian", flag: "🇭🇷" },
  ]

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
    temp.status.forEach((v) => chips.push({ key: "Status", value: capitalize(v) }))
    temp.languages.forEach((v) => chips.push({ key: "Language", value: v }))
    onApply(chips)
    setOpen(false)
  }

  const handleClear = () => {
    setTemp({
      status: new Set<string>(),
      languages: new Set<string>(),
    })
    onClear()
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
              {filteredCategories.map((cat) => (
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
                  {counts && counts[cat.id as keyof FilterCounts] && (
                    <span className="text-xs text-muted-foreground">
                      {/* Sum of counts for that category if provided */}
                      {Object.values(counts[cat.id as keyof FilterCounts] as Record<string, number>).reduce(
                        (a, b) => a + (typeof b === "number" ? b : 0),
                        0,
                      )}
                    </span>
                  )}
                </button>
              ))}
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

            {active === "languages" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search languages..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {languageOptions
                    .filter((lang) => lang.label.toLowerCase().includes(languageSearch.toLowerCase()))
                    .map((lang) => (
                      <label key={lang.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.languages.has(lang.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, languages: toggleSet(s.languages, lang.id) }))}
                        />
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm flex-1">{lang.label}</span>
                        {counts?.languages?.[lang.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.languages[lang.id]}</span>
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

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
