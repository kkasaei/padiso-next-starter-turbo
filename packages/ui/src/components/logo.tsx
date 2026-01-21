'use client';

import * as React from 'react';

import { APP_NAME } from '@/lib/common/app';
import { cn } from '@/lib/utils';

export type LogoElement = React.ComponentRef<'div'>;
export type LogoProps = React.ComponentPropsWithoutRef<'div'> & {
  hideSymbol?: boolean;
  hideWordmark?: boolean;
};
export function Logo({
  hideSymbol,
  hideWordmark,
  className,
  ...other
}: LogoProps): React.JSX.Element {
  return (
    <div
      className={cn('flex items-center space-x-2', className)}
      {...other}
    >
      {!hideSymbol && (
        <div className="flex size-9 items-center justify-center p-1">
          <div className="flex size-7 items-center justify-center rounded-full border text-primary-foreground bg-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12.2324 4.34375C10.8984 4.34376 9.80873 4.57424 8.96387 5.03418C8.13396 5.47928 7.5193 6.08794 7.11914 6.85938C6.73387 7.63075 6.54107 8.48345 6.54102 9.41797C6.54102 10.4417 6.8597 11.2808 7.49707 11.9336C8.14924 12.5714 9.20878 13.024 10.6758 13.291L12.499 13.6465C12.9882 13.7207 13.3593 13.8845 13.6113 14.1367C13.8779 14.3888 14.0116 14.6854 14.0117 15.0264C14.0117 15.4862 13.8112 15.8501 13.4111 16.1172C13.0257 16.3843 12.4618 16.5176 11.7207 16.5176C11.1575 16.5175 10.5056 16.3766 9.76465 16.0947C9.02361 15.8129 8.23051 15.4128 7.38574 14.8936L6.0957 17.7646C6.98495 18.4322 7.87443 18.9142 8.76367 19.2109C9.6529 19.5076 10.6388 19.6562 11.7207 19.6562C13.7366 19.6562 15.2642 19.2105 16.3018 18.3203C17.3538 17.4153 17.8798 16.1693 17.8799 14.582C17.8799 13.5731 17.5536 12.6827 16.9014 11.9111C16.2492 11.1396 15.1967 10.6206 13.7441 10.3535L11.9209 9.99707C11.4319 9.92287 11.0539 9.78952 10.7871 9.59668C10.5351 9.4038 10.4092 9.13617 10.4092 8.79492C10.4092 8.37961 10.5581 8.0604 10.8545 7.83789C11.1658 7.60071 11.6622 7.48242 12.3438 7.48242C12.8329 7.48243 13.4035 7.60054 14.0557 7.83789C14.7078 8.07526 15.4045 8.39439 16.1455 8.79492L17.4355 5.92383C16.5314 5.30067 15.6488 4.88546 14.7891 4.67773C13.9295 4.45525 13.0772 4.34375 12.2324 4.34375Z" fill="currentColor" />
              </g>
            </svg>



          </div>
        </div>
      )}
      {!hideWordmark && <span className="font-bold">{APP_NAME}</span>}
    </div>
  );
}
