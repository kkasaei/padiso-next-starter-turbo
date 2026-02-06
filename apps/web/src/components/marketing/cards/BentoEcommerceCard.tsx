'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bot, Package, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const SHOPIFY_FEATURES = [
  { icon: Bot, label: 'AI Product Descriptions', status: 'Live' },
  { icon: Sparkles, label: 'Smart Recommendations', status: 'Live' },
  { icon: Package, label: 'Inventory Sync', status: 'Live' },
];

const MotionCard = motion.create(Card);

export function BentoEcommerceCard({
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#95BF47] p-1.5">
              <Image
                src="/icons/shopify_glyph_black.svg"
                alt="Shopify"
                width={24}
                height={24}
                className="invert"
              />
            </div>
            Shopify
          </div>
          <motion.div 
            className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Connected
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Supercharge your Shopify store with AI-powered visibility and recommendations.
        </p>
        
        {/* Stats row */}
        <div className="flex items-center gap-4">
          <motion.div
            className="flex-1 rounded-xl border-2 border-[#95BF47]/30 bg-[#95BF47]/5 p-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-[#5E8E3E]">1,247</div>
            <div className="text-[10px] text-muted-foreground">Products Synced</div>
          </motion.div>
          <motion.div
            className="flex-1 rounded-xl border bg-muted/30 p-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>+34%</span>
            </div>
            <div className="text-[10px] text-muted-foreground">AI Traffic Boost</div>
          </motion.div>
        </div>
        
        {/* Features */}
        <div className="space-y-2">
          {SHOPIFY_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.label}
              className="flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <feature.icon className="h-4 w-4 text-[#95BF47]" />
                <span className="text-xs font-medium">{feature.label}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                <Zap className="h-3 w-3" />
                {feature.status}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
}
