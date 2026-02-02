import * as React from 'react';
import { AlertCircleIcon, BookIcon, ScaleIcon } from 'lucide-react';

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

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { SiteHeading } from '@workspace/ui/components/fragments/SiteHeading';

const DATA_CARDS = [
  {
    title: 'Our Commitment',
    icon: <BookIcon className="size-4 shrink-0" />,
    content:
      'SearchFit is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our AI-powered AEO platform.'
  },
  {
    title: 'AI Processing Notice',
    icon: <AlertCircleIcon className="size-4 shrink-0" />,
    content:
      'We use AI to analyze your data and generate insights. AI processing may produce errors or inaccuracies. We do not guarantee the accuracy of AI-generated results. Use at your own risk.'
  },
  {
    title: 'Your Control',
    icon: <ScaleIcon className="size-4 shrink-0" />,
    content:
      'You have rights regarding your personal data, including access, correction, deletion, and data portability. You can manage your privacy settings in your account dashboard.'
  }
];

const DATA_ACCORDION = [
  {
    title: '1. Information We Collect',
    content:
      'We collect several types of information: (a) Account Information: Name, email address, company name, phone number, billing information, and authentication credentials provided during registration; (b) Project Data: Website URLs, keywords, competitor information, search queries, and business data you submit to analyze; (c) Usage Data: IP addresses, browser type, device information, pages visited, features used, time spent, click patterns, and interaction data; (d) Analytics Data: Search engine rankings, visibility scores, competitor analysis, AI-generated insights, and performance metrics; (e) Communication Data: Support tickets, feedback, survey responses, and email correspondence; (f) Payment Information: Credit card details and billing addresses processed securely through our payment provider (Stripe); (g) Cookies and Tracking Data: Session information, preferences, authentication tokens, and behavioral data collected via cookies and similar technologies.'
  },
  {
    title: '2. How We Use Your Information',
    content:
      'We use collected information to: (a) Provide and operate the SearchFit Service, including AI-powered analysis and reporting; (b) Process your transactions and manage subscriptions; (c) Generate personalized insights, recommendations, and competitive intelligence using AI and machine learning; (d) Communicate with you about your account, updates, features, and support; (e) Send marketing communications (with your consent, where required); (f) Improve and optimize our Service, develop new features, and train AI models; (g) Detect, prevent, and address technical issues, fraud, and security threats; (h) Comply with legal obligations and enforce our Terms of Use; (i) Conduct research and analytics to understand user behavior and improve AI accuracy; (j) Provide customer support and respond to inquiries.'
  },
  {
    title: '3. AI and Machine Learning Processing',
    content:
      'IMPORTANT: SearchFit uses artificial intelligence and machine learning to process your data and generate insights. AI processing involves: (a) Analyzing your website content, keywords, and competitor data; (b) Training and improving our AI models using aggregated and anonymized data; (c) Generating reports, recommendations, and predictions that may contain errors or inaccuracies. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF AI-GENERATED INSIGHTS. AI can make mistakes, produce hallucinations, and generate incorrect information. You acknowledge that: (i) AI outputs are probabilistic and may be wrong; (ii) You use AI-generated insights at your own risk; (iii) You should independently verify all AI recommendations before acting on them; (iv) SearchFit is not liable for decisions made based on AI-generated content. We may use third-party AI providers (e.g., OpenAI, Anthropic) to process your data, subject to their privacy policies and data processing agreements.'
  },
  {
    title: '4. Data Sharing and Third-Party Services',
    content:
      'We share your information with: (a) Service Providers: Stripe (payment processing), Clerk (authentication), Resend (email delivery), Cloudflare (infrastructure and security), MongoDB (database), ClickHouse (analytics), Trigger.dev (task automation), and AI providers for processing; (b) Analytics Services: Google Analytics, PostHog, Umami, and Hotjar to understand usage patterns and improve our Service; (c) Communication Tools: Slack for internal notifications and monitoring (no personal data shared publicly); (d) Legal Requirements: When required by law, court order, or government request; (e) Business Transfers: In connection with mergers, acquisitions, or sale of assets; (f) Aggregated Data: We may share anonymized, aggregated data that cannot identify you for research, marketing, or industry analysis. We do NOT sell your personal information to third parties for their marketing purposes.'
  },
  {
    title: '5. Data Security',
    content:
      'We implement reasonable technical and organizational measures to protect your data, including: (a) Encryption of data in transit (TLS/SSL) and at rest; (b) Secure authentication via Clerk with multi-factor authentication support; (c) Regular security audits and vulnerability assessments; (d) Access controls and role-based permissions; (e) Secure cloud infrastructure (Vercel, MongoDB Atlas, Cloudflare R2); (f) Rate limiting and DDoS protection; (g) Automated backup systems. However, no system is 100% secure. We cannot guarantee absolute security of your data. You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access to your account.'
  },
  {
    title: '6. Data Retention',
    content:
      'We retain your data for as long as necessary to provide the Service and comply with legal obligations: (a) Account Data: Retained while your account is active and for up to 90 days after account deletion for backup and recovery purposes; (b) Project Data: Retained while your account is active; deleted within 30 days of account deletion; (c) Usage Analytics: Retained for up to 2 years for analysis and improvement; (d) Financial Records: Retained for up to 7 years as required by tax and accounting laws; (e) Support Communications: Retained for up to 3 years for quality assurance and legal compliance. You can request early deletion of your data by contacting support@searchfit.ai, subject to legal retention requirements.'
  },
  {
    title: '7. Your Privacy Rights',
    content:
      'Depending on your jurisdiction, you may have the following rights: (a) Access: Request a copy of your personal data; (b) Correction: Update or correct inaccurate information; (c) Deletion: Request deletion of your personal data (right to be forgotten); (d) Portability: Receive your data in a machine-readable format; (e) Restriction: Limit how we process your data; (f) Objection: Object to processing based on legitimate interests; (g) Withdraw Consent: Withdraw consent for marketing communications at any time; (h) Opt-Out: Disable cookies and tracking technologies in your browser; (i) GDPR Rights (EU/EEA): If you are in the European Union or European Economic Area, you have additional rights under the General Data Protection Regulation; (j) CCPA Rights (California): If you are a California resident, you have rights under the California Consumer Privacy Act. To exercise your rights, contact us at support@searchfit.ai. We will respond within 30 days (or as required by applicable law).'
  },
  {
    title: '8. Cookies and Tracking Technologies',
    content:
      'We use cookies, web beacons, and similar technologies to: (a) Maintain your session and keep you logged in; (b) Remember your preferences and settings; (c) Analyze usage patterns and improve the Service; (d) Track conversions and marketing effectiveness; (e) Provide personalized content and recommendations. Cookie Types: Essential Cookies (required for Service operation), Performance Cookies (analytics and optimization), Functional Cookies (preferences and settings), Marketing Cookies (advertising and remarketing). Third-party services that use cookies: Google Analytics, PostHog, Umami, Hotjar, Clerk. You can control cookies through your browser settings. Disabling cookies may limit Service functionality. See our Cookie Policy for detailed information.'
  },
  {
    title: '9. International Data Transfers',
    content:
      'SearchFit operates globally from Sydney, Australia, and your data may be transferred to and processed in Australia, the United States, and other countries where our service providers operate. These countries may have different data protection laws than your country of residence. We ensure appropriate safeguards are in place for international transfers, including: (a) Standard Contractual Clauses approved by the European Commission; (b) Data Processing Agreements with third-party processors; (c) Compliance with applicable data transfer regulations including the Australian Privacy Act 1988. By using our Service, you consent to the transfer of your data to countries outside your residence.'
  },
  {
    title: '10. Children\'s Privacy',
    content:
      'SearchFit is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at support@searchfit.ai, and we will promptly delete such information from our systems.'
  },
  {
    title: '11. California Privacy Rights (CCPA)',
    content:
      'If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA): (a) Right to Know: What personal information we collect, use, disclose, and sell; (b) Right to Delete: Request deletion of your personal information; (c) Right to Opt-Out: We do NOT sell personal information; (d) Right to Non-Discrimination: We will not discriminate against you for exercising your CCPA rights. To exercise these rights, email support@searchfit.ai with the subject "CCPA Request." We will verify your identity before processing your request.'
  },
  {
    title: '12. European Privacy Rights (GDPR) and Australian Privacy',
    content:
      'If you are in the European Union or European Economic Area, you have rights under the General Data Protection Regulation (GDPR): (a) Legal Basis for Processing: We process your data based on contract performance, consent, legitimate interests, and legal obligations; (b) Data Controller: SearchFit (Sydney, Australia) is the data controller; (c) Data Protection Officer: Contact dpo@searchfit.ai for privacy inquiries; (d) Right to Lodge Complaint: You can file a complaint with your local data protection authority if you believe we have violated GDPR. We comply with GDPR principles of lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality. For Australian residents, we comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth). You can contact the Office of the Australian Information Commissioner (OAIC) for privacy complaints.'
  },
  {
    title: '13. Changes to This Privacy Policy',
    content:
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. Changes will be effective immediately upon posting to searchfit.ai/privacy-policy. Material changes will be communicated via: (a) Email notification to registered users; (b) Prominent notice on the Service; (c) In-app notification. Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy. We encourage you to review this policy periodically. Last Updated: December 22, 2025.'
  },
  {
    title: '14. Contact Us',
    content:
      'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: Email: support@searchfit.ai | Data Protection Officer: dpo@searchfit.ai | Address: SearchFit, Sydney, New South Wales, Australia. We will respond to your inquiry within 30 days (or as required by applicable law).'
  }
];

export function PrivacyPolicy(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-16 py-20">
        <SiteHeading
          badge="Legal"
          title="Privacy Policy"
          description="This Privacy Policy explains how SearchFit collects, uses, protects, and shares your personal information. By using our Service, you agree to the practices described in this policy. Last updated: December 22, 2025."
        />
        <Alert variant="default">
          <AlertDescription className="ml-3 text-base inline">
            We are committed to protecting your privacy and being transparent about our data practices. This policy complies with GDPR, CCPA, and other applicable privacy laws.
          </AlertDescription>
        </Alert>

        <Alert variant="default">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription className="ml-3 text-base">
            <strong>AI PROCESSING DISCLAIMER:</strong> SearchFit uses artificial intelligence to process your data and generate insights. AI can make mistakes and produce inaccurate results. We do NOT guarantee the accuracy or reliability of AI-generated content. You use AI features at your own risk.
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
