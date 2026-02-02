# @workspace/email

Email service package for sending transactional emails using React Email and MJML templates.

## Features

- 📧 **Multiple Email Providers**: Currently supports Resend (easy to swap)
- ⚛️ **React Email Templates**: Beautiful, responsive emails built with React
- 🎨 **MJML Support**: Advanced email layouts with MJML
- 🔒 **Type-Safe**: Full TypeScript support
- 🌍 **Environment Configuration**: Centralized environment variable management

## Installation

This package is part of the workspace monorepo. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Required environment variables (add to your `.env` file):

```bash
# Email Provider Configuration
EMAIL_FROM=noreply@searchfit.ai           # Sender email address
EMAIL_RESEND_API_KEY=re_xxx               # Resend API key (required)
EMAIL_REPLY_TO=support@searchfit.ai       # Optional reply-to address
```

## Usage

### Sending Emails

```typescript
import { sendWelcomeEmail, sendReportLinkEmail } from '@workspace/email';

// Send welcome email
await sendWelcomeEmail({
  recipient: 'user@example.com',
  appName: 'SearchFit',
  name: 'John Doe',
  getStartedLink: 'https://app.searchfit.ai/onboarding',
});

// Send report link email (MJML template)
await sendReportLinkEmail({
  recipient: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  domain: 'example.com',
  reportUrl: 'https://app.searchfit.ai/reports/123',
  appName: 'SearchFit',
  overallScore: 85,
  chatGptScore: 90,
  perplexityScore: 80,
  geminiScore: 85,
  reportGeneratedDate: 'February 2, 2026',
  waitlistUrl: 'https://searchfit.ai/waitlist',
});
```

### Available Email Functions

- `sendWelcomeEmail()` - Welcome new users
- `sendVerifyEmailAddressEmail()` - Email verification
- `sendPasswordResetEmail()` - Password reset instructions
- `sendFeedbackEmail()` - User feedback submissions
- `sendContactFormEmail()` - Contact form notifications
- `sendReportLinkEmail()` - Report delivery (MJML)
- `sendConfirmEmailAddressChangeEmail()` - Email change confirmation
- `sendConnectedAccountSecurityAlertEmail()` - Security alerts

### Using Templates Directly

```typescript
import { WelcomeEmail } from '@workspace/email';
import { render } from '@react-email/render';

const component = WelcomeEmail({
  appName: 'SearchFit',
  name: 'John Doe',
  getStartedLink: 'https://app.searchfit.ai',
});

const html = await render(component);
const text = await render(component, { plainText: true });
```

### Environment Validation

```typescript
import { validateEnv } from '@workspace/email';

// Validate environment variables on app startup
validateEnv();
```

## Email Templates

### React Email Templates

Located in `src/templates/`:
- `welcome-email.tsx`
- `verify-email-address-email.tsx`
- `password-reset-email.tsx`
- `feedback-email.tsx`
- `invitation-email.tsx`
- `revoked-invitation-email.tsx`
- `confirm-email-address-change-email.tsx`
- `connected-account-security-alert-email.tsx`

### MJML Templates

Located in `src/mjml/templates/`:
- `report-link-email.ts` - Complex report delivery email with scores and branding

## Development

### Preview Emails

Preview components are available in `src/templates/previews/` for development and testing.

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

## Architecture

```
src/
├── env.ts                      # Environment configuration
├── index.ts                    # Central exports
├── provider/                   # Email provider implementations
│   ├── resend/                # Resend provider
│   └── types.ts               # Provider interfaces
├── templates/                  # React Email templates
│   ├── previews/              # Preview components
│   └── *.tsx                  # Email templates
├── mjml/                      # MJML templates
│   ├── render-mjml.ts        # MJML renderer
│   └── templates/            # MJML email templates
└── send-*.ts                  # Email sending functions
```

## Switching Email Providers

The package supports multiple providers. To switch:

1. Update `src/provider/index.ts`:
```typescript
// export { default as EmailProvider } from './resend';
export { default as EmailProvider } from './sendgrid';
```

2. Update environment variables accordingly

## License

Private workspace package
