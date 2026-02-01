import { LucideIcon } from 'lucide-react'

// Component item in sidebar
export interface HubComponentItem {
  id: string
  name: string
  description?: string
}

// Category/Page in sidebar
export interface HubCategory {
  id: string
  name: string
  icon: LucideIcon
  description: string
  components: HubComponentItem[]
}

// Shared component props
export interface ColorSwatchProps {
  name: string
  variable: string
  className: string
  textClass?: string
}

export interface EmptyStateExampleProps {
  title: string
  description: string
  icon: React.ReactNode
  actionLabel?: string
  variant?: 'default' | 'coming-soon'
}

export interface DonutChartPlaceholderProps {
  centerText?: string
  centerSubtext?: string
}

