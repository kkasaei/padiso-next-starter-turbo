/**
 * Slack Notifications for Contact Form Submissions
 */

import { env } from './env';

// ============================================================
// Types & Interfaces
// ============================================================

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
  icon_emoji: ':email:',
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

function getEnvironmentInfo(): {
  name: string;
  emoji: string;
  color: string;
  domain: string;
} {
  const clientUrl = env.NEXT_PUBLIC_CLIENT_URL || 'unknown';

  let domain = clientUrl;
  try {
    const url = new URL(clientUrl);
    domain = url.host;
  } catch {
    domain = clientUrl;
  }

  if (clientUrl.includes('localhost') || clientUrl.includes('127.0.0.1')) {
    return {
      name: 'Localhost',
      emoji: '🏠',
      color: '#95a5a6',
      domain,
    };
  }

  if (clientUrl.includes('dev.searchfit.ai')) {
    return {
      name: 'Development',
      emoji: '🧪',
      color: '#f39c12',
      domain,
    };
  }

  if (clientUrl.includes('searchfit.ai') || clientUrl.includes('searchfit.io')) {
    return {
      name: 'Production',
      emoji: '🚀',
      color: '#e74c3c',
      domain,
    };
  }

  return {
    name: 'Unknown',
    emoji: '❓',
    color: '#7f8c8d',
    domain,
  };
}

// ============================================================
// Core Slack Sender
// ============================================================

async function sendSlackMessage(message: SlackMessage): Promise<void> {
  if (!env.SLACK_WEBHOOK_URL) {
    console.warn('[Slack] Webhook URL not configured, skipping notification');
    return;
  }

  try {
    if (!env.SLACK_WEBHOOK_URL.startsWith('https://hooks.slack.com/')) {
      console.error('[Slack] Invalid webhook URL format');
      return;
    }

    const payload = {
      ...message,
      username: message.username || SLACK_CONFIG.username,
      icon_emoji: message.icon_emoji || SLACK_CONFIG.icon_emoji,
    };

    const response = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Slack] API error:', response.status, errorText);
      throw new Error(`Slack API error: ${response.status}`);
    }

    console.log('[Slack] ✅ Notification sent successfully');
  } catch (error) {
    console.error('[Slack] Failed to send notification:', error);
    // Don't throw - we don't want to block the main flow
  }
}

// ============================================================
// Contact Form Submission Notification
// ============================================================

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
// Utility Functions
// ============================================================

function formatUserAgent(userAgent?: string): string {
  if (!userAgent || userAgent === 'unknown') {
    return 'Unknown Browser';
  }

  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';

  return 'Unknown Browser';
}

