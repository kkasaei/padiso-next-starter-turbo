import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backlinks | SearchFIT',
  description: 'Monitor and analyze your backlink profile. Track new and lost links, analyze competitors, and build a stronger link profile.',
};

export default function BacklinksPage() {
  return (
    <main className="container py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-6">
        Backlinks
      </h1>
      <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
        Monitor, analyze, and grow your backlink profile. Discover opportunities and protect your site from toxic links.
      </p>
    </main>
  );
}
