import {
  Palette,
  Type,
  Component,
  Shapes,
  Sparkles,
} from 'lucide-react'
import type { HubCategory } from './types'

// All components organized by category (alphabetical)
export const HUB_CATEGORIES: HubCategory[] = [
  {
    id: 'branding',
    name: 'Branding',
    icon: Sparkles,
    description: 'Logo and brand assets',
    components: [
      { id: 'logo', name: 'Logo', description: 'Logo variants and usage' },
    ],
  },
  {
    id: 'colors',
    name: 'Colors',
    icon: Palette,
    description: 'Theme colors and semantic tokens',
    components: [
      { id: 'chart-colors', name: 'Chart Colors', description: 'Data visualization colors' },
      { id: 'core-colors', name: 'Core Colors', description: 'Background, foreground, primary' },
      { id: 'gray-scale', name: 'Gray Scale', description: 'Polar gray scale' },
      { id: 'sidebar-colors', name: 'Sidebar Colors', description: 'Navigation sidebar colors' },
      { id: 'ui-colors', name: 'UI Colors', description: 'Cards, popovers, borders' },
    ],
  },
  {
    id: 'components',
    name: 'Components',
    icon: Component,
    description: 'UI components and patterns',
    components: [
      { id: 'badges', name: 'Badges', description: 'Status indicators' },
      { id: 'bar-chart', name: 'Bar Chart', description: 'Opportunities resolved' },
      { id: 'buttons', name: 'Buttons', description: 'Variants and sizes' },
      { id: 'data-table', name: 'Data Table', description: 'Table with search & pagination' },
      { id: 'date-picker', name: 'Date Picker', description: 'Analytics date range picker' },
      { id: 'donut-charts', name: 'Donut Charts', description: 'Competitor mentions' },
      { id: 'dropdown-menu', name: 'Dropdown Menu', description: 'Context menus' },
      { id: 'empty-state', name: 'Empty State', description: 'Empty lists & coming soon placeholders' },
      { id: 'form-fields', name: 'Form Fields', description: 'With AI generation' },
      { id: 'inputs', name: 'Inputs', description: 'Text inputs with icons' },
      { id: 'instruction-cards', name: 'Instruction Cards', description: 'Feature cards' },
      { id: 'metric-cards', name: 'Metric Cards', description: 'Analytics cards with charts' },
      { id: 'onboarding-cards', name: 'Onboarding Cards', description: 'Progress cards' },
      { id: 'onboarding-modal', name: 'Onboarding Modal', description: 'Multi-step onboarding wizard' },
      { id: 'organization-nav', name: 'Organization Nav', description: 'User & org menu' },
      { id: 'pricing-cards', name: 'Pricing Cards', description: 'Subscription plans' },
      { id: 'pricing-faq', name: 'Pricing FAQ', description: 'FAQ accordion' },
      { id: 'project-list', name: 'Project List', description: 'List with filters' },
      { id: 'project-switcher', name: 'Project Switcher', description: 'Dropdown selector' },
      { id: 'provider-selector', name: 'Provider Selector', description: 'AI provider tabs' },
      { id: 'sentiment-bars', name: 'Sentiment Bars', description: 'Progress bars' },
      { id: 'stats-cards', name: 'Stats Cards', description: 'Dashboard metric cards' },
      { id: 'subscription-settings', name: 'Subscription Settings', description: 'Billing & usage' },
      { id: 'tabs', name: 'Tabs', description: 'Tab components' },
      { id: 'training-cards', name: 'Training Cards', description: 'Carousel modules' },
      { id: 'trial-alerts', name: 'Trial Alerts', description: 'Urgency banners' },
      { id: 'two-column-layout', name: 'Two-Column Layout', description: 'Sidebar + detail' },
      { id: 'welcome-card', name: 'Welcome Card', description: 'Initial setup complete card' },
    ],
  },
  {
    id: 'icons',
    name: 'Icons',
    icon: Shapes,
    description: 'Custom icons and SVG assets',
    components: [
      { id: 'custom-icons', name: 'Custom Icons', description: 'React icon components' },
      { id: 'svg-icons', name: 'SVG Icons', description: 'Public SVG assets' },
    ],
  },
  {
    id: 'typography',
    name: 'Typography',
    icon: Type,
    description: 'Font styles and text utilities',
    components: [
      { id: 'font-family', name: 'Font Family', description: 'Inter font system' },
      { id: 'font-weights', name: 'Font Weights', description: 'Regular to bold' },
      { id: 'text-colors', name: 'Text Colors', description: 'Foreground and muted' },
      { id: 'type-scale', name: 'Type Scale', description: 'Text sizes xs to 3xl' },
    ],
  },
]

// Get all components flattened for search
export function getAllComponents() {
  return HUB_CATEGORIES.flatMap(category =>
    category.components.map(component => ({
      ...component,
      categoryId: category.id,
      categoryName: category.name,
    }))
  )
}

// Search components
export function searchComponents(query: string) {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return getAllComponents().filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description?.toLowerCase().includes(lowerQuery)
  )
}

