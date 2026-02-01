import * as React from 'react';

import { GridSection } from '@/components/shared/fragments/grid-section';
import { SiteHeading } from '@/components/shared/fragments/site-heading';

export function StoryHero(): React.JSX.Element {
  return (
    <GridSection hideVerticalGridLines>
      <div className="container py-24 md:py-32">
        <SiteHeading
          badge="Our Story"
          title="Get Found Where AI Searches First"
          description="Born from our own SEO struggles, SearchFIT.AI combines intelligent tracking, AI-powered content creation, and comprehensive technical audits to help you dominate the new age of AI-driven search."
        />
      </div>
    </GridSection>
  );
}
