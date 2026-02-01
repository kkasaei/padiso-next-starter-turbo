'use client'

import { ColorSwatch } from '../shared/color-swatch'

interface ColorsSectionProps {
  componentId: string | null
}

export function ColorsSection({ componentId }: ColorsSectionProps) {
  return (
    <div className="flex flex-col gap-y-8">
      {/* Core Colors */}
      {(!componentId || componentId === 'core-colors') && (
        <section id="core-colors" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Core Colors</h2>
          <p className="text-sm text-muted-foreground">Primary semantic colors used throughout the application. Click to copy.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Background" variable="bg-background" className="bg-background" />
            <ColorSwatch name="Foreground" variable="bg-foreground" className="bg-foreground" textClass="text-background" />
            <ColorSwatch name="Primary" variable="bg-primary" className="bg-primary" textClass="text-primary-foreground" />
            <ColorSwatch name="Secondary" variable="bg-secondary" className="bg-secondary" />
            <ColorSwatch name="Muted" variable="bg-muted" className="bg-muted" />
            <ColorSwatch name="Accent" variable="bg-accent" className="bg-accent" />
          </div>
        </section>
      )}

      {/* UI Colors */}
      {(!componentId || componentId === 'ui-colors') && (
        <section id="ui-colors" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">UI Colors</h2>
          <p className="text-sm text-muted-foreground">Colors for cards, popovers, and interactive elements.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Card" variable="bg-card" className="bg-card" />
            <ColorSwatch name="Popover" variable="bg-popover" className="bg-popover" />
            <ColorSwatch name="Border" variable="bg-border" className="bg-border" />
            <ColorSwatch name="Input" variable="bg-input" className="bg-input" />
            <ColorSwatch name="Ring" variable="bg-ring" className="bg-ring" textClass="text-white" />
            <ColorSwatch name="Destructive" variable="bg-destructive" className="bg-destructive" textClass="text-white" />
          </div>
        </section>
      )}

      {/* Chart Colors */}
      {(!componentId || componentId === 'chart-colors') && (
        <section id="chart-colors" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Chart Colors</h2>
          <p className="text-sm text-muted-foreground">Colors for data visualization and charts.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch name="Chart 1" variable="bg-chart-1" className="bg-chart-1" textClass="text-white" />
            <ColorSwatch name="Chart 2" variable="bg-chart-2" className="bg-chart-2" textClass="text-white" />
            <ColorSwatch name="Chart 3" variable="bg-chart-3" className="bg-chart-3" textClass="text-white" />
            <ColorSwatch name="Chart 4" variable="bg-chart-4" className="bg-chart-4" textClass="text-foreground" />
            <ColorSwatch name="Chart 5" variable="bg-chart-5" className="bg-chart-5" textClass="text-foreground" />
          </div>
        </section>
      )}

      {/* Sidebar Colors */}
      {(!componentId || componentId === 'sidebar-colors') && (
        <section id="sidebar-colors" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Sidebar Colors</h2>
          <p className="text-sm text-muted-foreground">Colors specific to the sidebar navigation.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ColorSwatch name="Sidebar" variable="bg-sidebar" className="bg-sidebar" />
            <ColorSwatch name="Sidebar Primary" variable="bg-sidebar-primary" className="bg-sidebar-primary" textClass="text-sidebar-primary-foreground" />
            <ColorSwatch name="Sidebar Accent" variable="bg-sidebar-accent" className="bg-sidebar-accent" />
            <ColorSwatch name="Sidebar Border" variable="bg-sidebar-border" className="bg-sidebar-border" />
          </div>
        </section>
      )}

      {/* Gray Scale (Polar) */}
      {(!componentId || componentId === 'gray-scale') && (
        <section id="gray-scale" className="space-y-4 scroll-mt-8">
          <h2 className="text-lg font-semibold">Gray Scale (Polar)</h2>
          <p className="text-sm text-muted-foreground">Custom polar gray scale for dark mode and subtle backgrounds.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="Gray 50" variable="bg-gray-50" className="bg-gray-50" />
            <ColorSwatch name="Gray 100" variable="bg-gray-100" className="bg-gray-100" />
            <ColorSwatch name="Gray 200" variable="bg-gray-200" className="bg-gray-200" />
            <ColorSwatch name="Gray 300" variable="bg-gray-300" className="bg-gray-300" />
            <ColorSwatch name="Gray 400" variable="bg-gray-400" className="bg-gray-400" />
            <ColorSwatch name="Gray 500" variable="bg-gray-500" className="bg-gray-500" textClass="text-white" />
          </div>
        </section>
      )}
    </div>
  )
}

