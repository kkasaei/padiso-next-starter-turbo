# @workspace/analytics

Shared analytics utilities for tracking and monitoring across all apps.

## Features

- PostHog integration
- User identification
- Pageview tracking
- Event tracking

## Usage

```tsx
import { PostHogProvider, PostHogIdentifier } from '@workspace/analytics/posthog';

function App() {
  return (
    <PostHogProvider>
      <PostHogIdentifier />
      {/* Your app */}
    </PostHogProvider>
  );
}
```
