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
      <div className="flex h-10 w-fit shrink-0 items-center rounded-md bg-muted p-1 text-lg">
        <RadioGroup
          value={interval}
          className="h-full gap-0 grid-cols-2"
          onValueChange={(value) => {
            onIntervalChange(value as PriceInterval);
          }}
        >
          {(['month', 'year'] as const).map((displayInterval) => (
            <div
              key={displayInterval}
              className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-background has-[button[data-state="checked"]]:shadow-xs'
            >
              <RadioGroupItem
                value={displayInterval}
                id={displayInterval}
                className="peer sr-only"
              />
              <Label
                htmlFor={displayInterval}
                className="flex h-full cursor-pointer items-center justify-center px-5 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
              >
                {displayInterval === 'month' && 'Billed Monthly'}
                {displayInterval === 'year' && 'Billed Yearly'}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
