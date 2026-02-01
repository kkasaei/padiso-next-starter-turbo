'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { APP_NAME } from '@workspace/common/constants';
import { cn } from '@/lib/utils';

import { GridSection } from '@/components/shared/fragments/GridSection';
import { Marquee } from '@/components/shared/fragments/Marquee';

const DATA = [
  {
    name: 'David Zhang',
    role: 'VP of Marketing at TechFlow Solutions',
    img: '/example-data/people/hugo_schmidt.png',
    description: (
      <p>
        {APP_NAME}'s AI-powered keyword research has transformed our SEO
        strategy.{' '}
        <strong>
          Organic traffic increased by 180% in just 6 months.
        </strong>{' '}
        The AI content optimization is a game-changer for tech companies.
      </p>
    )
  },
  {
    name: 'Maria Rodriguez',
    role: 'SEO Director at Content Dynamics',
    img: '/example-data/people/lucia_bianchi.png',
    description: (
      <p>
        {APP_NAME}'s AI content generation has revolutionized our content
        production.{' '}
        <strong>We've seen a 65% increase in top 10 rankings!</strong> The
        intelligent keyword clustering features are unmatched.
      </p>
    )
  },
  {
    name: 'James Wilson',
    role: 'Head of Growth at Velocity SaaS',
    img: '/example-data/people/thomas_clark.png',
    description: (
      <p>
        As a startup, we needed SEO tools that could scale with us. {APP_NAME}{' '}
        delivers perfectly.{' '}
        <strong>
          Our search visibility has improved by 250% in the last quarter.
        </strong>{' '}
        Essential for any growing business.
      </p>
    )
  },
  {
    name: 'Sarah Kim',
    role: 'Digital Marketing Manager at Global E-commerce',
    img: '/example-data/people/mei_ling_chen.png',
    description: (
      <p>
        {APP_NAME}'s AI-powered technical SEO audits have identified critical
        issues we missed.{' '}
        <strong>
          Page load speed improvements increased conversions by 40%.
        </strong>{' '}
        Perfect for international e-commerce sites.
      </p>
    )
  },
  {
    name: 'Marcus Johnson',
    role: 'Content Strategy Lead at Media Pulse',
    img: '/example-data/people/mateo_jensen.png',
    description: (
      <p>
        {APP_NAME}'s AI analytics dashboard gives us unprecedented insights
        into search performance.{' '}
        <strong>
          Our content ROI has increased by 55% using their predictive ranking
          analysis.
        </strong>{' '}
        Transformative for content teams.
      </p>
    )
  },
  {
    name: 'Priya Sharma',
    role: 'Chief Marketing Officer at Scale Systems',
    img: '/example-data/people/kathleen_graves.png',
    description: (
      <p>
        {APP_NAME}'s integration with our CMS and analytics tools has
        streamlined our entire SEO workflow.{' '}
        <strong>
          Time spent on SEO tasks has been reduced by 60%.
        </strong>{' '}
        The automation features are exceptional.
      </p>
    )
  },
  {
    name: 'Miguel Santos',
    role: 'SEO Manager at Grow Agency',
    img: '/example-data/people/philip_grant.png',
    description: (
      <p>
        {APP_NAME}'s AI backlink analysis has helped us build quality links
        systematically.{' '}
        <strong>
          Domain authority increased by 25 points in 8 months.
        </strong>{' '}
        Leading the way in modern SEO practices.
      </p>
    )
  },
  {
    name: 'Lisa Thompson',
    role: 'Search Marketing Director at Quantum Brands',
    img: '/example-data/people/victoria_ballard.png',
    description: (
      <p>
        {APP_NAME}'s AI content optimization tools have transformed our
        on-page SEO.{' '}
        <strong>
          Average keyword rankings improved from 45 to 12 in 4 months.
        </strong>{' '}
        Revolutionizing how we approach content SEO.
      </p>
    )
  },
  {
    name: 'Daniel Park',
    role: 'Technical SEO Lead at HealthTech Solutions',
    img: '/example-data/people/gabriel_fischer.png',
    description: (
      <p>
        {APP_NAME}'s AI-powered site audits make it perfect for healthcare
        websites.{' '}
        <strong>
          Core Web Vitals scores improved by 35% across all pages.
        </strong>{' '}
        A milestone in technical SEO automation.
      </p>
    )
  },
  {
    name: 'Emma Anderson',
    role: 'Marketing Director at Education Partners',
    img: '/example-data/people/sofia_muller.png',
    description: (
      <p>
        {APP_NAME}'s AI content suggestions have doubled our content
        performance.{' '}
        <strong>
          Educational content now ranks in top 3 for target keywords.
        </strong>{' '}
        Transforming how we create SEO-optimized content.
      </p>
    )
  },
  {
    name: 'Robert Chen',
    role: 'SEO Strategist at Catalyst Digital',
    img: '/example-data/people/ishaan_richardson.png',
    description: (
      <p>
        {APP_NAME}'s enterprise-grade AI features give us complete confidence
        in our SEO strategy.{' '}
        <strong>The most intelligent SEO platform we've ever used.</strong>{' '}
        Setting new standards in AI-powered SEO.
      </p>
    )
  },
  {
    name: 'Maya Patel',
    role: 'Content Marketing Director at Creative Agency',
    img: '/example-data/people/olivia_weber.png',
    description: (
      <p>
        {APP_NAME}'s AI content briefs have streamlined our creative workflow.{' '}
        <strong>
          Content creation time reduced by 50% while maintaining quality.
        </strong>{' '}
        Perfect for creative agencies managing multiple clients.
      </p>
    )
  },
  {
    name: "Thomas O'Brien",
    role: 'Growth Marketing Manager at Startup Labs',
    img: '/example-data/people/beatrice_richter.png',
    description: (
      <p>
        {APP_NAME}'s startup-friendly pricing and AI capabilities made it an
        easy choice.{' '}
        <strong>
          The perfect SEO solution that scales with your business.
        </strong>{' '}
        Essential for modern startups competing in search.
      </p>
    )
  }
];

export function Testimonials(): React.JSX.Element {
  return (
    <GridSection hideVerticalGridLines>
      <div className="container border-x py-20 md:border-none">
        <h2 className="mb-8 text-center text-3xl font-semibold md:text-5xl lg:text-left">
          What people say
        </h2>
        <div className="relative mt-6 max-h-[640px] overflow-hidden">
          <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
            {Array(Math.ceil(DATA.length / 3))
              .fill(0)
              .map((_, i) => (
                <Marquee
                  vertical
                  key={i}
                  className={cn({
                    '[--duration:60s]': i === 1,
                    '[--duration:30s]': i === 2,
                    '[--duration:70s]': i === 3
                  })}
                >
                  {DATA.slice(i * 3, (i + 1) * 3).map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: Math.random() * 0.4,
                        duration: 1
                      }}
                      className="mb-4 flex w-full break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl border bg-background p-4 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
                    >
                      <div className="select-none text-sm font-normal text-muted-foreground">
                        {testimonial.description}
                        <div className="flex flex-row py-1">
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                          <Star className="size-4 fill-yellow-500 text-yellow-500" />
                        </div>
                      </div>
                      <div className="flex w-full select-none items-center justify-start gap-5">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.img || ''}
                          alt={testimonial.name}
                          className="size-8 rounded-full ring-1 ring-border ring-offset-4"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {testimonial.name}
                          </p>
                          <p className="text-xs font-normal text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Marquee>
              ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-linear-to-t from-background from-20%" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-linear-to-b from-background from-20%" />
        </div>
      </div>
    </GridSection>
  );
}
