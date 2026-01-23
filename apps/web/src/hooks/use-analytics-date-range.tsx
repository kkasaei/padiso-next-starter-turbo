'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import type { DateRange } from 'react-day-picker'

// ============================================================
// Types
// ============================================================
export type DateRangePresetId = '24h' | '7d' | '28d' | '3m' | '6m' | '12m' | '16m' | 'all' | 'custom'

export type AnalyticsDateRangeContextValue = {
  /** Current date range */
  dateRange: DateRange
  /** Current preset ID (null if custom) */
  presetId: DateRangePresetId
  /** Update the date range */
  setDateRange: (range: DateRange, presetId?: DateRangePresetId) => void
  /** Select a preset by ID */
  selectPreset: (presetId: DateRangePresetId) => void
}

// ============================================================
// Default: Last 7 days
// ============================================================
const getDefaultDateRange = (): DateRange => ({
  from: startOfDay(subDays(new Date(), 6)),
  to: endOfDay(new Date()),
})

// ============================================================
// Context
// ============================================================
const AnalyticsDateRangeContext = createContext<AnalyticsDateRangeContextValue | null>(null)

// ============================================================
// Provider
// ============================================================
export function AnalyticsDateRangeProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRangeState] = useState<DateRange>(getDefaultDateRange)
  const [presetId, setPresetId] = useState<DateRangePresetId>('7d')

  const setDateRange = useCallback((range: DateRange, newPresetId?: DateRangePresetId) => {
    setDateRangeState(range)
    setPresetId(newPresetId || 'custom')
  }, [])

  const selectPreset = useCallback((id: DateRangePresetId) => {
    const range = getPresetRange(id)
    if (range) {
      setDateRangeState(range)
      setPresetId(id)
    }
  }, [])

  const value = useMemo(
    () => ({
      dateRange,
      presetId,
      setDateRange,
      selectPreset,
    }),
    [dateRange, presetId, setDateRange, selectPreset]
  )

  return (
    <AnalyticsDateRangeContext.Provider value={value}>
      {children}
    </AnalyticsDateRangeContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================
export function useAnalyticsDateRange(): AnalyticsDateRangeContextValue {
  const context = useContext(AnalyticsDateRangeContext)
  
  if (!context) {
    throw new Error('useAnalyticsDateRange must be used within an AnalyticsDateRangeProvider')
  }
  
  return context
}

// ============================================================
// Helper: Get date range for a preset
// ============================================================
export function getPresetRange(presetId: DateRangePresetId): DateRange | null {
  const now = new Date()
  
  switch (presetId) {
    case '24h':
      return {
        from: startOfDay(subDays(now, 1)),
        to: endOfDay(now),
      }
    case '7d':
      return {
        from: startOfDay(subDays(now, 6)),
        to: endOfDay(now),
      }
    case '28d':
      return {
        from: startOfDay(subDays(now, 27)),
        to: endOfDay(now),
      }
    case '3m':
      return {
        from: startOfDay(subDays(now, 90)),
        to: endOfDay(now),
      }
    case '6m':
      return {
        from: startOfDay(subDays(now, 180)),
        to: endOfDay(now),
      }
    case '12m':
      return {
        from: startOfDay(subDays(now, 365)),
        to: endOfDay(now),
      }
    case '16m':
      return {
        from: startOfDay(subDays(now, 480)),
        to: endOfDay(now),
      }
    case 'all':
      // All time - go back ~5 years (arbitrary large range)
      return {
        from: startOfDay(subDays(now, 1825)),
        to: endOfDay(now),
      }
    case 'custom':
      return null
    default:
      return null
  }
}

