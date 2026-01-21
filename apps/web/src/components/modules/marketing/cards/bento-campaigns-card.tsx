'use client';

import * as React from 'react';
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  PenToolIcon,
  SearchIcon,
  TrendingUpIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@workspace/ui/components/carousel';
import { cn } from '@/lib/utils';

const DATA = [
  {
    type: 'automation',
    icon: FileTextIcon,
    title: 'Meta Description Generation',
    timing: 'Auto-generated when content is published'
  },
  {
    type: 'automation',
    icon: BellIcon,
    title: 'Ranking Drop Alert',
    timing: 'Alert when keyword drops 5+ positions'
  },
  {
    type: 'automation',
    icon: CalendarIcon,
    title: 'Content Calendar Sync',
    timing: 'Scheduled content optimization reviews'
  },
  {
    type: 'automation',
    icon: SearchIcon,
    title: 'New Keyword Opportunities',
    timing: 'Weekly keyword opportunity reports'
  },
  {
    type: 'automation',
    icon: PenToolIcon,
    title: 'Content Optimization Suggestions',
    timing: 'Real-time SEO scoring updates'
  },
  {
    type: 'automation',
    icon: TrendingUpIcon,
    title: 'Ranking Improvement Notifications',
    timing: 'Daily ranking improvement alerts'
  },
  {
    type: 'automation',
    icon: FileTextIcon,
    title: 'Competitor Content Analysis',
    timing: 'Monthly competitor content reports'
  },
  {
    type: 'automation',
    icon: CalendarIcon,
    title: 'High-Priority Keyword Tracking',
    timing: 'Daily tracking for top 50 keywords'
  }
];

const MotionCard = motion.create(Card);

export function BentoCampaignsCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  return (
    <MotionCard
      className={cn(
        'relative h-[300px] max-h-[300px] overflow-hidden',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          Automatially explores new opportinities for content and actions to take.
        </p>
        <Carousel
          opts={{
            align: 'start',
            skipSnaps: true,
            loop: true,
            dragFree: true
          }}
          plugins={[
            Autoplay({
              delay: 2000
            })
          ]}
          orientation="vertical"
          className="pointer-events-none size-full select-none"
        >
          <CarouselContent className="pointer-events-none -mt-1 h-[232px] select-none sm:h-[146px]">
            {DATA.map(({ title, timing, icon: Icon }, index) => (
              <CarouselItem
                key={index}
                className="pointer-events-none basis-1/4 select-none pt-1 will-change-transform"
              >
                <Card className="m-1 p-0">
                  <CardContent className="flex w-full flex-row items-center justify-start gap-4 p-6">
                    <div className="rounded-full bg-primary p-2 text-primary-foreground">
                      <Icon className="size-5 shrink-0" />
                    </div>
                    <div>
                      <div className="text-xs font-medium sm:text-sm">
                        {title}
                      </div>
                      <div className="text-[10px] text-muted-foreground sm:text-xs">
                        {timing}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </MotionCard>
  );
}
