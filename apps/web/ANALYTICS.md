# Analytics Setup Guide

This project uses **PostHog** for comprehensive product analytics, feature flags, and session recording.

## Setup Instructions

### 1. Get Your PostHog API Key

1. Sign up for PostHog at [https://posthog.com](https://posthog.com) (Free tier available)
2. Create a new project or use an existing one
3. Navigate to **Project Settings** → **Project API Key**
4. Copy your Project API Key

### 2. Configure Environment Variables

Add your PostHog credentials to `.env`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

> **Note:** Replace `your_posthog_project_api_key` with your actual key from PostHog

### 3. Features Enabled

✅ **Automatic Page View Tracking** - Tracks all page navigations  
✅ **User Identification** - Automatically identifies users via Clerk authentication  
✅ **Custom Event Tracking** - Track custom events anywhere in your app  
✅ **Feature Flags** - Control feature rollouts  
✅ **Session Recording** - Watch user sessions (configure in PostHog dashboard)

## Usage Examples

### Tracking Custom Events

```tsx
import { trackEvent } from '@/lib/analytics'

// In your component or action
function handleButtonClick() {
  trackEvent('button_clicked', {
    button_name: 'Get Started',
    page: 'homepage'
  })
}

// Track search queries
function handleSearch(query: string) {
  trackEvent('search_performed', {
    query,
    timestamp: new Date().toISOString()
  })
}
```

### Using PostHog Hook (Client Components)

```tsx
'use client'
import { usePostHog } from 'posthog-js/react'

export function MyComponent() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('custom_event', {
      property: 'value'
    })
  }

  return <button onClick={handleClick}>Track Event</button>
}
```

### Feature Flags

```tsx
import { isFeatureEnabled } from '@/lib/analytics'

function MyComponent() {
  const showNewFeature = isFeatureEnabled('new_feature_flag')

  return (
    <div>
      {showNewFeature && <NewFeature />}
    </div>
  )
}
```

### User Properties

```tsx
import { setUserProperties } from '@/lib/analytics'

// Set additional user properties
setUserProperties({
  plan: 'premium',
  company: 'Acme Inc',
  role: 'admin'
})
```

## Common Events to Track

Here are some common events you might want to track:

```tsx
// User Registration
trackEvent('user_registered', {
  method: 'email',
  plan: 'free'
})

// Form Submissions
trackEvent('form_submitted', {
  form_name: 'contact',
  success: true
})

// Feature Usage
trackEvent('feature_used', {
  feature_name: 'export_pdf',
  usage_count: 5
})

// Errors
trackEvent('error_occurred', {
  error_type: 'api_error',
  endpoint: '/api/users',
  message: error.message
})
```

## PostHog Dashboard Features

Once configured, you can access these features in your PostHog dashboard:

- 📊 **Insights** - Create custom analytics charts
- 🎬 **Session Recordings** - Watch user sessions
- 🚩 **Feature Flags** - Control feature rollouts
- 🧪 **A/B Testing** - Run experiments
- 📈 **Funnels** - Analyze conversion funnels
- 👥 **Cohorts** - Segment users

## Additional Analytics Options

This project also includes:
- **Vercel Analytics** - Already configured for basic web vitals

### Optional: Add Google Analytics

```bash
pnpm add @next/third-parties
```

Then in `layout.tsx`:
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

### Optional: Add Hotjar

Add this script to `layout.tsx`:
```tsx
<Script id="hotjar">
  {`
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `}
</Script>
```

## Privacy & GDPR Compliance

To ensure GDPR compliance:

1. Add a cookie consent banner
2. Configure PostHog to respect user consent:

```tsx
// In posthog-provider.tsx, add to init:
posthog.init(apiKey, {
  // ... other options
  persistence: 'localStorage+cookie', // or 'localStorage' for no cookies
  opt_out_capturing_by_default: true, // Require opt-in
})

// Then when user consents:
posthog.opt_in_capturing()
```

## Troubleshooting

### Events not showing up?
1. Check that `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Verify the key starts with `phc_`
3. Check browser console for PostHog errors
4. Make sure you're not running an ad blocker that blocks PostHog

### Need help?
- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Community](https://posthog.com/questions)
