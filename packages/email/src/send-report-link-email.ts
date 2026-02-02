import { env } from '@/env';
import { EmailProvider } from './provider';
import { renderMJML } from './mjml/render-mjml';
import { generateReportLinkEmail } from './mjml/templates/report-link-email';

export interface SendReportLinkEmailInput {
  recipient: string;
  firstName: string;
  lastName: string;
  domain: string;
  reportUrl: string;
  appName: string;
  // AEO Scores
  overallScore: number;
  chatGptScore: number;
  perplexityScore: number;
  geminiScore: number;
  // Report metadata
  reportGeneratedDate: string; // e.g., "December 15, 2025"
  // Waitlist URL
  waitlistUrl: string;
}

/**
 * Send report link email to user who unlocked the report
 *
 * Uses MJML template for beautiful, responsive email design
 */
export async function sendReportLinkEmail(
  input: SendReportLinkEmailInput
): Promise<void> {
  try {
    // Generate MJML template
    const mjmlTemplate = generateReportLinkEmail({
      firstName: input.firstName,
      lastName: input.lastName,
      domain: input.domain,
      reportUrl: input.reportUrl,
      appName: input.appName,
      overallScore: input.overallScore,
      chatGptScore: input.chatGptScore,
      perplexityScore: input.perplexityScore,
      geminiScore: input.geminiScore,
      reportGeneratedDate: input.reportGeneratedDate,
      waitlistUrl: input.waitlistUrl,
    });

    // Render MJML to HTML and plain text
    const { html, text } = renderMJML(mjmlTemplate);

    // Send email via configured provider (Resend)
    await EmailProvider.sendEmail({
      recipient: input.recipient,
      subject: `Your ${input.appName} Report for ${input.domain} is Ready! 🚀`,
      html,
      text,
      ...(env.EMAIL_REPLY_TO && { replyTo: env.EMAIL_REPLY_TO }),
    });

    console.log(`[Email] ✅ Report link email sent successfully to ${input.recipient} for domain ${input.domain}`);
  } catch (error) {
    console.error('[Email] ❌ Failed to send report link email:', error);
    // Don't throw - email failure shouldn't block the unlock process
    // Just log the error for monitoring
  }
}
