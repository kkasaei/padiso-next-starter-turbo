import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db, publicReports, eq } from '@workspace/db';
import { normalizeDomain } from '@workspace/ai';

export const runtime = 'nodejs';

/**
 * POST /api/reports/[domain]/generate-og-image
 * Test endpoint to FORCE regenerate OG image
 *
 * NOTE: OG image generation requires the uploadOGImageToR2 function
 * from @workspace/cloudflare and proper R2 configuration.
 * This endpoint is currently a placeholder until OG image service is configured.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ domain: string }> }
) {
  try {
    const params = await context.params;
    const domain = decodeURIComponent(params.domain);
    const normalized = normalizeDomain(domain);

    console.log(`[OG Image API] Force regenerating for: ${normalized}`);

    // Find the report
    const [report] = await db
      .select({
        id: publicReports.id,
        ogImageUrl: publicReports.ogImageUrl,
      })
      .from(publicReports)
      .where(eq(publicReports.domain, normalized))
      .limit(1);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const hadExistingImage = !!report.ogImageUrl;

    // Clear existing OG image to force regeneration
    if (report.ogImageUrl) {
      console.log(
        `[OG Image API] 🗑️  Clearing existing image: ${report.ogImageUrl}`
      );
      await db
        .update(publicReports)
        .set({
          ogImageUrl: null,
          ogImageGeneratedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(publicReports.id, report.id));
      console.log(
        `[OG Image API] ✅ Database cleared, ready for fresh generation`
      );
    } else {
      console.log(
        `[OG Image API] 📸 No existing image found, generating first time`
      );
    }

    // TODO: Implement OG image generation using @workspace/cloudflare
    // The uploadOGImageToR2 function is available, but needs:
    // 1. Generate the OG image buffer (using next/og or similar)
    // 2. Upload to R2 using uploadOGImageToR2
    // 3. Update database with new URL
    //
    // For now, return a placeholder response

    console.log(
      `[OG Image API] ⚠️ OG image generation not yet implemented`
    );

    return NextResponse.json({
      success: false,
      message: 'OG image generation is not yet fully implemented',
      regenerated: hadExistingImage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[OG Image API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
