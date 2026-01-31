import * as React from 'react';

import { GridSection } from '@/components/modules/fragments/grid-section';

export function StoryVision(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Our vision
            </h2>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl">
              &quot;AI is changing how people search. We&apos;re changing how businesses
              get found.&quot;
            </p>
          </div>
          <div className="space-y-6 text-base text-muted-foreground md:text-lg">
            <p>
              ChatGPT, Perplexity, and AI search are reshaping discovery.
              Traditional SEO tools weren&apos;t built for this shift. We created
              SearchFIT.AI to help businesses track their AI visibility,
              generate content that AI actually recommends, and audit websites
              for the algorithms that matter now.
            </p>
            <p>
              Three tools working together: real-time AI tracking to see where
              you rank, intelligent content creation to stay ahead, and deep
              technical audits to fix what&apos;s holding you back. This is SEO
              for the AI era.
            </p>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
