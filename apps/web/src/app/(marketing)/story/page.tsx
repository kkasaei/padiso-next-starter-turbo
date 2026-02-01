import * as React from 'react';
import type { Metadata } from 'next';

import { StoryHero } from '@/components/marketing/sections/StoryHero';
import { StoryTeam } from '@/components/marketing/sections/StoryTeam';
import { StoryTimeline } from '@/components/marketing/sections/StoryTimeline';
import { StoryValues } from '@/components/marketing/sections/StoryValues';
import { StoryVision } from '@/components/marketing/sections/StoryVision';
import { createTitle } from '@workspace/common/lib';

export const metadata: Metadata = {
  title: createTitle('Story')
};

export default function StoryPage(): React.JSX.Element {
  return (
    <>
      <StoryHero />
      <StoryVision />
      <StoryTeam />
      <StoryTimeline />
      <StoryValues />
    </>
  );
}
