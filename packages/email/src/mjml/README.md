# MJML Email Templates

This directory contains MJML-based email templates for SearchFit. MJML is a responsive email framework that makes it easy to create beautiful, mobile-friendly emails.

## 📁 Structure

```
mjml/
├── README.md              # This file
├── render-mjml.ts         # MJML to HTML renderer utility
├── templates/             # MJML email templates
│   └── report-link-email.ts
└── previews/              # Development preview pages (optional)
```

## 🚀 Usage

### Sending an Email

```typescript
import { sendReportLinkEmail } from '@/lib/emails/send-report-link-email';

await sendReportLinkEmail({
  recipient: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  domain: 'example.com',
  reportUrl: 'https://searchfit.ai/report/example.com',
  appName: 'SearchFit',
});
```

### Creating a New Template

1. **Create the template file** in `templates/`:

```typescript
// templates/welcome-email.ts
export interface WelcomeEmailProps {
  firstName: string;
  ctaUrl: string;
}

export function generateWelcomeEmail(props: WelcomeEmailProps): string {
  return `
    <mjml>
      <mj-head>
        <mj-title>Welcome to SearchFit</mj-title>
        <mj-preview>Get started with your AEO journey</mj-preview>
      </mj-head>
      <mj-body background-color="#f4f4f4">
        <mj-section background-color="#ffffff">
          <mj-column>
            <mj-text>Hi ${props.firstName},</mj-text>
            <mj-text>Welcome to SearchFit!</mj-text>
            <mj-button href="${props.ctaUrl}">Get Started</mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;
}
```

2. **Create the sender function**:

```typescript
// send-welcome-email.ts
import { EmailProvider } from './provider';
import { renderMJML } from './mjml/render-mjml';
import { generateWelcomeEmail, type WelcomeEmailProps } from './mjml/templates/welcome-email';

export async function sendWelcomeEmail(
  input: WelcomeEmailProps & { recipient: string }
): Promise<void> {
  const mjmlTemplate = generateWelcomeEmail(input);
  const { html, text } = renderMJML(mjmlTemplate);

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Welcome to SearchFit! 🚀',
    html,
    text,
  });
}
```

## 📧 Available Templates

### 1. Report Link Email
**File**: `templates/report-link-email.ts`  
**Purpose**: Send report access link to users who unlock reports  
**Usage**: Automatically sent when a user provides their email to unlock a report

**Props**:
- `firstName` - User's first name
- `lastName` - User's last name
- `domain` - The domain being analyzed
- `reportUrl` - Full URL to the report
- `appName` - Application name (e.g., "SearchFit")

## 🎨 MJML Components Reference

### Common Components

#### Text
```xml
<mj-text font-size="16px" color="#333333">
  Your text here
</mj-text>
```

#### Button
```xml
<mj-button background-color="#2563eb" color="#ffffff" href="https://example.com">
  Click Me
</mj-button>
```

#### Image
```xml
<mj-image src="https://example.com/logo.png" alt="Logo" width="200px" />
```

#### Divider
```xml
<mj-divider border-color="#e5e5e5" border-width="1px" />
```

### Layout Components

#### Section (Row)
```xml
<mj-section background-color="#ffffff" padding="20px">
  <!-- Columns go here -->
</mj-section>
```

#### Column
```xml
<mj-column width="50%">
  <!-- Content goes here -->
</mj-column>
```

## 🧪 Testing Emails

### Local Development Testing

Create a test file to preview emails:

```typescript
// scripts/preview-email.ts
import { generateReportLinkEmail } from '@/lib/emails/mjml/templates/report-link-email';
import { renderMJML } from '@/lib/emails/mjml/render-mjml';
import * as fs from 'fs';

const mjml = generateReportLinkEmail({
  firstName: 'John',
  lastName: 'Doe',
  domain: 'example.com',
  reportUrl: 'https://searchfit.ai/report/example.com',
  appName: 'SearchFit',
});

const { html } = renderMJML(mjml);
fs.writeFileSync('preview-email.html', html);
console.log('Preview saved to preview-email.html');
```

Run: `tsx scripts/preview-email.ts`

### Testing with Real Emails

Use a service like [Mailtrap](https://mailtrap.io/) or [MailHog](https://github.com/mailhog/MailHog) for development testing.

## 🎯 Best Practices

### 1. Mobile-First Design
- Use responsive breakpoints
- Test on multiple email clients
- Keep content width between 600-800px

### 2. Clear CTAs
- One primary CTA per email
- Use contrasting button colors
- Make buttons at least 44x44px for touch targets

### 3. Plain Text Alternative
- Always provide plain text version
- Keep it readable without HTML formatting
- Include all important links

### 4. Email Client Compatibility
- Test on Gmail, Outlook, Apple Mail
- Use web-safe fonts
- Inline CSS is handled automatically by MJML

### 5. Accessibility
- Use semantic HTML
- Include alt text for images
- Ensure good color contrast (4.5:1 minimum)

## 🔧 Customization

### Global Styles

Set default styles in `<mj-head>`:

```xml
<mj-head>
  <mj-attributes>
    <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" />
    <mj-text font-size="14px" color="#333333" line-height="24px" />
    <mj-button background-color="#2563eb" color="#ffffff" />
  </mj-attributes>
</mj-head>
```

### Brand Colors

```typescript
const BRAND_COLORS = {
  primary: '#2563eb',
  secondary: '#1e40af',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#1a1a1a',
  textMuted: '#666666',
  background: '#f4f4f4',
};
```

## 📚 Resources

- [MJML Documentation](https://documentation.mjml.io/)
- [MJML Playground](https://mjml.io/try-it-live)
- [Email Client CSS Support](https://www.caniemail.com/)
- [Really Good Emails](https://reallygoodemails.com/) - Inspiration

## 🐛 Troubleshooting

### MJML Rendering Errors

If you see MJML errors in console:
1. Check your MJML syntax
2. Validate using [MJML Validator](https://mjml.io/try-it-live)
3. Ensure all tags are properly closed

### Email Not Sending

1. Check Resend API key is configured: `EMAIL_RESEND_API_KEY`
2. Verify `EMAIL_FROM` is set in environment (should use `mail.searchfit.ai` domain)
   - **Required**: `EMAIL_FROM="SearchFit.ai <noreply@mail.searchfit.ai>"`
   - This shows "SearchFit.ai" as the sender name in inboxes
3. Ensure the domain `mail.searchfit.ai` is verified in Resend
4. (Optional) Set `EMAIL_REPLY_TO` if you want a different reply-to address
5. Check logs for detailed error messages (look for 📧 and ✅/❌ emojis)

### Styling Issues

1. Remember email CSS is limited
2. Use inline styles (MJML handles this)
3. Test on multiple email clients
4. Avoid complex CSS like flexbox, grid

## 🔐 Security

- Never include sensitive data in email URLs
- Use secure HTTPS URLs only
- Implement unsubscribe links
- Follow CAN-SPAM and GDPR guidelines

## 📊 Monitoring

Track email metrics:
- Open rates
- Click-through rates
- Bounce rates
- Unsubscribe rates

Use Resend's built-in analytics or integrate with PostHog for tracking.

