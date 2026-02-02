/**
 * Brand Website Analyzer
 * 
 * Analyzes a website to extract brand information:
 * - Business description
 * - Target audiences  
 * - Keywords
 * - Competitors
 */

import { generateText } from 'ai';
import { gateway } from '../gateway';
import type { BrandAnalysisInput, BrandAnalysisResult } from './types';

const ANALYSIS_TIMEOUT = 60000; // 60 seconds

/**
 * Fetches the website content
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    // Ensure URL has protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    
    const response = await fetch(urlWithProtocol, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SearchFit/1.0; +https://searchfit.io)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract text content from HTML (simple version)
    // Remove scripts, styles, and tags
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Limit to first 5000 chars to avoid huge prompts
    return cleanText.slice(0, 5000);
  } catch (error) {
    console.error('Failed to fetch website:', error);
    throw new Error(`Could not fetch website content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyzes a brand's website to extract key information
 */
export async function analyzeBrandWebsite(
  input: BrandAnalysisInput
): Promise<BrandAnalysisResult> {
  console.log(`🔍 Analyzing brand website: ${input.websiteUrl}`);

  // Fetch website content
  const websiteContent = await fetchWebsiteContent(input.websiteUrl);

  const prompt = `You are a business analyst. Analyze the following website content and extract key information.

Website URL: ${input.websiteUrl}
${input.brandName ? `Brand Name: ${input.brandName}` : ''}

Website Content:
${websiteContent}

Extract and return the following information in JSON format:

1. **description**: A 2-3 sentence business description explaining what the company does, their products/services, and what makes them unique.

2. **targetAudiences**: An array of 3-5 specific target audience segments (e.g., "Marketing managers at B2B SaaS companies", "E-commerce store owners", "SEO specialists").

3. **businessKeywords**: An array of 5-8 relevant business keywords and phrases that describe their offering, industry, and value proposition (e.g., "SEO optimization", "content marketing", "organic traffic").

4. **competitors**: An array of 3-5 competitor domain names (just the domain, no https://) based on the industry and offering. If you can't identify specific competitors from the content, suggest likely competitors based on the business type.

Return ONLY valid JSON in this exact format:
{
  "description": "...",
  "targetAudiences": ["...", "..."],
  "businessKeywords": ["...", "..."],
  "competitors": ["example.com", "competitor.com"]
}`;

  try {
    const result = await Promise.race([
      generateText({
        model: gateway('openai/gpt-5-mini'),
        prompt,
        temperature: 0.3,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Analysis timeout')), ANALYSIS_TIMEOUT)
      ),
    ]);

    const text = result.text;

    // Extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No JSON found in AI response');
      throw new Error('Failed to parse AI response');
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText) as BrandAnalysisResult;

    // Validate required fields
    if (!parsed.description || !parsed.targetAudiences || !parsed.businessKeywords) {
      throw new Error('Invalid AI response: missing required fields');
    }

    console.log(`✅ Brand analysis complete`);
    console.log(`   - ${parsed.targetAudiences.length} target audiences`);
    console.log(`   - ${parsed.businessKeywords.length} keywords`);
    console.log(`   - ${parsed.competitors?.length || 0} competitors`);

    return {
      description: parsed.description,
      targetAudiences: parsed.targetAudiences || [],
      businessKeywords: parsed.businessKeywords || [],
      competitors: parsed.competitors || [],
    };

  } catch (error) {
    console.error('Failed to analyze brand website:', error);
    throw new Error(`Brand analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
