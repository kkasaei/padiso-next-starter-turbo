import { init } from '@sentry/nextjs';

import { env } from '@/env';

type Parameters<T extends (args: never) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

export function initializeSentryServerClient(
  props: Parameters<typeof init>[0] = {}
) {
  return init({
    dsn: env.NEXT_PUBLIC_MONITORING_SENTRY_DSN,
    tracesSampleRate: props?.tracesSampleRate ?? 1.0,
    ...props
  });
}
