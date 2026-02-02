'use client';

import * as React from 'react';
import { Toolbar } from './toolbar';
import { cn } from '@workspace/common/lib';

export function FixedToolbar({
  className,
  ...props
}: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      className={cn(
        'sticky top-0 z-50 w-full max-w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'flex flex-wrap items-center gap-1 p-2 overflow-x-auto',
        className
      )}
      {...props}
    />
  );
}

