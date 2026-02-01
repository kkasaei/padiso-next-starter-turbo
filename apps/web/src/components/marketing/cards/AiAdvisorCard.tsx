import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GlobeIcon,
  SearchIcon,
  TrendingUpIcon,
  TagsIcon,
  ShoppingCartIcon,
  BarChartIcon
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

export function AiAdvisorCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>): React.JSX.Element {
  return (
    <Card
      className={cn('pb-0', className)}
      {...props}
    >
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <Image
            src="/icons/shopify_glyph_black.svg"
            alt="Shopify"
            width={20}
            height={20}
            className="brightness-0 dark:brightness-100"
          />
          <h2 className="text-xl font-semibold">Modern Essentials</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GlobeIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Store</span>
            <Link
              href="https://modernessentials.myshopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500"
            >
              modernessentials.myshopify.com
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Keywords</span>
            <span className="text-sm">1,234 tracked</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Growth</span>
            <span className="text-sm text-green-600 dark:text-green-400">+15.3%</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Products</span>
            <span className="text-sm">245 optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <TagsIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Platforms</span>
            <div className="flex items-center gap-1.5">
              <Image
                src="/icons/google.svg"
                alt="Google"
                width={16}
                height={16}
                className="brightness-0 dark:brightness-100"
              />
              <Image
                src="/icons/openai.svg"
                alt="OpenAI"
                width={16}
                height={16}
                className="brightness-0 dark:brightness-100"
              />
              <Image
                src="/icons/gemini.svg"
                alt="Gemini"
                width={16}
                height={16}
                className="brightness-0 dark:brightness-100"
              />
              <Image
                src="/icons/shopify_glyph_black.svg"
                alt="Shopify"
                width={16}
                height={16}
                className="brightness-0 dark:brightness-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChartIcon className="size-4 text-muted-foreground" />
            <span className="w-20 text-sm text-muted-foreground">Ranking</span>
            <span className="text-sm">Top 3 positions: 87</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-4 rounded-b-xl bg-neutral-50 py-6 dark:bg-neutral-900">
        <h3 className="text-base font-semibold sm:text-lg">Search Insights</h3>
        <div className="min-h-10 max-w-md text-sm text-muted-foreground">
          Your store has 12 high-opportunity keywords ready for optimization.
          Suggested next action: Optimize product descriptions for 5 trending search terms.
        </div>
      </CardFooter>
    </Card>
  );
}
