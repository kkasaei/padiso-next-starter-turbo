import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Audit | SearchFIT',
  description: 'Comprehensive SEO analysis and optimization recommendations. Find and fix technical issues that hurt your rankings.',
};

export default function TechnicalAuditPage() {
  return (
    <main className="container py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-6">
        Technical Audit
      </h1>
      <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
        Comprehensive technical SEO audits that find and prioritize the issues hurting your rankings. Get actionable fixes, not just reports.
      </p>
    </main>
  );
}
