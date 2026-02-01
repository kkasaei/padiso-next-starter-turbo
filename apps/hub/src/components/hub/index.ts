// Hub Design System Module
// Organized component library for the design system hub
// Exports are organized alphabetically within each section

// Configuration
export { getAllComponents, HUB_CATEGORIES, searchComponents } from './hub-config'

// Main components (alphabetical)
export { HubContent } from './hub-content'
export { HubSidebar } from './hub-sidebar'

// Section components (alphabetical)
export { ColorsSection } from './sections/colors-section'
export { ComponentsSection } from './sections/components-section'
export { TypographySection } from './sections/typography-section'

// Shared components (alphabetical)
export { ColorSwatch } from './shared/color-swatch'
export { DonutChartPlaceholder } from './shared/donut-chart-placeholder'
export { EmptyStateExample } from './shared/empty-state-example'
export { OnboardingModal } from './shared/onboarding-modal'
export { ProviderSelector } from './shared/provider-selector'

// Types (alphabetical)
export type {
  ColorSwatchProps,
  DonutChartPlaceholderProps,
  EmptyStateExampleProps,
  HubCategory,
  HubComponentItem,
} from './types'

// Onboarding types (alphabetical)
export type {
  BusinessType,
  FindSource,
  HelpNeeded,
  OnboardingData,
  PrimaryGoal,
  SupportChannel,
  TeamSize,
  UserRole,
} from './shared/onboarding-types'

export { INITIAL_ONBOARDING_DATA } from './shared/onboarding-types'
