'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const INTEGRATIONS = [
  { name: 'Google', icon: '/icons/google.svg' },
  { name: 'Slack', icon: '/icons/slack.svg' },
  { name: 'Notion', icon: '/icons/notion.svg' },
  { name: 'Zapier', icon: '/icons/zapier.svg' },
  { name: 'WordPress', icon: '/icons/wordpress.svg' },
  { name: 'Shopify', icon: '/icons/shopify.svg' },
  { name: 'Linear', icon: '/icons/linear.svg' },
  { name: 'n8n', icon: '/icons/n8n.svg' },
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
        <CardTitle className="text-xl font-semibold">Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect with 40+ analytics, CMS, and marketing tools seamlessly.
        </p>
        <div className="grid grid-cols-4 gap-3">
          {INTEGRATIONS.map((integration, index) => (
            <motion.div
              key={integration.name}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background shadow-sm">
                <Image
                  src={integration.icon}
                  alt={integration.name}
                  width={24}
                  height={24}
                  className="dark:invert"
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{integration.name}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">+32 more integrations</p>
      </CardContent>
    </MotionCard>
  );
}
