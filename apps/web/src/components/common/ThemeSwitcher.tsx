'use client';

import * as React from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';

export function ThemeSwitcher(): React.JSX.Element {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeValue = theme || 'system';

  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTheme(e.target.value);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex w-fit rounded-full border bg-background p-0.5">
        {[
          { value: 'system', icon: MonitorIcon, label: 'System' },
          { value: 'light', icon: SunIcon, label: 'Light' },
          { value: 'dark', icon: MoonIcon, label: 'Dark' },
        ].map(({ value, icon: Icon, label }) => (
          <span key={value} className="h-full">
            <input
              className="peer sr-only"
              type="radio"
              id={`footer-theme-switch-${value}`}
              value={value}
              disabled
            />
            <label
              htmlFor={`footer-theme-switch-${value}`}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground"
              aria-label={`${label} theme`}
            >
              <Icon className="size-4 shrink-0" />
            </label>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-fit rounded-full border bg-background p-0.5">
      {[
        { value: 'system', icon: MonitorIcon, label: 'System' },
        { value: 'light', icon: SunIcon, label: 'Light' },
        { value: 'dark', icon: MoonIcon, label: 'Dark' },
      ].map(({ value, icon: Icon, label }) => (
        <span key={value} className="h-full">
          <input
            className="peer sr-only"
            type="radio"
            id={`footer-theme-switch-${value}`}
            value={value}
            checked={themeValue === value}
            onChange={handleChangeTheme}
          />
          <label
            htmlFor={`footer-theme-switch-${value}`}
            className="flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground peer-checked:bg-accent peer-checked:text-foreground"
            aria-label={`${label} theme`}
          >
            <Tooltip delayDuration={600}>
              <TooltipTrigger asChild>
                <Icon className="size-4 shrink-0" />
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          </label>
        </span>
      ))}
    </div>
  );
}
