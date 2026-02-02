/**
 * AI Prompts for Website Audit
 *
 * Prompts for analyzing web pages for SEO and AEO optimization
 */

import type { PageAnalysisInput } from './types';

// ============================================================
// Page Analysis Prompt
// ============================================================

export function getPageAnalysisPrompt(input: PageAnalysisInput): string {
  const structuredDataInfo = input.hasStructuredData
    ? `Has structured data (${input.structuredDataTypes.join(', ')})`
    : 'No structured data found';

  const ogTagsInfo = input.hasOgTags ? 'Has Open Graph tags' : 'Missing Open Graph tags';
  const canonicalInfo = input.hasCanonical ? 'Has canonical URL' : 'Missing canonical URL';

  return `You are an expert SEO/AEO (Answer Engine Optimization) auditor. Analyze this web page and provide a detailed assessment.

## Page Information

**URL**: ${input.url}
**Path**: ${input.path}
**Title**: ${input.title || 'MISSING'}
**Meta Description**: ${input.description || 'MISSING'}
**H1**: ${input.h1 || 'MISSING'}
**H2 Tags**: ${input.h2s.length > 0 ? input.h2s.slice(0, 5).join(', ') : 'None found'}
**Word Count**: ${input.wordCount}
**Images**: ${input.totalImages} total, ${input.imagesWithoutAlt} missing alt text
**Links**: ${input.internalLinks} internal, ${input.externalLinks} external, ${input.brokenLinks} broken
**Structured Data**: ${structuredDataInfo}
**Open Graph**: ${ogTagsInfo}
**Canonical**: ${canonicalInfo}

## Content Preview (first 500 chars)
${input.textContent.substring(0, 500)}...

## Your Task

Analyze this page and return a JSON response with the following structure:

\`\`\`json
{
  "scores": {
    "overall": 0-100,
    "seo": 0-100,
    "aeo": 0-100,
    "content": 0-100,
    "technical": 0-100
  },
  "analysis": {
    "strengths": [
      { "title": "string", "description": "string", "impact": "high|medium|low" }
    ],
    "issues": [
      { "title": "string", "description": "string", "impact": "high|medium|low" }
    ],
    "recommendations": [
      { "title": "string", "description": "string", "impact": "high|medium|low" }
    ],
    "aeoReadiness": {
      "score": 0-100,
      "status": "excellent|good|needs-improvement|poor",
      "factors": {
        "structuredData": 0-100,
        "contentClarity": 0-100,
        "answerability": 0-100,
        "semanticMarkup": 0-100
      }
    },
    "contentQuality": {
      "readabilityScore": 0-100,
      "uniquenessIndicator": "high|medium|low",
      "topicRelevance": 0-100,
      "keywordOptimization": 0-100
    }
  },
  "issues": [
    {
      "type": "missing_title|missing_description|missing_h1|multiple_h1|missing_alt_text|broken_link|missing_canonical|missing_og_tags|missing_structured_data|duplicate_content|thin_content|slow_loading|mobile_unfriendly|missing_viewport|blocked_by_robots|redirect_chain|mixed_content|missing_lang|other",
      "severity": "critical|warning|info",
      "message": "string",
      "fix": "string",
      "element": "optional CSS selector or element identifier"
    }
  ]
}
\`\`\`

## Scoring Guidelines

### Overall Score
- Weight: SEO (30%), AEO (30%), Content (25%), Technical (15%)

### SEO Score
- Title tag optimization (10%)
- Meta description (10%)
- H1 tag presence and quality (10%)
- Heading hierarchy (10%)
- Internal linking (15%)
- Image optimization (10%)
- URL structure (10%)
- Canonical tag (10%)
- Mobile friendliness (15%)

### AEO (Answer Engine Optimization) Score
- Structured data presence and quality (25%)
- Content clarity and answerability (25%)
- Semantic HTML usage (20%)
- FAQ/How-to content patterns (15%)
- Entity recognition readiness (15%)

### Content Score
- Word count sufficiency (20%)
- Content depth and comprehensiveness (30%)
- Readability (25%)
- Topic relevance (25%)

### Technical Score
- Meta tags completeness (25%)
- Structured data validity (25%)
- Link health (25%)
- Performance indicators (25%)

## Issue Severity Guidelines

**Critical** (must fix immediately):
- Missing title tag
- Missing H1
- Blocked by robots
- Broken internal links

**Warning** (should fix soon):
- Missing meta description
- Missing alt text on images
- Missing canonical
- Thin content (< 300 words)

**Info** (good to fix):
- Missing Open Graph tags
- Missing structured data
- Suboptimal heading structure

Provide 2-4 strengths, 2-5 issues, and 2-4 recommendations based on the page's actual content.`;
}

// ============================================================
// Batch Summary Prompt
// ============================================================

export function getAuditSummaryPrompt(
  projectName: string,
  domain: string,
  pageResults: Array<{
    url: string;
    overallScore: number;
    seoScore: number;
    aeoScore: number;
    issueCount: { critical: number; warning: number; info: number };
  }>
): string {
  const totalPages = pageResults.length;
  const avgOverall = Math.round(
    pageResults.reduce((sum, p) => sum + p.overallScore, 0) / totalPages
  );
  const avgSeo = Math.round(
    pageResults.reduce((sum, p) => sum + p.seoScore, 0) / totalPages
  );
  const avgAeo = Math.round(
    pageResults.reduce((sum, p) => sum + p.aeoScore, 0) / totalPages
  );
  const totalCritical = pageResults.reduce((sum, p) => sum + p.issueCount.critical, 0);
  const totalWarnings = pageResults.reduce((sum, p) => sum + p.issueCount.warning, 0);

  return `You are an expert SEO/AEO consultant. Generate an executive summary for this website audit.

## Website Audit Results

**Project**: ${projectName}
**Domain**: ${domain}
**Pages Audited**: ${totalPages}

### Scores
- Overall Average: ${avgOverall}/100
- SEO Average: ${avgSeo}/100
- AEO Average: ${avgAeo}/100

### Issues Found
- Critical: ${totalCritical}
- Warnings: ${totalWarnings}

### Top 5 Pages by Score
${pageResults
  .sort((a, b) => b.overallScore - a.overallScore)
  .slice(0, 5)
  .map((p, i) => `${i + 1}. ${p.url} - ${p.overallScore}/100`)
  .join('\n')}

### Bottom 5 Pages by Score
${pageResults
  .sort((a, b) => a.overallScore - b.overallScore)
  .slice(0, 5)
  .map((p, i) => `${i + 1}. ${p.url} - ${p.overallScore}/100`)
  .join('\n')}

## Your Task

Generate an executive summary in JSON format:

\`\`\`json
{
  "executiveSummary": "A 2-3 paragraph summary of the audit findings",
  "overallHealth": "excellent|good|needs-improvement|poor",
  "topPriorities": [
    { "title": "string", "description": "string", "impact": "high|medium|low", "effort": "low|medium|high" }
  ],
  "quickWins": [
    { "title": "string", "description": "string", "estimatedImpact": "string" }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"]
}
\`\`\`

Provide 3-5 top priorities, 3-5 quick wins, 3-5 strengths, and 3-5 weaknesses.`;
}

