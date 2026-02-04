'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';
import { Button } from './button';

export type ThemeToggleElement = React.ComponentRef<typeof Button>;
export type ThemeToggleProps = React.ComponentPropsWithoutRef<typeof Button> &
  Omit<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'onClick'>;

function ThemeToggle({
  className,
  ...props
}: ThemeToggleProps): React.JSX.Element {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleTheme = (): void => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  // Show a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn('bg-background relative', className)}
        disabled
        {...props}
      >
        <SunIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleTheme}
      className={cn('bg-background relative', className)}
      {...props}
    >
      <SunIcon
        className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <MoonIcon
        className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
export { ThemeToggle };
