'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { HubSidebar, HubContent } from '@/components/hub'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('colors')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSelectComponent = (componentId: string, categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedComponent(componentId)
    setMobileMenuOpen(false) // Close mobile menu when selecting
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row gap-2">
      {/* Mobile: Menu button + Sheet */}
      <div className="md:hidden flex items-center gap-3 pb-2">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="h-4 w-4" />
              <span>Components</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Design System Components</SheetTitle>
            </SheetHeader>
            <HubSidebar
              selectedComponent={selectedComponent}
              onSelectComponent={handleSelectComponent}
            />
          </SheetContent>
        </Sheet>
        <span className="text-sm text-muted-foreground">
          {selectedComponent ? `Viewing: ${selectedComponent}` : 'Design System'}
        </span>
      </div>

      {/* Desktop: Sidebar always visible */}
      <div className="hidden md:block shrink-0 w-[300px] xl:w-[320px]">
        <HubSidebar
          selectedComponent={selectedComponent}
          onSelectComponent={handleSelectComponent}
        />
      </div>

      {/* Content area showing selected section/component */}
      <HubContent
        categoryId={selectedCategory}
        componentId={selectedComponent}
      />
    </div>
  )
}
