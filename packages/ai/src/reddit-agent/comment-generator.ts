/**
 * Reddit Comment Generator
 *
 * Generates brand-aware, authentic Reddit comments for engagement opportunities.
 * Uses AI to create natural-sounding comments that provide value while subtly
 * mentioning the brand when appropriate.
 */

import { generateText } from "ai";
import { gateway, DEFAULT_MODEL } from "../gateway";
import type {
  BrandContext,
  RedditOpportunity,
  GeneratedComment,
  CommentGenerationResponse,
} from "./types";
import { getCommentGenerationPrompt } from "./prompts";

// ============================================================
// JSON Parsing Helper
// ============================================================

function safeJSONParse<T>(text: string, fallback: T | null = null): T | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

    // Clean up common issues
    let cleaned = jsonText
      .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
      .replace(/```/g, "") // Remove any remaining backticks
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return fallback;
  }
}

// ============================================================
// Comment Generation
// ============================================================

/**
 * Generate a Reddit comment for an opportunity
 */
export async function generateRedditComment(
  brand: BrandContext,
  opportunity: RedditOpportunity
): Promise<GeneratedComment> {
  const prompt = getCommentGenerationPrompt(brand, opportunity);

  try {
    const result = await generateText({
      model: gateway(DEFAULT_MODEL),
      prompt,
      temperature: 0.7, // Higher temperature for more natural variation
    });

    const parsed = safeJSONParse<CommentGenerationResponse>(result.text);

    if (!parsed) {
      throw new Error("Failed to parse comment generation response");
    }

    return {
      comment: parsed.comment,
      tone: parsed.tone,
      mentionsBrand: parsed.mentionsBrand,
      confidence: parsed.confidence,
      rationale: parsed.rationale,
    };
  } catch (error) {
    console.error("Error generating comment:", error);

    // Return a fallback response
    return {
      comment: "",
      tone: "helpful",
      mentionsBrand: false,
      confidence: 0,
      rationale: "Failed to generate comment due to an error",
    };
  }
}

/**
 * Generate multiple comment variations for an opportunity
 */
export async function generateCommentVariations(
  brand: BrandContext,
  opportunity: RedditOpportunity,
  count: number = 3
): Promise<GeneratedComment[]> {
  const variations: GeneratedComment[] = [];

  for (let i = 0; i < count; i++) {
    const comment = await generateRedditComment(brand, opportunity);
    if (comment.confidence > 0) {
      variations.push(comment);
    }
  }

  // Sort by confidence
  variations.sort((a, b) => b.confidence - a.confidence);

  return variations;
}

// ============================================================
// Comment Enhancement
// ============================================================

/**
 * Enhance an existing comment with Reddit formatting
 */
export function formatForReddit(comment: string): string {
  // The AI should already return properly formatted text,
  // but we can do some cleanup here if needed

  // Ensure proper line breaks for Reddit markdown
  let formatted = comment
    .replace(/\n{3,}/g, "\n\n") // Max 2 line breaks
    .trim();

  return formatted;
}

/**
 * Validate a generated comment before use
 */
export function validateComment(comment: GeneratedComment): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check minimum length
  if (comment.comment.length < 20) {
    issues.push("Comment is too short");
  }

  // Check maximum length (Reddit has a 10,000 char limit)
  if (comment.comment.length > 5000) {
    issues.push("Comment is too long");
  }

  // Check for common spam indicators
  const spamIndicators = [
    /check out our/i,
    /visit our website/i,
    /click here/i,
    /use my code/i,
    /discount/i,
    /limited time/i,
    /act now/i,
    /www\./i,
    /http/i,
  ];

  for (const indicator of spamIndicators) {
    if (indicator.test(comment.comment)) {
      issues.push(`Contains spam indicator: ${indicator.source}`);
    }
  }

  // Check confidence threshold
  if (comment.confidence < 50) {
    issues.push("Low confidence score");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

// ============================================================
// Comment Templates (for fallback or quick generation)
// ============================================================

/**
 * Get a template-based comment (fallback when AI fails)
 */
export function getTemplateComment(
  opportunity: RedditOpportunity,
  brand: BrandContext
): string {
  const templates: Record<string, string[]> = {
    recommendation_request: [
      `I've had good experience with ${brand.brandName} for this. It ${brand.description?.toLowerCase() || "works well"}.`,
      `Have you looked into ${brand.brandName}? I've been using it and it's been helpful.`,
    ],
    question: [
      `Great question! In my experience, ${brand.businessKeywords?.[0] || "this"} is key.`,
      `I've found that focusing on ${brand.businessKeywords?.[0] || "the fundamentals"} helps a lot.`,
    ],
    problem_discussion: [
      `I ran into something similar. What helped me was ${brand.businessKeywords?.[0] || "trying different approaches"}.`,
      `This is a common challenge. ${brand.brandName} helped me with this.`,
    ],
  };

  const typeTemplates = templates[opportunity.opportunityType] || templates.question;
  return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
}
