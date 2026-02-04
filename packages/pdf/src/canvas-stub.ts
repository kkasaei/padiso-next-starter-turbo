/**
 * Canvas Stub for Serverless Environments
 *
 * This stub replaces @napi-rs/canvas and canvas modules in serverless environments
 * where native canvas bindings are not available.
 *
 * @react-pdf/renderer doesn't actually need canvas - it uses its own rendering engine.
 * This stub prevents pdfjs-dist from trying to load canvas when it's not needed.
 */

// Export empty object to satisfy module resolution
// pdfjs-dist checks for canvas but doesn't actually use it for @react-pdf/renderer
export default {};

// Export common canvas-like properties that might be checked
export const createCanvas = (): Record<string, never> => ({});
export const loadImage = (): Promise<Record<string, never>> =>
  Promise.resolve({});
export const registerFont = (): void => {};
