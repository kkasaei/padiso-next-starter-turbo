'use server';

import { z } from 'zod';
import { headers, cookies } from 'next/headers';
import { db, eq, and, publicReports, reportUnlockRequests } from '@workspace/db';
import { sendReportLinkEmail } from '@workspace/email';
import { notifyReportUnlock } from '@workspace/notification';
import { env } from '@/env';

// ============================================================
// Schema for unlock request validation
// ============================================================

const unlockReportSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  companyName: z.string().min(1, 'Company name is required'),
});

type UnlockReportInput = z.infer<typeof unlockReportSchema>;

// ============================================================
// Response Types
// ============================================================

interface UnlockReportResult {
  success: boolean;
  error?: string;
  alreadyUnlocked?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// ============================================================
// Helper: Normalize Domain
// ============================================================

function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .trim();
}

// ============================================================
// Helper: Extract scores from report data
// ============================================================

function extractScoresFromReport(reportData: unknown): {
  overallScore: number;
  chatGptScore: number;
  perplexityScore: number;
  geminiScore: number;
} {
  let overallScore = 0;
  let chatGptScore = 0;
  let perplexityScore = 0;
  let geminiScore = 0;

  if (reportData && typeof reportData === 'object') {
    const data = reportData as Record<string, unknown>;

    if (Array.isArray(data.llmProviders)) {
      const providers = data.llmProviders as Array<{ name?: string; score?: number }>;

      const chatGpt = providers.find((p) => p.name === 'ChatGPT');
      const perplexity = providers.find((p) => p.name === 'Perplexity');
      const gemini = providers.find((p) => p.name === 'Gemini');

      chatGptScore = chatGpt?.score ?? 0;
      perplexityScore = perplexity?.score ?? 0;
      geminiScore = gemini?.score ?? 0;

      const scores = [chatGptScore, perplexityScore, geminiScore].filter((s) => s > 0);
      overallScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    }
  }

  return { overallScore, chatGptScore, perplexityScore, geminiScore };
}

// ============================================================
// Main Server Action: Unlock Report
// ============================================================

export async function unlockReport(
  input: UnlockReportInput
): Promise<UnlockReportResult> {
  try {
    // Validate input
    const validatedData = unlockReportSchema.parse(input);

    // Get IP address and user agent for tracking
    const headersList = await headers();
    const ipAddress =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Normalize domain and email
    const normalizedDomain = normalizeDomain(validatedData.domain);
    const normalizedEmail = validatedData.email.toLowerCase();

    // Check if this email has already unlocked this report
    const existingRequest = await db.query.reportUnlockRequests.findFirst({
      where: and(
        eq(reportUnlockRequests.domain, normalizedDomain),
        eq(reportUnlockRequests.email, normalizedEmail)
      ),
    });

    const now = new Date();

    if (existingRequest) {
      // Update the existing request
      await db
        .update(reportUnlockRequests)
        .set({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          companyName: validatedData.companyName,
          unlocked: true,
          unlockedAt: now,
          updatedAt: now,
        })
        .where(eq(reportUnlockRequests.id, existingRequest.id));

      // Set cookie
      await setUnlockCookie(normalizedDomain, {
        email: normalizedEmail,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });

      // Send email and Slack notification (fire-and-forget)
      void sendNotifications({
        normalizedDomain,
        originalDomain: validatedData.domain,
        email: normalizedEmail,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        companyName: validatedData.companyName,
        ipAddress,
        userAgent,
        alreadyUnlocked: true,
      });

      return {
        success: true,
        alreadyUnlocked: true,
        email: normalizedEmail,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      };
    }

    // Create new unlock request
    await db.insert(reportUnlockRequests).values({
      domain: normalizedDomain,
      email: normalizedEmail,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      companyName: validatedData.companyName,
      ipAddress,
      userAgent,
      unlocked: true,
      unlockedAt: now,
    });

    // Set cookie
    await setUnlockCookie(normalizedDomain, {
      email: normalizedEmail,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    });

    // Send email and Slack notification (fire-and-forget)
    void sendNotifications({
      normalizedDomain,
      originalDomain: validatedData.domain,
      email: normalizedEmail,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      companyName: validatedData.companyName,
      ipAddress,
      userAgent,
      alreadyUnlocked: false,
    });

    return {
      success: true,
      email: normalizedEmail,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    };
  } catch (error) {
    console.error('[Unlock Report] Error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Invalid input',
      };
    }

    return {
      success: false,
      error: 'Failed to unlock report. Please try again.',
    };
  }
}

// ============================================================
// Helper: Set Unlock Cookie
// ============================================================

async function setUnlockCookie(
  domain: string,
  data: { email: string; firstName: string; lastName: string }
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    `report_unlocked_${domain}`,
    JSON.stringify(data),
    {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
  );
}

// ============================================================
// Helper: Send Email & Slack Notifications (fire-and-forget)
// ============================================================

interface NotificationParams {
  normalizedDomain: string;
  originalDomain: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  ipAddress: string;
  userAgent: string;
  alreadyUnlocked: boolean;
}

async function sendNotifications(params: NotificationParams): Promise<void> {
  const {
    normalizedDomain,
    originalDomain,
    email,
    firstName,
    lastName,
    companyName,
    ipAddress,
    userAgent,
    alreadyUnlocked,
  } = params;

  const reportUrl = `${env.NEXT_PUBLIC_CLIENT_URL}/report/${normalizedDomain}`;
  const waitlistUrl = `${env.NEXT_PUBLIC_CLIENT_URL}/waitlist`;

  // Send Slack notification (fire-and-forget)
  void notifyReportUnlock({
    domain: normalizedDomain,
    domainURL: originalDomain,
    email,
    firstName,
    lastName,
    companyName,
    ipAddress,
    userAgent,
    reportUrl,
    alreadyUnlocked,
  });

  // Send email
  try {
    // Fetch report data for email scores
    const report = await db.query.publicReports.findFirst({
      where: eq(publicReports.domain, normalizedDomain),
      columns: {
        data: true,
        createdAt: true,
      },
    });

    // Extract scores
    const scores = extractScoresFromReport(report?.data);

    // Format date for email
    const reportDate = report?.createdAt
      ? new Date(report.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    console.log(`[Unlock Report] 📧 Sending report email to ${email} for domain ${normalizedDomain}`);

    await sendReportLinkEmail({
      recipient: email,
      firstName,
      lastName,
      domain: normalizedDomain,
      reportUrl,
      appName: 'SearchFit',
      overallScore: scores.overallScore,
      chatGptScore: scores.chatGptScore,
      perplexityScore: scores.perplexityScore,
      geminiScore: scores.geminiScore,
      reportGeneratedDate: reportDate,
      waitlistUrl,
    });

    console.log(`[Unlock Report] ✅ Email successfully sent to ${email}`);
  } catch (error) {
    console.error('[Unlock Report] ❌ Failed to send report link email:', error);
  }
}

// ============================================================
// Check if a user has unlocked a specific report
// ============================================================

export async function checkReportUnlocked(
  domain: string,
  email: string
): Promise<boolean> {
  try {
    const normalizedDomain = normalizeDomain(domain);
    const normalizedEmail = email.toLowerCase();

    const request = await db.query.reportUnlockRequests.findFirst({
      where: and(
        eq(reportUnlockRequests.domain, normalizedDomain),
        eq(reportUnlockRequests.email, normalizedEmail),
        eq(reportUnlockRequests.unlocked, true)
      ),
    });

    return !!request;
  } catch (error) {
    console.error('[Check Unlock] Error:', error);
    return false;
  }
}
