'use client'

import * as React from 'react'

interface HubSidebarProps {
  selectedComponent: string | null
  onSelectComponent: (componentId: string, categoryId: string) => void
}

export function HubSidebar({ selectedComponent, onSelectComponent }: HubSidebarProps) {
  return (
    <div className="h-full border-r bg-background p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <p className="text-sm text-muted-foreground">
        Sidebar content goes here
      </p>
    </div>
  )
}

interface HubContentProps {
  categoryId: string
  componentId: string | null
}

export function HubContent({ categoryId, componentId }: HubContentProps) {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {componentId || 'Select a component'}
      </h1>
      <p className="text-muted-foreground">
        Content area for {categoryId}
      </p>
    </div>
  )
}
