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
    title: 'Acceptance of Terms',
    icon: <BookIcon className="size-4 shrink-0" />,
    content:
      'By accessing or using SearchFit, you agree to be bound by these Terms of Use and all applicable laws. If you do not agree, please discontinue use immediately.'
  },
  {
    title: 'AI-Powered Service Notice',
    icon: <AlertCircleIcon className="size-4 shrink-0" />,
    content:
      'SearchFit uses artificial intelligence that may produce errors or inaccuracies. We do NOT guarantee the accuracy, completeness, or reliability of AI-generated results. USE AT YOUR OWN RISK.'
  },
  {
    title: 'Account Registration',
    icon: <ScaleIcon className="size-4 shrink-0" />,
    content:
      'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.'
  }
];

const DATA_ACCORDION = [
  {
    title: '1. Definitions',
    content:
      '"Service" refers to the SearchFit platform, including all features, tools, and content. "User" or "You" refers to any individual or entity accessing the Service. "Content" includes all data, text, reports, and materials provided through the Service.'
  },
  {
    title: '2. Use of Service',
    content:
      'You may use SearchFit solely for lawful business purposes in accordance with these Terms. You agree not to: (a) violate any applicable laws or regulations; (b) infringe on intellectual property rights; (c) transmit harmful code or malware; (d) attempt unauthorized access to our systems; (e) interfere with Service operation; (f) use automated systems to scrape or extract data without permission; (g) resell or redistribute the Service without authorization.'
  },
  {
    title: '3. Subscription and Payment',
    content:
      'Access to certain features requires a paid subscription. Subscription fees are billed in advance on a monthly or annual basis. All payments are processed securely through our payment provider (Stripe). Fees are non-refundable except as required by law or as expressly stated in our refund policy. We reserve the right to change pricing with 30 days notice to active subscribers.'
  },
  {
    title: '4. User Accounts and Security',
    content:
      'You must provide accurate, complete, and current information during registration. You are responsible for safeguarding your password and account credentials. Notify us immediately of any unauthorized access or security breach. You may not share your account with others or allow multiple users to access a single-user subscription.'
  },
  {
    title: '5. Intellectual Property Rights',
    content:
      'All content, features, functionality, and materials on SearchFit, including but not limited to text, graphics, logos, software, and data compilations, are owned by SearchFit or its licensors and are protected by copyright, trademark, and other intellectual property laws. Your use of the Service does not grant you ownership of any intellectual property rights.'
  },
  {
    title: '6. User-Generated Content',
    content:
      'You retain ownership of any content you submit to SearchFit (e.g., project data, keywords, competitor URLs). By submitting content, you grant SearchFit a worldwide, non-exclusive, royalty-free license to use, store, process, and display your content solely to provide and improve the Service. You represent that you have all necessary rights to the content you submit and that it does not violate any third-party rights.'
  },
  {
    title: '7. AI-Generated Reports and Data - No Guarantees',
    content:
      'IMPORTANT: SearchFit uses artificial intelligence (AI) and machine learning to generate reports, insights, and recommendations. AI technology can and does make mistakes, produce hallucinations, generate inaccurate information, and provide incorrect analysis. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, RELIABILITY, OR CORRECTNESS OF ANY AI-GENERATED CONTENT. All reports, data, insights, and recommendations are provided "AS IS" for informational purposes only and should NOT be considered professional advice, financial guidance, or guaranteed results. You acknowledge and agree that: (a) AI outputs may contain errors, inaccuracies, or misleading information; (b) You use all AI-generated content at your own risk; (c) You are solely responsible for verifying all information before making any business decisions; (d) SearchFit is not liable for any decisions made based on AI-generated content; (e) Past performance and AI predictions do not guarantee future results. Always consult qualified professionals for important business decisions.'
  },
  {
    title: '8. Data Usage and Privacy',
    content:
      'We collect and process your data in accordance with our Privacy Policy. By using the Service, you consent to such collection and processing. We implement reasonable security measures to protect your data, but cannot guarantee absolute security. You are responsible for maintaining backups of your important data.'
  },
  {
    title: '9. Third-Party Services',
    content:
      'SearchFit integrates with third-party services (e.g., Google Analytics, authentication providers, payment processors). We are not responsible for third-party services or their privacy practices. Your use of third-party services is subject to their respective terms and policies.'
  },
  {
    title: '10. Service Availability and Modifications',
    content:
      'We strive to maintain Service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any feature or the entire Service at any time with or without notice. We may perform scheduled maintenance with advance notice when possible.'
  },
  {
    title: '11. Disclaimer of Warranties - Use at Your Own Risk',
    content:
      'THE SERVICE, INCLUDING ALL AI-GENERATED CONTENT, IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, OR COURSE OF PERFORMANCE. We do not warrant that: (a) The Service will be error-free, secure, or uninterrupted; (b) Defects will be corrected; (c) AI-generated content will be accurate, complete, or reliable; (d) The Service will meet your requirements or expectations; (e) Any results, rankings, or improvements will be achieved. YOU USE THE SERVICE ENTIRELY AT YOUR OWN RISK. We expressly disclaim all liability for errors, inaccuracies, or omissions in AI-generated content and reports.'
  },
  {
    title: '12. Limitation of Liability - No Guarantees on Results',
    content:
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEARCHFIT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO: LOST PROFITS, REVENUE LOSS, DATA LOSS, BUSINESS INTERRUPTION, LOST BUSINESS OPPORTUNITIES, INACCURATE AI PREDICTIONS, INCORRECT REPORTS, FAILED SEO STRATEGIES, RANKING LOSSES, OR ANY DAMAGES ARISING FROM RELIANCE ON AI-GENERATED CONTENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. We make no guarantees regarding search engine rankings, traffic improvements, revenue increases, or any specific business results. Our total liability for all claims shall not exceed the amount you paid for the Service in the 12 months preceding the claim, or $100, whichever is greater. Some jurisdictions do not allow exclusion of certain warranties or limitations of liability, so some limitations may not apply to you.'
  },
  {
    title: '13. Indemnification',
    content:
      'You agree to indemnify, defend, and hold harmless SearchFit, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising out of or related to: (a) your violation of these Terms; (b) your use of the Service; (c) your content; (d) your violation of any third-party rights.'
  },
  {
    title: '14. Termination',
    content:
      'You may cancel your account at any time through your account settings. We may suspend or terminate your access immediately, without notice, for: (a) violation of these Terms; (b) fraudulent or illegal activity; (c) non-payment; (d) abuse of the Service; (e) at our sole discretion for any reason. Upon termination, your right to use the Service ceases immediately, but provisions regarding intellectual property, disclaimers, and limitations of liability survive.'
  },
  {
    title: '15. Governing Law and Jurisdiction',
    content:
      'These Terms are governed by and construed in accordance with the laws of New South Wales, Australia, without regard to conflict of law principles. Any disputes shall be resolved in the courts located in Sydney, New South Wales, Australia, and you consent to personal jurisdiction in these courts.'
  },
  {
    title: '16. Dispute Resolution',
    content:
      'For any dispute or claim arising out of these Terms or the Service, you agree to first contact us at support@searchfit.ai to attempt to resolve the dispute informally. If unresolved within 30 days, either party may pursue binding arbitration in accordance with Australian arbitration rules, with proceedings conducted in Sydney, Australia.'
  },
  {
    title: '17. Changes to Terms',
    content:
      'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Service. Your continued use after changes constitutes acceptance of the modified Terms. Material changes will be communicated via email or Service notification.'
  },
  {
    title: '18. Severability',
    content:
      'If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect. The invalid provision will be modified to reflect the parties\' intent as closely as possible.'
  },
  {
    title: '19. Entire Agreement',
    content:
      'These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and SearchFit regarding the Service and supersede all prior agreements and understandings.'
  },
  {
    title: '20. Contact Information',
    content:
      'For questions about these Terms, please contact us at: support@searchfit.ai. Address: SearchFit, Sydney, New South Wales, Australia.'
  }
];

export function TermsOfUse(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-16 py-20">
        <SiteHeading
          badge="Legal"
          title="Terms of Use"
          description="These Terms of Use govern your access to and use of SearchFit's AI-powered AEO analytics platform. By using our Service, you agree to these terms. Last updated: December 22, 2025."
        />
        <Alert variant="default">
          <AlertDescription className="ml-3 text-base inline">
            Please read these terms carefully before using SearchFit. By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
          </AlertDescription>
        </Alert>

        <Alert variant="default">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription className="ml-3 text-base">
            <strong>IMPORTANT AI DISCLAIMER:</strong> SearchFit uses artificial intelligence that can make mistakes and produce inaccurate results. We do NOT guarantee accuracy, completeness, or reliability of any AI-generated content. All reports and insights are provided for informational purposes only. You use this service entirely at your own risk and must verify all information independently before making business decisions.
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
