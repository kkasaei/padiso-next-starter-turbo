'use client';

import * as React from 'react';



export default function AuthLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {

  return (
    <main className="h-screen dark:bg-background bg-gray-50 px-4">
      <div className="mx-auto w-full min-w-[320px] space-y-6 py-12 max-w-sm">
        {children}
      </div>
    </main>
  );
}
