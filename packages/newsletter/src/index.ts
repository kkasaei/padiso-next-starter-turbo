/**
 * @workspace/newsletter package
 * 
 * Newsletter subscription service using Resend
 */

export { env, validateEnv } from './env';

export {
  subscribeToNewsletter,
  getContactByEmail,
  createContact,
  addContactToSegment,
} from './newsletter';

export type {
  NewsletterContact,
  SubscribeResult,
} from './newsletter';
