/**
 * AI Image Generation using Gemini 3 Pro Image
 *
 * Uses the Vercel AI Gateway to generate images with Google's Gemini 3 Pro Image model.
 * Model: google/gemini-3-pro-image
 * Pricing: ~$0.04/image
 *
 * @see https://vercel.com/ai-gateway/models/gemini-3-pro-image
 */

import { experimental_generateImage as generateImage } from 'ai';
import { gateway } from './gateway';

// ============================================================
// Configuration
// ============================================================

export const IMAGE_GENERATION_MODEL = 'google/gemini-3-pro-image';

// Image size options supported by Gemini 3 Pro Image
export const IMAGE_SIZES = {
  square: { width: 1024, height: 1024 }, // 1:1
  landscape: { width: 1792, height: 1024 }, // 16:9 ish
  portrait: { width: 1024, height: 1792 }, // 9:16 ish
  wide: { width: 1536, height: 1024 }, // 3:2
  tall: { width: 1024, height: 1536 }, // 2:3
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

// Style presets to enhance prompts
export const IMAGE_STYLES = {
  photorealistic: 'photorealistic, high quality photograph, professional photography, detailed',
  illustration: 'digital illustration, artistic, stylized, clean lines',
  '3d-render': '3D render, octane render, studio lighting, professional',
  icon: 'simple icon design, flat design, minimal, clean',
  abstract: 'abstract art, modern design, creative, artistic',
  minimal: 'minimalist design, clean, simple, elegant, white space',
  vibrant: 'vibrant colors, bold, eye-catching, dynamic',
  professional: 'professional, corporate, clean, business-appropriate',
} as const;

export type ImageStyle = keyof typeof IMAGE_STYLES;

// ============================================================
// Types
// ============================================================

export interface GenerateImageInput {
  prompt: string;
  size?: ImageSize;
  style?: ImageStyle;
  negativePrompt?: string;
}

export interface GenerateImageResult {
  success: true;
  imageBase64: string;
  mimeType: 'image/png';
  width: number;
  height: number;
  prompt: string; // The enhanced prompt that was used
  model: string;
}

export interface GenerateImageError {
  success: false;
  error: string;
}

export type GenerateImageResponse = GenerateImageResult | GenerateImageError;

// ============================================================
// Helper Functions
// ============================================================

/**
 * Enhance the user's prompt with style and quality modifiers
 */
function enhancePrompt(
  prompt: string,
  style?: ImageStyle,
  negativePrompt?: string
): string {
  let enhanced = prompt.trim();

  // Add style modifiers if specified
  if (style && IMAGE_STYLES[style]) {
    enhanced = `${enhanced}, ${IMAGE_STYLES[style]}`;
  }

  // Add quality modifiers
  enhanced = `${enhanced}, high quality, detailed`;

  // Add negative prompt if specified
  if (negativePrompt) {
    enhanced = `${enhanced}. Avoid: ${negativePrompt}`;
  }

  return enhanced;
}

// ============================================================
// Main Generation Function
// ============================================================

/**
 * Generate an image using Gemini 3 Pro Image via AI Gateway
 *
 * @example
 * ```ts
 * const result = await generateAIImage({
 *   prompt: "A modern office space with plants",
 *   size: "landscape",
 *   style: "photorealistic"
 * });
 *
 * if (result.success) {
 *   const buffer = Buffer.from(result.imageBase64, 'base64');
 *   // Save or upload the buffer
 * }
 * ```
 */
export async function generateAIImage(
  input: GenerateImageInput
): Promise<GenerateImageResponse> {
  const { prompt, size = 'square', style, negativePrompt } = input;

  // Validate prompt
  if (!prompt || prompt.trim().length === 0) {
    return {
      success: false,
      error: 'Prompt is required',
    };
  }

  if (prompt.length > 4000) {
    return {
      success: false,
      error: 'Prompt is too long. Maximum 4000 characters.',
    };
  }

  // Get dimensions
  const dimensions = IMAGE_SIZES[size];

  // Enhance the prompt
  const enhancedPrompt = enhancePrompt(prompt, style, negativePrompt);

  console.log(`[ImageGen] Generating image with Gemini 3 Pro Image`);
  console.log(`[ImageGen] Size: ${size} (${dimensions.width}x${dimensions.height})`);
  console.log(`[ImageGen] Enhanced prompt: ${enhancedPrompt.substring(0, 100)}...`);

  try {
    const startTime = Date.now();

    // Use the AI SDK's experimental_generateImage function
    const result = await generateImage({
      model: gateway.imageModel(IMAGE_GENERATION_MODEL),
      prompt: enhancedPrompt,
      size: `${dimensions.width}x${dimensions.height}`,
      n: 1, // Generate 1 image
    });

    const duration = Date.now() - startTime;
    console.log(`[ImageGen] Generated in ${duration}ms`);

    // Extract the image from the result
    if (!result.images || result.images.length === 0) {
      return {
        success: false,
        error: 'No image was generated',
      };
    }

    const image = result.images[0];

    // The AI SDK returns base64 encoded image
    return {
      success: true,
      imageBase64: image.base64,
      mimeType: 'image/png',
      width: dimensions.width,
      height: dimensions.height,
      prompt: enhancedPrompt,
      model: IMAGE_GENERATION_MODEL,
    };
  } catch (error) {
    console.error('[ImageGen] Generation failed:', error);

    // Extract meaningful error message
    let errorMessage = 'Failed to generate image';

    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific error cases
      if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      } else if (errorMessage.includes('content policy')) {
        errorMessage =
          'The prompt was rejected due to content policy. Please try a different prompt.';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================================
// Batch Generation (for future use)
// ============================================================

export interface BatchGenerateInput {
  prompts: GenerateImageInput[];
  concurrency?: number;
}

/**
 * Generate multiple images in parallel
 * Respects concurrency limits to avoid rate limiting
 */
export async function batchGenerateImages(
  input: BatchGenerateInput
): Promise<GenerateImageResponse[]> {
  const { prompts, concurrency = 3 } = input;

  console.log(`[ImageGen] Batch generating ${prompts.length} images`);

  const results: GenerateImageResponse[] = [];

  // Process in batches to respect rate limits
  for (let i = 0; i < prompts.length; i += concurrency) {
    const batch = prompts.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((prompt) => generateAIImage(prompt))
    );
    results.push(...batchResults);

    // Small delay between batches to avoid rate limiting
    if (i + concurrency < prompts.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(
    `[ImageGen] Batch complete: ${successCount}/${results.length} succeeded`
  );

  return results;
}

// ============================================================
// Utility: Convert Base64 to Buffer
// ============================================================

/**
 * Convert a base64 string to a Buffer
 * Useful for uploading to R2
 */
export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

