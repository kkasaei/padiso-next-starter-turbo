import * as React from 'react';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';

const DATA = [
  {
    date: 'February 2026',
    title: 'Developer tools launch',
    description:
      'Launched our API, MCP Server, and developer integrations, empowering developers to build on top of SearchFIT\'s AI visibility platform.'
  },
  {
    date: 'January 2026',
    title: 'Platform expansion',
    description:
      'Expanded our platform with comprehensive SEO tools including Content Generation, Backlinks Analysis, Technical Audits, and Social Listening to provide end-to-end AI visibility solutions.'
  },
  {
    date: '2025',
    title: 'Company established',
    description:
      'After successfully scaling our businesses internally, we launched our AEO Tracking platform to help others achieve the same remarkable results.'
  }
];

export function StoryTimeline(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <h2 className="mb-16 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          The road so far
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
          <div className="space-y-16">
            {DATA.map((milestone, index) => (
              <div
                key={index}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border bg-background">
                  <div className="size-2.5 rounded-full bg-primary" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {milestone.date}
                </div>
                <h3 className="mb-4 text-xl font-medium">{milestone.title}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GridSection>
  );
}
