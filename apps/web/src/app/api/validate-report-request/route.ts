import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const validateRequestSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Invalid domain format'
    ),
  token: z.string().min(1, 'Captcha token is required'),
});

// ============================================================
// Helper: Get client IP from request headers
// ============================================================
function getClientIp(request: NextRequest): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return 'unknown';
}

// ============================================================
// Simple in-memory rate limiter
// In production, use Redis or similar for distributed rate limiting
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // 3 requests per window
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up expired records
  if (record && record.resetAt < now) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);

  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (current.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count++;
  return { allowed: true, remaining: RATE_LIMIT - current.count };
}

/**
 * Verify Cloudflare Turnstile token
 */
async function verifyTurnstileToken(
  token: string,
  ip: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return {
      success: false,
      error: 'Server configuration error',
    };
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: ip,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      const errorCodes = data['error-codes'] || [];
      console.error('Turnstile verification failed:', {
        errorCodes,
        hostname: data.hostname,
        success: data.success,
      });

      // Provide more specific error messages
      let errorMessage = 'Captcha verification failed';
      if (errorCodes.includes('invalid-input-response')) {
        errorMessage = 'Invalid captcha token. Please refresh and try again.';
      } else if (errorCodes.includes('timeout-or-duplicate')) {
        errorMessage = 'Captcha expired. Please refresh and try again.';
      } else if (errorCodes.includes('hostname-mismatch')) {
        errorMessage = 'Domain verification failed. Please contact support.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return {
      success: false,
      error: 'Failed to verify captcha',
    };
  }
}

/**
 * OPTIONS /api/validate-report-request
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * POST /api/validate-report-request
 * Validates rate limit and captcha before allowing report generation
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = getClientIp(request);

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);

    if (!rateLimitResult.allowed) {
      // Convert seconds to hours for better readability
      const retryAfterSeconds = rateLimitResult.retryAfter || 0;
      const hours = Math.ceil(retryAfterSeconds / 3600);
      const timeMessage =
        hours > 1
          ? `${hours} hours`
          : hours === 1
            ? '1 hour'
            : `${Math.ceil(retryAfterSeconds / 60)} minutes`;

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `You've reached your limit of ${RATE_LIMIT} domains per 24 hours. Please try again in ${timeMessage}.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const validation = validateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: validation.error.issues[0]?.message || 'Invalid request',
        },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const { domain, token } = validation.data;

    // Verify Turnstile token
    const turnstileResult = await verifyTurnstileToken(token, ip);

    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          error: 'Captcha verification failed',
          message: turnstileResult.error || 'Please complete the captcha',
        },
        {
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // All validations passed
    return NextResponse.json(
      {
        success: true,
        domain,
        remaining: rateLimitResult.remaining,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Error in validate-report-request:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again.',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
