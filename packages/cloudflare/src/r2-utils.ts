/**
 * Cloudflare R2 Utility Functions
 */

/**
 * Normalize domain for consistent file naming
 * - Converts to lowercase
 * - Removes www. prefix
 * - Removes protocol (http://, https://)
 * - Removes trailing slashes
 *
 * @param domain - Domain to normalize
 * @returns Normalized domain
 */
export function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^https?:\/\//, '') // Remove protocol
    .replace(/^www\./, '') // Remove www
    .replace(/\/$/, '') // Remove trailing slash
    .trim();
}

/**
 * Generate a sanitized filename from a domain
 * - Replaces special characters with hyphens
 * - Ensures filename is safe for URLs
 *
 * @param domain - Domain to sanitize
 * @returns Sanitized filename
 */
export function sanitizeDomainForFilename(domain: string): string {
  return normalizeDomain(domain)
    .replace(/[^a-z0-9.-]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Check if a file size is within acceptable limits
 *
 * @param bytes - File size in bytes
 * @param maxMB - Maximum size in megabytes (default: 5MB)
 * @returns true if size is acceptable
 */
export function isFileSizeAcceptable(bytes: number, maxMB: number = 5): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return bytes <= maxBytes;
}

/**
 * Extract report ID and domain from a CDN URL
 *
 * @param cdnUrl - CDN URL to parse
 * @returns Object with reportId and domain, or null if invalid
 */
export function parsePDFUrl(cdnUrl: string): { reportId: string; domain: string } | null {
  try {
    // Example URL: https://cdn.searchfit.ai/report/[reportId]/[domain]-aeo-report.pdf
    const url = new URL(cdnUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (pathParts.length >= 3 && pathParts[0] === 'report') {
      const reportId = pathParts[1];
      const filename = pathParts[2];
      
      if (!reportId || !filename) {
        return null;
      }
      
      const domain = filename.replace('-aeo-report.pdf', '');

      return { reportId, domain };
    }

    return null;
  } catch {
    return null;
  }
}
