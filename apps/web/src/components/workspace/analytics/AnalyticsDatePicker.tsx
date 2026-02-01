'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ChevronDown, Check } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@workspace/common/lib'
import { Button } from '@workspace/ui/components/button'
import { Calendar } from '@workspace/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { useAnalyticsDateRange, getPresetRange, type DateRangePresetId } from '@workspace/ui/hooks/use-analytics-date-range'

// ============================================================
// Date Range Presets (Google Search Console style)
// ============================================================
export type DatePreset = {
  id: DateRangePresetId
  label: string
  /** Show in quick access buttons (not in "More" dropdown) */
  showInQuickAccess?: boolean
}

const DATE_PRESETS: DatePreset[] = [
  { id: '24h', label: '24 hours', showInQuickAccess: true },
  { id: '7d', label: '7 days', showInQuickAccess: true },
  { id: '28d', label: '28 days', showInQuickAccess: true },
  { id: '3m', label: '3 months', showInQuickAccess: true },
  { id: '6m', label: '6 months', showInQuickAccess: false },
  { id: '12m', label: '12 months', showInQuickAccess: false },
  { id: '16m', label: '16 months', showInQuickAccess: false },
  { id: 'all', label: 'All time', showInQuickAccess: false },
]

// ============================================================
// Analytics Date Range Picker Component
// Google Search Console Style - Horizontal button row with "More" dropdown
// Uses useAnalyticsDateRange hook for state management
// ============================================================
export type AnalyticsDatePickerProps = {
  className?: string
  disabled?: boolean
  /** Include "Custom" option for manual date selection */
  allowCustom?: boolean
  /** Available presets (defaults to all) */
  presets?: DatePreset[]
}

export function AnalyticsDatePicker({
  className,
  disabled,
  allowCustom = true,
  presets = DATE_PRESETS,
}: AnalyticsDatePickerProps) {
  const { dateRange, presetId, setDateRange, selectPreset } = useAnalyticsDateRange()
  
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [showCustomCalendar, setShowCustomCalendar] = React.useState(false)
  const [tempDateRange, setTempDateRange] = React.useState<DateRange | undefined>(dateRange)

  // Split presets into quick access and "more" dropdown
  const quickAccessPresets = presets.filter((p) => p.showInQuickAccess)
  const morePresets = presets.filter((p) => !p.showInQuickAccess)

  const handlePresetSelect = (preset: DatePreset) => {
    selectPreset(preset.id)
    setShowCustomCalendar(false)
    setMoreOpen(false)
  }

  const handleCustomSelect = () => {
    setShowCustomCalendar(true)
    setTempDateRange(dateRange)
  }

  const handleCustomApply = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      setDateRange(tempDateRange, 'custom')
      setMoreOpen(false)
      setShowCustomCalendar(false)
    }
  }

  const handleCustomCancel = () => {
    setShowCustomCalendar(false)
    setTempDateRange(dateRange)
  }

  // Check if active preset is in "More" dropdown
  const isMoreActive = presetId && morePresets.some((p) => p.id === presetId)
  const isCustomActive = presetId === 'custom'

  return (
    <div className={cn('flex items-center', className)}>
      {/* Quick Access Buttons - Horizontal Row */}
      <div className="flex items-center rounded-lg border bg-background">
        {quickAccessPresets.map((preset, index) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            disabled={disabled}
            className={cn(
              'relative flex h-9 items-center px-3 text-sm font-medium transition-colors',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              presetId === preset.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground',
              index === 0 && 'rounded-l-lg',
              disabled && 'pointer-events-none opacity-50'
            )}
          >
            <span>{preset.label}</span>
          </button>
        ))}

        {/* Separator */}
        <div className="h-5 w-px bg-border" />

        {/* "More" Dropdown */}
        <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger asChild>
            <button
              disabled={disabled}
              className={cn(
                'flex h-9 items-center gap-1 rounded-r-lg px-3 text-sm font-medium transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                (isMoreActive || isCustomActive)
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground',
                disabled && 'pointer-events-none opacity-50'
              )}
            >
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="end"
            sideOffset={8}
          >
            {showCustomCalendar ? (
              // Custom Calendar View
              <div className="flex flex-col">
                <div className="border-b px-4 py-3">
                  <h4 className="text-sm font-medium">Custom date range</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tempDateRange?.from && tempDateRange?.to ? (
                      <>
                        {format(tempDateRange.from, 'MMM d, yyyy')} –{' '}
                        {format(tempDateRange.to, 'MMM d, yyyy')}
                      </>
                    ) : (
                      'Select start and end dates'
                    )}
                  </p>
                </div>
                <Calendar
                  mode="range"
                  selected={tempDateRange}
                  onSelect={setTempDateRange}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                  className="p-3"
                />
                <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCustomCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCustomApply}
                    disabled={!tempDateRange?.from || !tempDateRange?.to}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ) : (
              // More Options View
              <div className="flex min-w-[160px] flex-col py-1">
                {morePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent',
                      presetId === preset.id && 'bg-accent'
                    )}
                  >
                    <span>{preset.label}</span>
                    {presetId === preset.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
                {allowCustom && (
                  <>
                    <div className="my-1 border-t" />
                    <button
                      onClick={handleCustomSelect}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent',
                        isCustomActive && 'bg-accent'
                      )}
                    >
                      <span>Custom range</span>
                      {isCustomActive && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// ============================================================
// Export presets for external use
// ============================================================
export { DATE_PRESETS, getPresetRange }
