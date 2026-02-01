import * as React from 'react';

import { cn } from '@/lib/utils';

import { GridSection } from '@/components/shared/fragments/GridSection';
import { NumberTicker } from '@/components/shared/fragments/NumberTicket';

const DATA = [
  {
    value: 245,
    suffix: '%',
    description: 'Average search visibility increase'
  },
  {
    value: 1,
    suffix: 'M+',
    description: 'Keywords tracked across platforms'
  },
  {
    value: 87,
    suffix: '%',
    description: 'Of stores rank in top 3 positions'
  },
  {
    value: 5,
    suffix: 'x',
    description: 'Faster optimization than manual SEO'
  }
];

export function Stats(): React.JSX.Element {
  return (
    <GridSection>
      <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
        {DATA.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'justify-top flex flex-col items-center border-dashed p-6 text-center lg:p-8 ',
              (index === 2 || index === 3) && 'border-t lg:border-t-0'
            )}
          >
            <p className="whitespace-nowrap text-2xl font-semibold md:text-3xl">
              <NumberTicker value={stat.value} />
              {stat.suffix}
            </p>
            <p className="mt-2 whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </GridSection>
  );
}
