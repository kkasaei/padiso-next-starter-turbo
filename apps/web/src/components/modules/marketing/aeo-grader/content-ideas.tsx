'use client';

import * as React from 'react';
import { Lightbulb, FileText, Target, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';

interface ContentIdea {
  title: string;
  description: string;
  category: 'Blog Post' | 'Video' | 'Case Study' | 'Guide' | 'Social Media';
  priority: 'high' | 'medium' | 'low';
  topics: string[];
}

interface ContentIdeasProps {
  ideas: ContentIdea[];
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

export function ContentIdeas({ ideas }: ContentIdeasProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Lightbulb className="size-6 text-primary" />
          Content Ideas
        </CardTitle>
        <CardDescription>
          AI-powered content recommendations to improve your visibility across
          LLMs and AI search engines. These ideas are based on gaps in your
          current content and high-value topics in your industry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.isArray(ideas) && ideas.map((idea, index) => {
            const IconComponent = categoryIcons[idea.category];
            return (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="size-5 text-primary" />
                    <h3 className="font-semibold">{idea.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={priorityColors[idea.priority]}
                    >
                      {idea.priority.charAt(0).toUpperCase() +
                        idea.priority.slice(1)}{' '}
                      Priority
                    </Badge>
                    <Badge variant="secondary">{idea.category}</Badge>
                  </div>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {idea.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {idea.topics.map((topic, topicIndex) => (
                    <Badge
                      key={topicIndex}
                      variant="outline"
                      className="text-xs"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg border bg-muted/50 p-4">
          <p className="break-words text-sm text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Pro tip:
            </strong>{' '}
            Focus on high-priority content first to maximize your AEO
            visibility. Create comprehensive, authoritative content that
            directly answers user questions and showcases your expertise.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

