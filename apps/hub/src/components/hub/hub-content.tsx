'use client'

import { useEffect, useRef } from 'react'
import { BrandingSection } from './sections/branding-section'
import { ColorsSection } from './sections/colors-section'
import { ComponentsSection } from './sections/components-section'
import { IconsSection } from './sections/icons-section'
import { TypographySection } from './sections/typography-section'

interface HubContentProps {
  categoryId: string
  componentId: string | null
}

export function HubContent({ categoryId, componentId }: HubContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll to top when category or component changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [categoryId, componentId])

  // Scroll to specific component if selected
  useEffect(() => {
    if (componentId) {
      const element = document.getElementById(componentId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [componentId])

  const renderContent = () => {
    switch (categoryId) {
      case 'branding':
        return <BrandingSection componentId={componentId} />
      case 'colors':
        return <ColorsSection componentId={componentId} />
      case 'components':
        return <ComponentsSection componentId={componentId} />
      case 'icons':
        return <IconsSection componentId={componentId} />
      case 'typography':
        return <TypographySection componentId={componentId} />
      default:
        return <BrandingSection componentId={componentId} />
    }
  }

  return (
    <div
      ref={contentRef}
      className="dark:md:bg-polar-900 dark:border-polar-800 relative flex w-full flex-col items-center rounded-2xl border-gray-200 px-4 md:overflow-y-auto md:border md:bg-white md:px-8 md:shadow-xs"
    >
      <div className="flex h-full w-full max-w-(--breakpoint-xl) flex-col py-8">
        {renderContent()}
      </div>
    </div>
  )
}
