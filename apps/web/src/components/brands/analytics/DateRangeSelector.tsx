'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { DATE_RANGE_OPTIONS, type DateRange } from './types'

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (value: DateRange) => void
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const selectedOption = DATE_RANGE_OPTIONS.find((o) => o.value === value)

  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
      <SelectTrigger className="w-[140px] h-9">
        <SelectValue>
          {selectedOption?.label || 'Select range'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Aggregation selector (Daily, Weekly, Monthly)
type AggregationType = 'daily' | 'weekly' | 'monthly'

interface AggregationSelectorProps {
  value: AggregationType
  onChange: (value: AggregationType) => void
}

export function AggregationSelector({ value, onChange }: AggregationSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AggregationType)}>
      <SelectTrigger className="w-[100px] h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </SelectContent>
    </Select>
  )
}
