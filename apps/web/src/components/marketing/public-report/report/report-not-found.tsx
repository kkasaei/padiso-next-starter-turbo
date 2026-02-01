import * as React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { GridSection } from '@/components/shared/fragments/grid-section';
import { AEODomainInput } from '@/components/marketing/sections/aeo-domain-input';
import { ANIMATIONS } from '@workspace/common/constants';

interface ReportNotFoundProps {
  domain: string;
}

export function ReportNotFound({ domain }: ReportNotFoundProps): React.JSX.Element {
  return (
    <GridSection className="min-h-screen w-full overflow-x-hidden">
      <div className="relative mx-auto mt-20 flex w-full max-w-5xl flex-col items-center px-4 py-12 sm:mt-24 md:mt-28 lg:mt-32">
        {/* Animated Icon */}
        <motion.div {...ANIMATIONS.scaleRotate} className="relative mb-8">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-border bg-background shadow-lg">
            <SearchX className="size-10 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          {...ANIMATIONS.fadeInUp}
          transition={{ ...ANIMATIONS.fadeInUp.transition, delay: 0.2 }}
          className="mb-6 w-full text-center"
        >
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Report Not Found
          </h1>
          <div className="mx-auto max-w-2xl space-y-3 text-muted-foreground">
            <p className="text-lg sm:text-xl md:text-2xl">
              We couldn&apos;t locate a report for{' '}
              <span className="font-semibold text-foreground">
                {decodeURIComponent(domain)}
              </span>
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              This domain hasn&apos;t been analyzed yet, or the report may have expired.
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          {...ANIMATIONS.fadeInUp}
          transition={{ ...ANIMATIONS.fadeInUp.transition, delay: 0.4 }}
          className="mb-12 flex flex-col items-center gap-3 text-center"
        >
          <div className="flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
            <Sparkles className="size-4 text-primary" />
            <span>Generate a free AEO report now</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Analyze your domain&apos;s visibility across ChatGPT, Perplexity, and Gemini
          </p>
        </motion.div>

        {/* Domain Input */}
        <motion.div
          {...ANIMATIONS.fadeInUp}
          transition={{ ...ANIMATIONS.fadeInUp.transition, delay: 0.6 }}
          className="w-full px-3 sm:px-4 md:px-6"
        >
          <AEODomainInput />
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          {...ANIMATIONS.fadeIn}
          transition={{ ...ANIMATIONS.fadeIn.transition, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Homepage
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div
          {...ANIMATIONS.fadeIn}
          transition={{ ...ANIMATIONS.fadeIn.transition, delay: 1 }}
          className="mt-16 w-full max-w-2xl rounded-2xl border bg-card/50 p-6 text-center backdrop-blur-sm sm:p-8"
        >
          <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error or need assistance,{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              contact our support team
            </Link>{' '}
            with the domain name and any additional details.
          </p>
        </motion.div>
      </div>
    </GridSection>
  );
}
