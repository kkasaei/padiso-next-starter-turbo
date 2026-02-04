import { NextResponse } from 'next/server';

/**
 * GET/POST /api/uploading
 *
 * File upload route handler placeholder.
 * 
 * NOTE: This route requires uploadthing to be configured.
 * To enable file uploads:
 * 1. Install uploadthing: pnpm add uploadthing @uploadthing/react
 * 2. Create lib/uploading.ts with file router configuration
 * 3. Update this file to use createRouteHandler
 *
 * Example configuration:
 * ```typescript
 * import { createRouteHandler } from 'uploadthing/next';
 * import { ourFileRouter } from '@/lib/uploading';
 * export const { GET, POST } = createRouteHandler({ router: ourFileRouter });
 * ```
 */

export async function GET() {
  return NextResponse.json(
    {
      error: 'File upload service not configured',
      message: 'Please configure uploadthing to enable file uploads.',
    },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'File upload service not configured',
      message: 'Please configure uploadthing to enable file uploads.',
    },
    { status: 501 }
  );
}
