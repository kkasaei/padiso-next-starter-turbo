import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Listening | SearchFIT',
  description: 'Monitor brand mentions across social platforms and communities. Track conversations about your brand on Reddit, Twitter, LinkedIn, and more.',
};

export default function SocialListeningPage() {
  return (
    <main className="container py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center mb-6">
        Social Listening
      </h1>
      <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
        Monitor brand mentions across Reddit, Twitter, LinkedIn, and other platforms. Stay ahead of conversations and engage at the right time.
      </p>
    </main>
  );
}
