/**
 * @workspace/email package
 * 
 * Email service and templates for sending transactional emails
 */

// Environment configuration
export { env, validateEnv } from './env';
export type * from './env';

// Email provider
export { EmailProvider } from './provider';
export type { EmailPayload, EmailProvider as IEmailProvider } from './provider/types';

// Email sending functions
export { sendWelcomeEmail } from './send-welcome-email';
export { sendVerifyEmailAddressEmail } from './send-verify-email-address-email';
export { sendPasswordResetEmail } from './send-password-reset-email';
export { sendFeedbackEmail } from './send-feedback-email';
export { sendContactFormEmail, type SendContactFormEmailInput } from './send-contact-form-email';
export { sendReportLinkEmail, type SendReportLinkEmailInput } from './send-report-link-email';
export { sendConfirmEmailAddressChangeEmail } from './send-confirm-email-address-change-email';
export { sendConnectedAccountSecurityAlertEmail } from './send-connected-account-security-alert-email';

// Email templates (React components)
export { WelcomeEmail, type WelcomeEmailProps } from './templates/welcome-email';
export { VerifyEmailAddressEmail, type VerifyEmailAddressEmailProps } from './templates/verify-email-address-email';
export { PasswordResetEmail, type PasswordResetEmailProps } from './templates/password-reset-email';
export { FeedbackEmail, type FeedbackEmailProps } from './templates/feedback-email';
export { InvitationEmail, type InvitationEmailProps } from './templates/invitation-email';
export { RevokedInvitationEmail, type RevokedInvitationEmailProps } from './templates/revoked-invitation-email';
export { ConfirmEmailAddressChangeEmail, type ConfirmEmailAddressChangeEmailProps } from './templates/confirm-email-address-change-email';
export { ConnectedAccountSecurityAlertEmail, type ConnectedAccountSecurityAlertEmailProps } from './templates/connected-account-security-alert-email';

// MJML utilities
export { renderMJML } from './mjml/render-mjml';
export { generateReportLinkEmail, type ReportLinkEmailProps } from './mjml/templates/report-link-email';
