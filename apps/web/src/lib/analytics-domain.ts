/**
 * Check if analytics should be enabled based on the current hostname.
 * Only track on production domain: searchfit.ai
 */
export function isProductionDomain(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;

  return hostname === 'searchfit.ai' || hostname === 'www.searchfit.ai';
}
