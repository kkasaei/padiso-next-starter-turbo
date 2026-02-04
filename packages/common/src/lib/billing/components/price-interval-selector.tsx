'use client';

import * as React from 'react';

import { Label } from '@workspace/ui/components/label';
import {
  RadioGroup,
  RadioGroupItem
} from '@workspace/ui/components/radio-group';
import { cn } from '@workspace/common/lib';

export type PriceInterval = 'month' | 'year';

export type PriceIntervalSelectorProps =
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    interval: PriceInterval;
    onIntervalChange: (interval: PriceInterval) => void;
  };

export function PriceIntervalSelector({
  interval,
  onIntervalChange,
  className,
  ...other
}: PriceIntervalSelectorProps): React.JSX.Element {
  return (
    <div
      className={cn('flex justify-center', className)}
      {...other}
    >
      <div className="flex h-12 w-fit shrink-0 items-center rounded-full bg-muted p-1 border border-border">
        <RadioGroup
          value={interval}
          className="h-full gap-0 grid-cols-2"
          onValueChange={(value) => {
            onIntervalChange(value as PriceInterval);
          }}
        >
          {(['month', 'year'] as const).map((displayInterval) => {
            const isSelected = interval === displayInterval;
            return (
              <div
                key={displayInterval}
                className={cn(
                  'h-full rounded-full transition-all',
                  isSelected && 'bg-white shadow-md dark:bg-zinc-900'
                )}
              >
                <RadioGroupItem
                  value={displayInterval}
                  id={displayInterval}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={displayInterval}
                  className={cn(
                    'flex h-full cursor-pointer items-center justify-center px-6 text-sm transition-all',
                    isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  )}
                >
                  {displayInterval === 'month' && 'Billed Monthly'}
                  {displayInterval === 'year' && 'Billed Yearly'}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}
