"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Switch } from "@workspace/ui/components/switch"
import {
  SlidersHorizontal,
  LayoutGrid,
  ChevronsUpDown,
  Table,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

type Options = {
  viewType: "list" | "table"
  ordering: "alphabetical" | "date" | "provider" | "project" | "name"
  showClosedProjects: boolean
}

interface ViewOptionsPopoverProps {
  options: Options
  onChange: (options: Options) => void
  allowedViewTypes?: string[]
}

export function PromptsViewOptionsPopover({ options, onChange, allowedViewTypes }: ViewOptionsPopoverProps) {
  const [orderingOpen, setOrderingOpen] = useState(false)

  const allViewTypes = [
    { id: "list", label: "List", icon: LayoutGrid },
    { id: "table", label: "Table", icon: Table },
  ]

  const viewTypes = allowedViewTypes 
    ? allViewTypes.filter(v => allowedViewTypes.includes(v.id))
    : allViewTypes // Show all by default

  const orderingOptions = [
    { id: "name", label: "Name" },
    { id: "alphabetical", label: "Alphabetical" },
    { id: "date", label: "Date" },
    { id: "provider", label: "Provider" },
    { id: "project", label: "Project" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-xl p-0" align="end">
        <div className="p-4">
          {/* View Type Tabs */}
          <div className="flex rounded-xl p-1 bg-muted">
            {viewTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onChange({ ...options, viewType: type.id as Options['viewType'] })}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-colors shadow-none",
                  options.viewType === type.id
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <type.icon className="h-5 w-5" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {/* Ordering Dropdown */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Sort by</span>
              <Popover open={orderingOpen} onOpenChange={setOrderingOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 rounded-lg border-border/60 px-3 bg-transparent"
                  >
                    {orderingOptions.find((o) => o.id === options.ordering)?.label}
                    <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 rounded-xl p-1" align="end">
                  {orderingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onChange({ ...options, ordering: option.id as Options['ordering'] })
                        setOrderingOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                        options.ordering === option.id && "bg-accent",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Show archived brands */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Archived Brands</span>
              <Switch
                checked={options.showClosedProjects}
                onCheckedChange={(checked) => onChange({ ...options, showClosedProjects: checked })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
