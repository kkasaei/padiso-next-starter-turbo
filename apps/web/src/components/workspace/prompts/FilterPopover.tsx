"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { Folder, Sparkles } from "lucide-react";

export type FilterChip = { key: string; value: string };

type FilterTemp = {
  projects: Set<string>;
  providers: Set<string>;
};

interface FilterCounts {
  projects?: Record<string, number>;
  providers?: Record<string, number>;
}

interface FilterPopoverProps {
  initialChips?: FilterChip[];
  onApply: (chips: FilterChip[]) => void;
  onClear: () => void;
  counts?: FilterCounts;
  projects?: Array<{ id: string; name: string }>;
  providers?: Array<{ value: string; label: string; color: string; icon: string }>;
}

const CATEGORIES = [
  { id: "projects", label: "Projects", icon: Folder },
  { id: "providers", label: "Providers", icon: Sparkles },
] as const;

export function FilterPopover({ initialChips, onApply, onClear, counts, projects = [], providers = [] }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<"projects" | "providers">("projects");

  const [temp, setTemp] = useState<FilterTemp>(() => ({
    projects: new Set<string>(),
    providers: new Set<string>(),
  }));

  const [projectSearch, setProjectSearch] = useState("");
  const [providerSearch, setProviderSearch] = useState("");

  // Preselect from chips when opening
  useEffect(() => {
    if (!open) return;
    const next: FilterTemp = {
      projects: new Set<string>(),
      providers: new Set<string>(),
    };
    for (const c of initialChips || []) {
      const k = c.key.toLowerCase();
      if (k === "project" || k === "projects") next.projects.add(c.value);
      if (k === "provider" || k === "providers") next.providers.add(c.value);
    }
    setTemp(next);
  }, [open, initialChips]);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const toggleSet = (set: Set<string>, v: string) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  };

  const handleApply = () => {
    const chips: FilterChip[] = [];
    // Store project ID as value (will be displayed as name in chip)
    temp.projects.forEach((projectId) => chips.push({ key: "Project", value: projectId }));
    // Store provider value (will be displayed as label in chip)
    temp.providers.forEach((providerValue) => chips.push({ key: "Provider", value: providerValue }));
    onApply(chips);
    setOpen(false);
  };

  const handleClear = () => {
    setTemp({
      projects: new Set<string>(),
      providers: new Set<string>(),
    });
    onClear();
  };

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
            {active === "projects" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {projects
                    .filter((project) => project.name.toLowerCase().includes(projectSearch.toLowerCase()))
                    .map((project) => (
                      <label key={project.id} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.projects.has(project.id)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, projects: toggleSet(s.projects, project.id) }))}
                        />
                        <span className="text-sm flex-1">{project.name}</span>
                        {counts?.projects?.[project.id] != null && (
                          <span className="text-xs text-muted-foreground">{counts.projects[project.id]}</span>
                        )}
                      </label>
                    ))}
                </div>
              </div>
            )}

            {active === "providers" && (
              <div>
                <div className="pb-2">
                  <Input
                    placeholder="Search providers..."
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {providers
                    .filter((provider) => provider.label.toLowerCase().includes(providerSearch.toLowerCase()))
                    .map((provider) => (
                      <label key={provider.value} className="flex items-center gap-2 rounded-lg border p-2 hover:bg-accent cursor-pointer">
                        <Checkbox
                          checked={temp.providers.has(provider.value)}
                          onCheckedChange={() => setTemp((s) => ({ ...s, providers: toggleSet(s.providers, provider.value) }))}
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Image
                            src={provider.icon}
                            alt={provider.label}
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                          <span className="text-sm truncate">{provider.label}</span>
                        </div>
                        {counts?.providers?.[provider.value] != null && (
                          <span className="text-xs text-muted-foreground">{counts.providers[provider.value]}</span>
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
  );
}
