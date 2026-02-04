/**
 * Slack Notifications Module
 *
 * Sends notifications to Slack for important events:
 * - Report unlock requests (user submits email on public report page)
 * - Domain search/report generation
 *
 * Uses Slack Incoming Webhooks for simple, secure notifications.
 *
 * @see https://api.slack.com/messaging/webhooks
 */

import { env } from './env';

// ============================================================
// Startup Diagnostics
// ============================================================

// Log Slack configuration at startup (only in server context)
if (typeof window === 'undefined') {
  console.log('[Slack] 🔧 Module loaded');
  console.log('[Slack] 🔧 SLACK_WEBHOOK_URL configured:', !!env.SLACK_WEBHOOK_URL);
  console.log('[Slack] 🔧 NEXT_PUBLIC_CLIENT_URL:', env.NEXT_PUBLIC_CLIENT_URL);
  if (env.SLACK_WEBHOOK_URL) {
    console.log('[Slack] 🔧 Webhook URL prefix:', env.SLACK_WEBHOOK_URL.substring(0, 40) + '...');
  }
}

// ============================================================
// Types & Interfaces
// ============================================================

interface ReportUnlockNotification {
  domain: string;
  domainURL: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  ipAddress?: string;
  userAgent?: string;
  reportUrl: string;
  alreadyUnlocked?: boolean;
}

interface DomainSearchNotification {
  domain: string;
  domainURL: string;
  fromCache: boolean;
  generationTimeMs?: number;
  reportUrl: string;
  ipAddress?: string;
}

interface WaitlistSignupNotification {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface UserSignupNotification {
  email: string;
  firstName?: string;
  lastName?: string;
  clerkId: string;
  userId?: string;
}

interface CustomPackageInquiryNotification {
  fullName: string;
  email: string;
  companyName: string;
  companyWebsite?: string;
  phoneNumber?: string;
  teamSize: string;
  monthlySearchVolume: string;
  requirements: string;
  budget?: string;
  preferredContactMethod: string;
  timeline: string;
  userId?: string;
}

interface ContactFormNotification {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  contactRequestId: string;
}

interface SlackAttachment {
  color?: string;
  title?: string;
  title_link?: string;
  fields: Array<{
    title: string;
    value: string;
    short: boolean;
  }>;
  footer?: string;
  footer_icon?: string;
  ts?: number;
}

interface SlackMessage {
  text: string;
  attachments?: SlackAttachment[];
  username?: string;
  icon_emoji?: string;
}

// ============================================================
// Configuration
// ============================================================

const SLACK_CONFIG = {
  username: 'SearchFit Bot',
  icon_emoji: ':robot_face:',
  colors: {
    success: '#2ecc71',
    info: '#3498db',
    warning: '#f39c12',
    error: '#e74c3c',
  },
};

// ============================================================
// Environment Detection
// ============================================================

/**
 * Detect current environment and extract domain from CLIENT_URL
 */
function getEnvironmentInfo(): {
  name: string;
  emoji: string;
  color: string;
  domain: string;
  fullUrl: string;
} {
  const clientUrl = env.NEXT_PUBLIC_CLIENT_URL || 'unknown';

  // Extract domain from URL (remove protocol and path)
  let domain = clientUrl;
  try {
    const url = new URL(clientUrl);
    domain = url.host; // Gets hostname:port (e.g., "localhost:3000" or "searchfit.ai")
  } catch {
    domain = clientUrl;
  }

  if (clientUrl.includes('localhost') || clientUrl.includes('127.0.0.1')) {
    return {
      name: 'Localhost',
      emoji: '🏠',
      color: '#95a5a6', // Gray
      domain,
      fullUrl: clientUrl,
    };
  }

  if (clientUrl.includes('dev.searchfit.ai')) {
    return {
      name: 'Development',
      emoji: '🧪',
      color: '#f39c12', // Orange
      domain,
      fullUrl: clientUrl,
    };
  }

  if (clientUrl.includes('searchfit.ai') || clientUrl.includes('searchfit.io')) {
    return {
      name: 'Production',
      emoji: '🚀',
      color: '#e74c3c', // Red (production alerts)
      domain,
      fullUrl: clientUrl,
    };
  }

  return {
    name: 'Unknown',
    emoji: '❓',
    color: '#7f8c8d', // Dark gray
    domain,
    fullUrl: clientUrl,
  };
}

// ============================================================
// Core Slack Sender
// ============================================================

/**
 * Send a message to Slack via webhook
 * Fails gracefully if webhook URL is not configured
 */
async function sendSlackMessage(message: SlackMessage): Promise<void> {
  // Debug: Log environment variable status
  console.log('[Slack] Debug - Checking SLACK_WEBHOOK_URL...');
  console.log('[Slack] Debug - Type:', typeof env.SLACK_WEBHOOK_URL);
  console.log('[Slack] Debug - Value exists:', !!env.SLACK_WEBHOOK_URL);
  console.log('[Slack] Debug - First 40 chars:', env.SLACK_WEBHOOK_URL?.substring(0, 40) || 'undefined');
  
  // Skip if webhook URL is not configured
  if (!env.SLACK_WEBHOOK_URL) {
    console.warn('[Slack] ⚠️ Webhook URL not configured, skipping notification');
    console.warn('[Slack] ⚠️ Please set SLACK_WEBHOOK_URL environment variable in Vercel');
    return;
  }

  try {
    // Validate webhook URL format
    if (!env.SLACK_WEBHOOK_URL.startsWith('https://hooks.slack.com/')) {
      console.error('[Slack] ❌ Invalid Slack webhook URL format');
      console.error('[Slack] ❌ Expected: https://hooks.slack.com/services/...');
      console.error('[Slack] ❌ Got (first 40 chars):', env.SLACK_WEBHOOK_URL.substring(0, 40));
      throw new Error(
        `Invalid Slack webhook URL format. Expected https://hooks.slack.com/..., got: ${env.SLACK_WEBHOOK_URL.substring(0, 30)}...`
      );
    }

    console.log('[Slack] 📤 Sending notification to Slack...');
    console.log('[Slack] Webhook URL validated ✓');

    const payload = {
      ...message,
      username: message.username || SLACK_CONFIG.username,
      icon_emoji: message.icon_emoji || SLACK_CONFIG.icon_emoji,
    };

    console.log('[Slack] Request payload size:', JSON.stringify(payload).length, 'bytes');

    const response = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Slack] ❌ Slack API returned error status:', response.status);
      console.error('[Slack] ❌ Response headers:', JSON.stringify(Object.fromEntries(response.headers)));
      console.error('[Slack] ❌ Error details:', errorText);
      console.error('[Slack] ❌ Payload summary:', {
        text: message.text,
        attachments: message.attachments?.length || 0,
      });
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    console.log('[Slack] ✅ Notification sent successfully');
    console.log('[Slack] ✅ Response status:', response.status);
  } catch (error) {
    // Log error but don't throw - we don't want to break the main flow
    console.error('[Slack] ❌ Failed to send notification:', error);
    if (error instanceof Error) {
      console.error('[Slack] ❌ Error message:', error.message);
      console.error('[Slack] ❌ Error stack:', error.stack);
    }
  }
}

// ============================================================
// Report Unlock Notification
// ============================================================

/**
 * Send notification when someone unlocks a report
 * This happens when a user submits their email on the public report page
 */
export async function notifyReportUnlock(
  data: ReportUnlockNotification
): Promise<void> {
  const {
    domain,
    domainURL,
    email,
    firstName,
    lastName,
    companyName,
    ipAddress,
    userAgent,
    reportUrl,
    alreadyUnlocked = false,
  } = data;

  const fullName = `${firstName} ${lastName}`;
  const statusEmoji = alreadyUnlocked ? '🔄' : '🎉';
  const statusText = alreadyUnlocked ? 'Returning User' : '✨ New Lead';
  const envInfo = getEnvironmentInfo();

  const message: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | ${statusEmoji} Report Unlocked`,
    attachments: [
      {
        color: alreadyUnlocked
          ? SLACK_CONFIG.colors.info
          : SLACK_CONFIG.colors.success,
        title: `${statusEmoji} ${alreadyUnlocked ? 'Returning User' : 'New Lead'}: ${domainURL}`,
        title_link: reportUrl,
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '🌐 Report Domain',
            value: `*${domain}*`,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Contact Information
          {
            title: '👤 Contact',
            value: `*${fullName}*\n${email}`,
            short: true,
          },
          {
            title: '🏢 Company',
            value: `*${companyName}*`,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Metadata
          {
            title: '📊 Status',
            value: statusText,
            short: true,
          },
          {
            title: '🌐 IP Address',
            value: ipAddress || 'unknown',
            short: true,
          },
        ],
        footer: `${envInfo.emoji} ${envInfo.domain} | ${formatUserAgent(userAgent)}`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(message);
}

// ============================================================
// Domain Search Notification
// ============================================================

/**
 * Send notification when a domain search/report is generated
 * Helps track which domains are being searched and how often
 */
export async function notifyDomainSearch(
  data: DomainSearchNotification
): Promise<void> {
  const {
    domain,
    domainURL,
    fromCache,
    generationTimeMs,
    reportUrl,
    ipAddress,
  } = data;

  const statusEmoji = fromCache ? '⚡️' : '🆕';
  const statusText = fromCache ? 'Served from Cache' : 'Generated New Report';
  const timeInfo = generationTimeMs
    ? ` (${(generationTimeMs / 1000).toFixed(2)}s)`
    : '';
  const envInfo = getEnvironmentInfo();

  const message: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | ${statusEmoji} Domain Search`,
    attachments: [
      {
        color: fromCache
          ? SLACK_CONFIG.colors.info
          : SLACK_CONFIG.colors.warning,
        title: `${statusEmoji} ${statusText}: ${domainURL}${timeInfo}`,
        title_link: reportUrl,
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '🌐 Report Domain',
            value: `*${domain}*`,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Status Information
          {
            title: '📊 Status',
            value: fromCache ? '⚡️ *Cached*' : '🆕 *Newly Generated*',
            short: true,
          },
          ...(generationTimeMs
            ? [
                {
                  title: '⏱️ Generation Time',
                  value: `*${(generationTimeMs / 1000).toFixed(2)}s*`,
                  short: true,
                },
              ]
            : [
                {
                  title: '⚡️ Cache Hit',
                  value: 'Instant delivery',
                  short: true,
                },
              ]),
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Metadata
          {
            title: '🌐 IP Address',
            value: ipAddress || 'unknown',
            short: true,
          },
          {
            title: '🔗 View Report',
            value: `<${reportUrl}|Open Report →>`,
            short: true,
          },
        ],
        footer: `${envInfo.emoji} ${envInfo.domain}`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(message);
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Format user agent string to be more readable in Slack
 */
function formatUserAgent(userAgent?: string): string {
  if (!userAgent || userAgent === 'unknown') {
    return 'Unknown Browser';
  }

  // Extract browser and OS info (basic parsing)
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';

  return 'Unknown Browser';
}

// ============================================================
// Waitlist Signup Notification
// ============================================================

/**
 * Send notification when someone joins the waitlist
 */
export async function notifyWaitlistSignup(
  data: WaitlistSignupNotification
): Promise<void> {
  const { email, firstName, lastName } = data;
  const envInfo = getEnvironmentInfo();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';

  const message: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | 📝 Waitlist Signup`,
    attachments: [
      {
        color: '#9b59b6', // Purple for waitlist
        title: '📝 New Waitlist Signup',
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '📝 Type',
            value: '*Waitlist Entry*',
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Contact Information
          {
            title: '👤 Name',
            value: fullName,
            short: true,
          },
          {
            title: '📧 Email',
            value: email,
            short: true,
          },
        ],
        footer: `${envInfo.emoji} ${envInfo.domain} | Waitlist`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(message);
}

// ============================================================
// User Signup Notification
// ============================================================

/**
 * Send notification when someone creates an account
 */
export async function notifyUserSignup(
  data: UserSignupNotification
): Promise<void> {
  const { email, firstName, lastName, clerkId, userId } = data;
  const envInfo = getEnvironmentInfo();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';

  const message: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | 🎊 New User Signup`,
    attachments: [
      {
        color: SLACK_CONFIG.colors.success,
        title: '🎊 New User Registered',
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '📝 Type',
            value: '*Account Created*',
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // User Information
          {
            title: '👤 Name',
            value: fullName,
            short: true,
          },
          {
            title: '📧 Email',
            value: email,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Technical Details
          {
            title: '🔑 Clerk ID',
            value: `\`${clerkId}\``,
            short: true,
          },
          ...(userId
            ? [
                {
                  title: '🆔 User ID',
                  value: `\`${userId}\``,
                  short: true,
                },
              ]
            : []),
        ],
        footer: `${envInfo.emoji} ${envInfo.domain} | User Signup`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(message);
}

// ============================================================
// Custom Package Inquiry Notification
// ============================================================

/**
 * Send notification when someone requests a custom package
 */
export async function notifyCustomPackageInquiry(
  data: CustomPackageInquiryNotification
): Promise<void> {
  const {
    fullName,
    email,
    companyName,
    companyWebsite,
    phoneNumber,
    teamSize,
    monthlySearchVolume,
    requirements,
    budget,
    preferredContactMethod,
    timeline,
    userId,
  } = data;
  const envInfo = getEnvironmentInfo();

  const message: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | 🎯 Custom Package Inquiry`,
    attachments: [
      {
        color: '#e67e22', // Orange for sales inquiries
        title: '🎯 New Custom Package Inquiry',
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '📝 Type',
            value: '*Enterprise Sales*',
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Contact Information
          {
            title: '👤 Contact',
            value: `*${fullName}*\n${email}`,
            short: true,
          },
          {
            title: '🏢 Company',
            value: companyName,
            short: true,
          },
          ...(companyWebsite
            ? [
                {
                  title: '🌐 Website',
                  value: companyWebsite,
                  short: true,
                },
              ]
            : []),
          ...(phoneNumber
            ? [
                {
                  title: '📞 Phone',
                  value: phoneNumber,
                  short: true,
                },
              ]
            : []),
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Business Details
          {
            title: '👥 Team Size',
            value: teamSize,
            short: true,
          },
          {
            title: '📊 Monthly Volume',
            value: monthlySearchVolume,
            short: true,
          },
          ...(budget
            ? [
                {
                  title: '💰 Budget',
                  value: budget,
                  short: true,
                },
              ]
            : []),
          {
            title: '⏰ Timeline',
            value: timeline,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Requirements
          {
            title: '📋 Requirements',
            value: requirements.length > 300 ? requirements.substring(0, 300) + '...' : requirements,
            short: false,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Contact Preferences
          {
            title: '📞 Preferred Contact',
            value: preferredContactMethod,
            short: true,
          },
          ...(userId
            ? [
                {
                  title: '🔑 User ID',
                  value: `\`${userId}\``,
                  short: true,
                },
              ]
            : []),
        ],
        footer: `${envInfo.emoji} ${envInfo.domain} | Custom Package Inquiry`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(message);
}

// ============================================================
// Contact Form Submission Notification
// ============================================================

/**
 * Send notification when someone submits the contact form
 */
export async function notifyContactFormSubmission(
  data: ContactFormNotification
): Promise<void> {
  const {
    email,
    firstName,
    lastName,
    message,
    ipAddress,
    userAgent,
    contactRequestId,
  } = data;

  const fullName = `${firstName} ${lastName}`;
  const envInfo = getEnvironmentInfo();

  // Truncate message if too long for Slack
  const truncatedMessage =
    message.length > 300 ? message.substring(0, 300) + '...' : message;

  const slackMessage: SlackMessage = {
    text: `${envInfo.emoji} *${envInfo.name.toUpperCase()}* | 💬 New Contact Form Submission`,
    attachments: [
      {
        color: '#9b59b6', // Purple for contact forms
        title: `📧 New Contact Request from ${fullName}`,
        fields: [
          // Environment Section
          {
            title: '🌍 Environment',
            value: `*${envInfo.name}*\n\`${envInfo.domain}\``,
            short: true,
          },
          {
            title: '📝 Type',
            value: '*Contact Form*',
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Contact Information
          {
            title: '👤 Name',
            value: `*${fullName}*`,
            short: true,
          },
          {
            title: '📧 Email',
            value: email,
            short: true,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Message
          {
            title: '💬 Message',
            value: truncatedMessage,
            short: false,
          },
          // Divider
          {
            title: '',
            value: '━━━━━━━━━━━━━━━━━━━━',
            short: false,
          },
          // Metadata
          {
            title: '🌐 IP Address',
            value: ipAddress || 'unknown',
            short: true,
          },
          {
            title: '🆔 Request ID',
            value: `\`${contactRequestId}\``,
            short: true,
          },
        ],
        footer: `${envInfo.emoji} ${envInfo.domain} | ${formatUserAgent(userAgent)}`,
        footer_icon: 'https://searchfit.io/favicon.svg',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await sendSlackMessage(slackMessage);
}

// ============================================================
// Export Types for Use in Other Modules
// ============================================================

export type {
  ReportUnlockNotification,
  DomainSearchNotification,
  WaitlistSignupNotification,
  UserSignupNotification,
  CustomPackageInquiryNotification,
  ContactFormNotification,
};


