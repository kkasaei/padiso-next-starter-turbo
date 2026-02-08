'use client';

import * as React from 'react';
import Link from 'next/link';
import { Lightbulb, FileText, Target, TrendingUp, Lock } from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useIsWaitlistMode } from '@/hooks/use-is-waitlist-mode';

interface ContentIdea {
  title: string;
  description: string;
  category: 'Blog Post' | 'Video' | 'Case Study' | 'Guide' | 'Social Media';
  priority: 'high' | 'medium' | 'low';
  topics: string[];
}

interface ContentIdeasLimitedProps {
  ideas: ContentIdea[];
  visibleCount?: number;
}

const priorityColors = {
  high: 'bg-red-500/10 text-red-700 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
};

const categoryIcons = {
  'Blog Post': FileText,
  'Video': TrendingUp,
  'Case Study': Target,
  'Guide': FileText,
  'Social Media': Lightbulb
};

export function ContentIdeasLimited({
  ideas,
  visibleCount = 2
}: ContentIdeasLimitedProps): React.JSX.Element {
  const visibleIdeas = ideas.slice(0, visibleCount);
  const lockedIdeas = ideas.slice(visibleCount);
  const { isWaitlistMode } = useIsWaitlistMode();
  const ctaLink = isWaitlistMode ? '/waitlist' : '/auth/sign-up';
  const ctaText = isWaitlistMode ? 'Join Waitlist' : 'Unlock all content ideas';
  const lockMessage = isWaitlistMode ? 'Join our waitlist to get access when we launch' : 'Free signup required';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-lg">
            <Lightbulb className="size-7 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Content Ideas</h2>
        </div>
        <p className="text-muted-foreground">
          AI-powered content recommendations to improve your visibility across
          LLMs and AI search engines. These ideas are based on gaps in your
          current content and high-value topics in your industry.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
          {/* Visible Ideas */}
          {visibleIdeas.map((idea, index) => {
            const IconComponent = categoryIcons[idea.category];
            return (
              <div
                key={index}
                className="group/idea rounded-2xl border-2 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2">
                      <IconComponent className="size-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">{idea.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${priorityColors[idea.priority]} font-semibold shadow-sm`}
                    >
                      {idea.priority.charAt(0).toUpperCase() +
                        idea.priority.slice(1)}{' '}
                      Priority
                    </Badge>
                    <Badge variant="secondary" className="font-semibold shadow-sm">{idea.category}</Badge>
                  </div>
                </div>
                <p className="mb-4 text-sm font-medium leading-relaxed text-muted-foreground">
                  {idea.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {idea.topics.map((topic, topicIndex) => (
                    <Badge
                      key={topicIndex}
                      variant="outline"
                      className="font-medium shadow-sm"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Locked Ideas */}
          {lockedIdeas.map((idea, index) => {
            const IconComponent = categoryIcons[idea.category];
            return (
              <div
                key={index + visibleCount}
                className="pointer-events-none relative rounded-2xl border-2 border-dashed bg-muted/20 p-6 opacity-60 backdrop-blur-sm"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <Lock className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-muted-foreground">
                      {idea.title.substring(0, 40)}...
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-semibold opacity-70"
                  >
                    Locked
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {idea.description.substring(0, 80)}...
                </p>
              </div>
            );
          })}

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center shadow-lg">
            <div className="rounded-full bg-gradient-to-br from-primary to-primary/80 p-4 shadow-xl">
              <Lock className="size-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold">
                Unlock {lockedIdeas.length} more content ideas + recommendations
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {lockMessage}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link href={ctaLink}>
                {ctaText}
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border-2 bg-gradient-to-br from-muted/50 to-muted/30 p-6 shadow-lg">
            <p className="break-words text-sm font-medium leading-relaxed text-muted-foreground">
              <strong className="font-bold text-foreground">
                Pro tip:
              </strong>{' '}
              Focus on high-priority content first to maximize your AEO
              visibility. Create comprehensive, authoritative content that
              directly answers user questions and showcases your expertise.
            </p>
          </div>
      </div>
    </div>
  );
}

