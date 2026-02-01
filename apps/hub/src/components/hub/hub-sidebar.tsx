'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from '@workspace/ui/components/input'
import { cn } from '@/lib/utils'
import { HUB_CATEGORIES, searchComponents } from './hub-config'

interface HubSidebarProps {
  selectedComponent: string | null
  onSelectComponent: (componentId: string, categoryId: string) => void
}

export function HubSidebar({ selectedComponent, onSelectComponent }: HubSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(HUB_CATEGORIES.map(c => c.id))
  )

  // Search results
  const searchResults = useMemo(() => searchComponents(searchQuery), [searchQuery])
  const isSearching = searchQuery.trim().length > 0

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  return (
    <div
      className="dark:bg-polar-900 dark:border-polar-800 h-full w-full md:rounded-2xl md:border border-gray-200 bg-white md:max-w-[300px] md:shadow-xs xl:max-w-[320px] flex flex-col"
    >
      <div className="dark:divide-polar-800 flex flex-col divide-y divide-gray-200 min-h-0 flex-1">
        {/* Header */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-6 px-4 py-4">
          <div className="font-medium">Design System</div>
        </div>

        {/* Search */}
        <div className="shrink-0 px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No components found
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map((component) => (
                  <button
                    key={`${component.categoryId}-${component.id}`}
                    onClick={() => onSelectComponent(component.id, component.categoryId)}
                    className={cn(
                      'w-full flex flex-col gap-y-1 px-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-polar-800',
                      selectedComponent === component.id && 'bg-gray-50 dark:bg-polar-800'
                    )}
                  >
                    <span className="font-medium text-sm">{component.name}</span>
                    <span className="text-xs text-muted-foreground">{component.categoryName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category List */}
        {!isSearching && (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {HUB_CATEGORIES.map((category) => {
              const Icon = category.icon
              const isExpanded = expandedCategories.has(category.id)

              return (
                <div key={category.id} className="border-b border-gray-100 dark:border-polar-800 last:border-b-0">
                  {/* Category Header (Dropdown) */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-polar-800"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0 text-gray-400 dark:text-polar-500" />
                      <span className="font-medium text-sm">{category.name}</span>
                      <span className="text-xs text-muted-foreground">({category.components.length})</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Component Items */}
                  {isExpanded && (
                    <div className="pb-2">
                      {category.components.map((component) => (
                        <button
                          key={component.id}
                          onClick={() => onSelectComponent(component.id, category.id)}
                          className={cn(
                            'w-full flex flex-col gap-y-0.5 pl-10 pr-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-polar-800',
                            selectedComponent === component.id && 'bg-blue-50 dark:bg-polar-700 border-l-2 border-primary'
                          )}
                        >
                          <span className="text-sm">{component.name}</span>
                          {component.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {component.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

