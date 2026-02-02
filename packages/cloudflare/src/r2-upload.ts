import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, R2_CONFIG } from './r2-client';

/**
 * Upload a PDF file to Cloudflare R2
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @param pdfBuffer - PDF file as Buffer
 * @returns Public CDN URL to the uploaded PDF
 */
export async function uploadPDFToR2(
  reportId: string,
  domain: string,
  pdfBuffer: Buffer
): Promise<string> {
  // Create filename: example.com-aeo-report.pdf
  const fileName = `${domain}-aeo-report.pdf`;

  // Create R2 key: report/[reportId]/[filename]
  const key = `${R2_CONFIG.PDF_BASE_PATH}/${reportId}/${fileName}`;

  console.log(`[R2] Uploading PDF to: ${key}`);

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentLength: pdfBuffer.length, // Required for R2
        ContentDisposition: `inline; filename="${fileName}"`, // Open in browser, not download
        CacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year
        Metadata: {
          'x-report-id': reportId,
          'x-domain': domain,
          'x-generated-at': new Date().toISOString(),
        },
      })
    );

    // Return public CDN URL
    const cdnUrl = `${R2_CONFIG.CDN_URL}/${key}`;
    console.log(`[R2] PDF uploaded successfully: ${cdnUrl}`);

    return cdnUrl;
  } catch (error) {
    console.error('[R2] Failed to upload PDF:', error);
    throw new Error(`Failed to upload PDF to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a PDF file exists in R2
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @returns true if file exists, false otherwise
 */
export async function checkPDFExists(
  reportId: string,
  domain: string
): Promise<boolean> {
  const fileName = `${domain}-aeo-report.pdf`;
  const key = `${R2_CONFIG.PDF_BASE_PATH}/${reportId}/${fileName}`;

  try {
    await getR2Client().send(
      new HeadObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    // File doesn't exist or error accessing it
    return false;
  }
}

/**
 * Generate the CDN URL for a PDF
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @returns Public CDN URL
 */
export function generatePDFUrl(reportId: string, domain: string): string {
  const fileName = `${domain}-aeo-report.pdf`;
  const key = `${R2_CONFIG.PDF_BASE_PATH}/${reportId}/${fileName}`;
  return `${R2_CONFIG.CDN_URL}/${key}`;
}

/**
 * Upload an OG image to Cloudflare R2
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @param imageBuffer - PNG image as Buffer
 * @returns Public CDN URL to the uploaded image
 */
export async function uploadOGImageToR2(
  reportId: string,
  domain: string,
  imageBuffer: Buffer
): Promise<string> {
  // Create filename: example.com-og-image.png
  const fileName = `${domain}-og-image.png`;

  // Create R2 key: og-images/[reportId]/[filename]
  const key = `og-images/${reportId}/${fileName}`;

  console.log(`[R2] Uploading OG image to: ${key}`);

  try {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: key,
        Body: imageBuffer,
        ContentType: 'image/png',
        ContentLength: imageBuffer.length,
        CacheControl: 'public, max-age=3600, must-revalidate', // Cache for 1 hour, must revalidate
        Metadata: {
          'x-report-id': reportId,
          'x-domain': domain,
          'x-generated-at': new Date().toISOString(),
        },
      })
    );

    // Return public CDN URL
    const cdnUrl = `${R2_CONFIG.CDN_URL}/${key}`;
    console.log(`[R2] OG image uploaded successfully: ${cdnUrl}`);

    return cdnUrl;
  } catch (error) {
    console.error('[R2] Failed to upload OG image:', error);
    throw new Error(`Failed to upload OG image to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if an OG image exists in R2
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @returns true if file exists, false otherwise
 */
export async function checkOGImageExists(
  reportId: string,
  domain: string
): Promise<boolean> {
  const fileName = `${domain}-og-image.png`;
  const key = `og-images/${reportId}/${fileName}`;

  try {
    await getR2Client().send(
      new HeadObjectCommand({
        Bucket: R2_CONFIG.BUCKET,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    // File doesn't exist or error accessing it
    return false;
  }
}

/**
 * Generate the CDN URL for an OG image
 *
 * @param reportId - Unique report identifier
 * @param domain - Domain name for the report
 * @returns Public CDN URL
 */
export function generateOGImageUrl(reportId: string, domain: string): string {
  const fileName = `${domain}-og-image.png`;
  const key = `og-images/${reportId}/${fileName}`;
  return `${R2_CONFIG.CDN_URL}/${key}`;
}
