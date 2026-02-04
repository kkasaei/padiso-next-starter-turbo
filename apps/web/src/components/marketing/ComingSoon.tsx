import * as React from 'react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps): React.JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-center text-lg text-muted-foreground">
          {description}
        </p>
      )}
      <p className="mt-8 text-xl font-medium text-primary">Coming Soon</p>
    </div>
  );
}
