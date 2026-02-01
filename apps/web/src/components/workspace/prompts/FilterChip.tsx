"use client";

import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  icon?: React.ReactNode;
}

export function FilterChip({ label, onRemove, icon }: FilterChipProps) {
  return (
    <div className="flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-muted px-3 text-sm min-w-0 max-w-[200px]">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="ml-0.5 rounded-md p-0.5 hover:bg-accent flex-shrink-0">
        <X className="h-3.5 w-3.5 stroke-[3]" />
      </button>
    </div>
  );
}
