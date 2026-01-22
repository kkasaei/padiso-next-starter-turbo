import * as React from 'react';

import { GridSection } from '@/components/modules/fragments/grid-section';

interface ReportHeroBannerProps {
  children: React.ReactNode;
}

/**
 * Dashed grid lines for report hero section
 */
function ReportDashedGridLines(): React.JSX.Element {
  return (
    <>
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute bottom-0 left-[calc(50%-50vw)] hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
    </>
  );
}

/**
 * Hero banner with grid and dashed lines pattern
 */
export function ReportHeroBanner({ children }: ReportHeroBannerProps): React.JSX.Element {
  return (
    <GridSection>
      <ReportDashedGridLines />
      <div className="container relative mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </GridSection>
  );
}
