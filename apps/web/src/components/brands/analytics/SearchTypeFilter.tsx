'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import { Label } from '@workspace/ui/components/label'
import { Filter, Plus } from 'lucide-react'

export type SearchType = 'web' | 'image' | 'video' | 'news'

interface SearchTypeFilterProps {
  value: SearchType
  onChange: (value: SearchType) => void
}

const SEARCH_TYPES: { value: SearchType; label: string }[] = [
  { value: 'web', label: 'Web' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'news', label: 'News' },
]

export function SearchTypeFilter({ value, onChange }: SearchTypeFilterProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = SEARCH_TYPES.find((t) => t.value === value)?.label || 'Web'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Search type: {selectedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Search type</div>
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              onChange(v as SearchType)
              setOpen(false)
            }}
            className="space-y-3"
          >
            {SEARCH_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-3">
                <RadioGroupItem value={type.value} id={type.value} />
                <Label htmlFor={type.value} className="font-normal cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
