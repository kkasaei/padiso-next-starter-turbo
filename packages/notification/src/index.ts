/**
 * @workspace/notification package
 * 
 * Notification service for Slack notifications and alerts
 */

// Environment Configuration
export { env, validateEnv } from './env';

// Slack Notifications
export {
  notifyReportUnlock,
  notifyDomainSearch,
  notifyWaitlistSignup,
  notifyUserSignup,
  notifyCustomPackageInquiry,
  notifyContactFormSubmission,
} from './slack';

export type {
  ReportUnlockNotification,
  DomainSearchNotification,
  WaitlistSignupNotification,
  UserSignupNotification,
  CustomPackageInquiryNotification,
  ContactFormNotification,
} from './slack';
