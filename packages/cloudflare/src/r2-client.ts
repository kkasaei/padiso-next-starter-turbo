import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

let _r2Client: S3Client | null = null;

/**
 * Cloudflare R2 Client (Lazy Initialization)
 * R2 is S3-compatible, so we use the AWS SDK S3 client
 * 
 * This client is lazily initialized to avoid failing at module import time
 * when R2 credentials are not configured (e.g., in development or deployments
 * that don't use R2).
 */
export const getR2Client = (): S3Client => {
  if (!_r2Client) {
    if (!env.R2_ACCOUNT_ID) {
      throw new Error('R2_ACCOUNT_ID environment variable is required');
    }

    if (!env.R2_ACCESS_KEY_ID) {
      throw new Error('R2_ACCESS_KEY_ID environment variable is required');
    }

    if (!env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2_SECRET_ACCESS_KEY environment variable is required');
    }

    _r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  return _r2Client;
};

/**
 * R2 Configuration Constants
 */
export const R2_CONFIG = {
  BUCKET: env.R2_BUCKET,
  CDN_URL: env.NEXT_PUBLIC_CDN_URL,
  PDF_BASE_PATH: 'report', // Base path for PDF files in R2
} as const;
