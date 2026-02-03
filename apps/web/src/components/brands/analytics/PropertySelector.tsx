'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Badge } from '@workspace/ui/components/badge'
import type { GSCProperty } from './types'

interface PropertySelectorProps {
  properties: GSCProperty[]
  selectedPropertyId: string | null
  onPropertyChange: (propertyId: string) => void
}

export function PropertySelector({
  properties,
  selectedPropertyId,
  onPropertyChange,
}: PropertySelectorProps) {
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId)

  return (
    <Select value={selectedPropertyId || ''} onValueChange={onPropertyChange}>
      <SelectTrigger className="w-[280px] h-9">
        <SelectValue placeholder="Select a property">
          {selectedProperty && (
            <span className="truncate">{selectedProperty.siteUrl}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {properties.map((property) => (
          <SelectItem key={property.id} value={property.id}>
            <div className="flex items-center gap-2">
              <span className="truncate">{property.siteUrl}</span>
              {property.permissionLevel === 'siteOwner' && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Owner
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
