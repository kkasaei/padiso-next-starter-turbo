import * as React from 'react';
import { BookIcon, CookieIcon, ScaleIcon } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';

import { GridSection } from '@/components/shared/fragments/grid-section';
import { SiteHeading } from '@/components/shared/fragments/site-heading';

const DATA_CARDS = [
  {
    title: 'What are Cookies?',
    icon: <CookieIcon className="size-4 shrink-0" />,
    content:
      'Cookies are small text files placed on your device when you visit SearchFit. They help us recognize you, remember your preferences, maintain your session, and improve your experience.'
  },
  {
    title: 'Why We Use Cookies',
    icon: <BookIcon className="size-4 shrink-0" />,
    content:
      'We use cookies to keep you logged in, remember your settings, analyze usage patterns, optimize performance, and provide personalized features. Some cookies are essential for the Service to function.'
  },
  {
    title: 'Your Cookie Control',
    icon: <ScaleIcon className="size-4 shrink-0" />,
    content:
      'You can manage cookies through your browser settings or our cookie preferences. Disabling certain cookies may limit Service functionality, but essential cookies are required for operation.'
  }
];

const DATA_ACCORDION = [
  {
    title: '1. What are Cookies and Similar Technologies?',
    content:
      'Cookies are small text files stored on your device (computer, smartphone, tablet) when you visit a website. Similar technologies include: Web Beacons (small graphics that track page views), Local Storage (client-side data storage), Session Storage (temporary browser storage), Pixels (tracking images for analytics), and Fingerprinting (device identification techniques). These technologies help us recognize your device, remember your preferences, maintain your login session, and understand how you use SearchFit.'
  },
  {
    title: '2. Types of Cookies We Use',
    content:
      'We use four categories of cookies: (a) ESSENTIAL COOKIES (Required): Authentication cookies (Clerk session management), security cookies (CSRF protection, rate limiting), load balancing cookies, and cookie consent preferences. These are necessary for the Service to function and cannot be disabled. (b) PERFORMANCE COOKIES (Analytics): Google Analytics (usage statistics, traffic sources, page performance), PostHog (product analytics, feature usage), Umami (privacy-friendly analytics), Hotjar (heatmaps, session recordings, user behavior), ClickHouse (database performance metrics). These help us understand how users interact with SearchFit and identify areas for improvement. (c) FUNCTIONAL COOKIES (Preferences): Theme preferences (dark/light mode), language settings, dashboard layout preferences, notification settings, user interface customizations. These enhance your experience by remembering your choices. (d) MARKETING COOKIES (Advertising): Conversion tracking, remarketing pixels, campaign attribution, referral tracking. These help us measure marketing effectiveness and show relevant ads. You can opt-out of non-essential cookies through your browser settings or our cookie banner.'
  },
  {
    title: '3. First-Party vs. Third-Party Cookies',
    content:
      'First-Party Cookies are set by SearchFit (searchfit.ai domain) and used to operate the Service, maintain sessions, and remember preferences. Third-Party Cookies are set by external services we integrate with: Google Analytics (analytics), PostHog (product analytics), Hotjar (user research), Clerk (authentication), Stripe (payment processing), Vercel (hosting infrastructure), Cloudflare (CDN and security). Third-party cookies are governed by their respective privacy policies. We carefully select third-party services that comply with privacy regulations.'
  },
  {
    title: '4. Session Cookies vs. Persistent Cookies',
    content:
      'Session Cookies are temporary and deleted when you close your browser. Used for: authentication state, temporary preferences, shopping cart (if applicable), security tokens. Persistent Cookies remain on your device for a set period (from days to years) and are used for: "Remember Me" functionality, long-term preferences, analytics data, marketing attribution. You can view and delete persistent cookies through your browser settings at any time.'
  },
  {
    title: '5. Specific Cookies We Use',
    content:
      'Essential Cookies: __clerk_db_jwt (Clerk authentication, session duration), __session (session management, session duration), csrf-token (CSRF protection, session duration). Analytics Cookies: _ga (Google Analytics, 2 years), _gid (Google Analytics, 24 hours), ph_* (PostHog analytics, 1 year), umami.* (Umami analytics, session). Functional Cookies: theme (theme preference, 1 year), sidebar_state (UI preferences, 1 year). Marketing Cookies: _fbp (Facebook Pixel, 90 days), _gcl_au (Google Ads, 90 days). This list is representative and may change as we add or remove features. Check our cookie banner for the most current list.'
  },
  {
    title: '6. How to Manage and Delete Cookies',
    content:
      'You have several options to control cookies: (a) Cookie Banner: When you first visit SearchFit, you can accept or reject non-essential cookies through our cookie consent banner. (b) Browser Settings: All browsers allow you to view, manage, and delete cookies. Instructions: Chrome (Settings > Privacy and security > Cookies), Firefox (Settings > Privacy & Security > Cookies), Safari (Preferences > Privacy > Manage Website Data), Edge (Settings > Cookies and site permissions). (c) Opt-Out Tools: Google Analytics Opt-out: https://tools.google.com/dlpage/gaoptout, Network Advertising Initiative: https://optout.networkadvertising.org/, Digital Advertising Alliance: https://optout.aboutads.info/. (d) Browser Extensions: Privacy Badger, uBlock Origin, Ghostery (block tracking cookies). Note: Disabling essential cookies will prevent you from using SearchFit. Disabling functional cookies may degrade your experience.'
  },
  {
    title: '7. Do Not Track (DNT) Signals',
    content:
      'Some browsers offer "Do Not Track" (DNT) signals to indicate you do not want to be tracked. Currently, there is no universal standard for DNT, and SearchFit does not respond to DNT signals. However, you can opt out of tracking through: (a) Cookie settings in your browser; (b) Our cookie banner preferences; (c) Third-party opt-out tools listed above. We respect your privacy choices and provide clear options to manage tracking.'
  },
  {
    title: '8. Cookies and AI Processing',
    content:
      'Some cookies collect data that may be used to train and improve our AI models, including: usage patterns, feature interactions, report generation requests, search queries, and click behavior. All AI training uses aggregated and anonymized data that cannot identify you personally. IMPORTANT: AI-generated insights may be inaccurate. We do not guarantee the accuracy of AI outputs. You use AI features at your own risk. Cookies help us improve AI performance but do not affect the fundamental limitation that AI can make mistakes.'
  },
  {
    title: '9. Cookies for Logged-Out Users',
    content:
      'Even if you are not logged in to SearchFit, we may use cookies to: (a) Remember your cookie preferences; (b) Analyze public page traffic (marketing website, blog, documentation); (c) Track marketing campaigns and conversions; (d) Provide basic site functionality. Logged-out cookies do not access your account data or personal information. You can still delete these cookies through your browser settings.'
  },
  {
    title: '10. International Data Transfers via Cookies',
    content:
      'Cookies may transfer data to servers located outside Australia, including the United States and other jurisdictions where our service providers operate (e.g., Google servers worldwide, PostHog US servers, Cloudflare global network). These transfers are necessary to provide the Service and are protected by: Standard Contractual Clauses, Privacy Shield frameworks (where applicable), Data Processing Agreements with third parties, and compliance with the Australian Privacy Act 1988. By using SearchFit, you consent to international data transfers via cookies.'
  },
  {
    title: '11. Cookie Security',
    content:
      'We implement security measures to protect cookies from unauthorized access: (a) Secure flag (cookies transmitted only over HTTPS); (b) HttpOnly flag (cookies not accessible via JavaScript to prevent XSS attacks); (c) SameSite attribute (protection against CSRF attacks); (d) Encryption of sensitive cookie data; (e) Short expiration times for session cookies; (f) Regular security audits. Despite these measures, no system is 100% secure. Protect your account by using strong passwords and not sharing your device with untrusted parties.'
  },
  {
    title: '12. Changes to This Cookie Policy',
    content:
      'We may update this Cookie Policy to reflect: (a) Changes in cookie usage; (b) New features or third-party integrations; (c) Regulatory requirements; (d) User feedback and privacy best practices. Changes will be effective immediately upon posting at searchfit.ai/cookie-policy. Material changes will be communicated via email or in-app notification. Your continued use after changes constitutes acceptance of the updated Cookie Policy. Last Updated: December 22, 2025.'
  },
  {
    title: '13. Contact Us About Cookies',
    content:
      'If you have questions about our use of cookies or this Cookie Policy, please contact us at: Email: support@searchfit.ai | Privacy Team: privacy@searchfit.ai | Address: SearchFit, Sydney, New South Wales, Australia. We will respond to your inquiry within 30 days. You can also exercise your privacy rights (access, deletion, opt-out) by contacting us at these addresses.'
  }
];

export function CookiePolicy(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-16 py-20">
        <SiteHeading
          badge="Legal"
          title="Cookie Policy"
          description="This Cookie Policy explains how SearchFit uses cookies and similar tracking technologies to operate our Service, analyze usage, and improve your experience. Last updated: December 22, 2025."
        />
        <Alert variant="default">
          <AlertDescription className="ml-3 text-base inline">
            We use cookies to provide essential functionality, analyze usage, and improve your experience. You can manage your cookie preferences through your browser settings or our cookie banner.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DATA_CARDS.map((item, index) => (
            <Card
              key={index}
              className="border-none dark:bg-accent/40"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.icon}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Accordion
          type="single"
          collapsible
        >
          {DATA_ACCORDION.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger className="flex items-center justify-between text-lg font-medium">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div>
          <CardTitle className="text-lg text-primary">
            Contact Information
          </CardTitle>
          <p className="text-sm leading-relaxed">
            For questions or concerns, contact us at:
            <br />
            <a
              href="mailto:support@searchfit.ai"
              className="text-blue-500 hover:underline"
            >
              support@searchfit.ai
            </a>
          </p>
        </div>
      </div>
    </GridSection>
  );
}
