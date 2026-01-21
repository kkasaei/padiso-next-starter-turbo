import * as React from 'react';

import { FlickeringGrid } from '@/components/modules/fragments/flickering-grid';
import { GridSection } from '@/components/modules/fragments/grid-section';

export function StoryValues(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container relative max-w-4xl overflow-hidden py-24 md:py-32">
        <p className="mx-auto text-center text-2xl font-semibold sm:text-3xl md:text-4xl">
          &ldquo;The businesses that win tomorrow are the ones AI recommends today.&rdquo;
        </p>
        <FlickeringGrid
          className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(450px_circle_at_center,var(--background),transparent)]"
          squareSize={4}
          gridGap={6}
          color="gray"
          maxOpacity={0.12}
          height={400}
          width={1000}
        />
      </div>
    </GridSection>
  );
}
