/**
 * Icon utilities for PDF generation
 * Ensures all icons use CDN URLs
 */

const ICON_CDN_BASE = 'https://cdn.searchfit.ai/assets';

/**
 * Convert local icon path to CDN URL
 * @param iconPath - Icon path (e.g., "/icons/openai.svg" or full URL)
 * @returns CDN URL
 */
export function convertIconToCDN(iconPath: string): string {
  // If already a CDN URL, return as-is
  if (iconPath.startsWith(ICON_CDN_BASE)) {
    return iconPath;
  }

  // If full URL but not CDN, return as-is (external URL)
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }

  // Convert local path to CDN
  if (iconPath.startsWith('/icons/')) {
    return iconPath.replace('/icons/', `${ICON_CDN_BASE}/icons/`);
  }

  // If just filename, add CDN base + icons path
  if (iconPath.endsWith('.svg') || iconPath.endsWith('.png')) {
    return `${ICON_CDN_BASE}/icons/${iconPath}`;
  }

  return iconPath;
}

/**
 * Convert all icon paths in report data to CDN URLs
 * @param data - AEO Report data
 * @returns Data with CDN icon URLs
 */
export function convertReportIconsToCDN<T extends Record<string, unknown>>(
  data: T
): T {
  const converted = JSON.parse(JSON.stringify(data)) as T; // Deep clone

  // Convert llmProviders icons
  if (
    Array.isArray((converted as Record<string, unknown>).llmProviders)
  ) {
    (converted as Record<string, unknown[]>).llmProviders = (
      (converted as Record<string, unknown[]>).llmProviders
    ).map((provider: unknown) => ({
      ...(provider as Record<string, unknown>),
      logo: convertIconToCDN(
        (provider as Record<string, string>).logo
      ),
    }));
  }

  // Convert brandRecognition icons
  if (
    Array.isArray((converted as Record<string, unknown>).brandRecognition)
  ) {
    (converted as Record<string, unknown[]>).brandRecognition = (
      (converted as Record<string, unknown[]>).brandRecognition
    ).map((item: unknown) => ({
      ...(item as Record<string, unknown>),
      logo: convertIconToCDN((item as Record<string, string>).logo),
    }));
  }

  // Convert sentimentAnalysis icons (if they have logos)
  if (
    Array.isArray((converted as Record<string, unknown>).sentimentAnalysis)
  ) {
    (converted as Record<string, unknown[]>).sentimentAnalysis = (
      (converted as Record<string, unknown[]>).sentimentAnalysis
    ).map((item: unknown) => ({
      ...(item as Record<string, unknown>),
      logo: (item as Record<string, string>).logo
        ? convertIconToCDN((item as Record<string, string>).logo)
        : (item as Record<string, string>).logo,
    }));
  }

  // Convert brandPositioning provider icons
  const brandPositioning = (converted as Record<string, unknown>)
    .brandPositioning as Record<string, unknown> | undefined;
  if (brandPositioning?.providers) {
    brandPositioning.providers = (
      brandPositioning.providers as unknown[]
    ).map((provider: unknown) => ({
      ...(provider as Record<string, unknown>),
      logo: convertIconToCDN((provider as Record<string, string>).logo),
    }));
  }

  return converted;
}
