/**
 * Prompts for Project AEO Scanner
 *
 * These prompts query LLMs with tracked user prompts to check brand visibility
 */

import type { ProjectScanContext, TrackedPromptInput } from './types';

// ============================================================
// Single Prompt Analysis
// Used to check if brand is mentioned for a specific user query
// ============================================================

export function getSinglePromptAnalysisPrompt(
  context: ProjectScanContext,
  trackedPrompt: TrackedPromptInput
): string {
  const locationContext = trackedPrompt.targetLocation
    ? `\n- Target Location: ${trackedPrompt.targetLocation}`
    : '';

  return `You are simulating how you (an AI assistant) would naturally respond to a user query.

**User Query:** "${trackedPrompt.prompt}"

**Brand to Track:**
- Name: ${context.brandName}
- Website: ${context.websiteUrl}
- Industry: ${context.industry}${locationContext}
- Known Competitors: ${context.competitors.slice(0, 5).join(', ')}

**Your Task:**
1. Generate a natural response to the user query as if you were answering it
2. Analyze: Would you mention "${context.brandName}" in your response?
3. If yes, where would it appear (1st recommendation, 2nd, etc.)?
4. Which competitors would you mention?

Return your analysis as JSON:

{
  "prompt": "${trackedPrompt.prompt}",
  "brandMentioned": <true/false>,
  "mentionPosition": <1-10 if mentioned, null if not>,
  "mentionContext": "<exact sentence where brand would be mentioned, or null>",
  "responseSnippet": "<first 100 chars of how you'd naturally respond>",
  "competitors": [
    {
      "name": "<competitor name>",
      "position": <1-10>,
      "context": "<how you'd describe them>"
    }
  ],
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": <0-100>,
  "confidence": <1-10>
}

**Guidelines:**
- Be HONEST - if you wouldn't naturally mention this brand, say so
- mentionPosition: 1 = first recommendation, 2 = second, etc.
- Most brands won't be mentioned unless well-known in the space
- Include only competitors you would ACTUALLY mention in your response

Return ONLY valid JSON.`;
}

// ============================================================
// Rich Prompt Analysis (AEO-Report Style)
// Returns comprehensive data for a single prompt: sentiment, positioning, insights
// ============================================================

export function getRichPromptAnalysisPrompt(
  context: ProjectScanContext,
  trackedPrompt: TrackedPromptInput,
  provider: 'chatgpt' | 'perplexity' | 'gemini'
): string {
  const locationContext = trackedPrompt.targetLocation
    ? `\n- Target Location: ${trackedPrompt.targetLocation}`
    : '';

  const contextKeywords = context.contextKeywords?.length
    ? `\n- Context Keywords: ${context.contextKeywords.slice(0, 10).join(', ')}`
    : '';

  // Provider-specific instructions
  const providerInstructions = {
    chatgpt: `You are ChatGPT. Analyze how YOU (ChatGPT) would respond to this query based on your training data and knowledge graph.`,
    perplexity: `You are Perplexity. Analyze how YOU (Perplexity) would respond to this query based on your search capabilities and real-time data.`,
    gemini: `You are Gemini. Analyze how YOU (Gemini) would respond to this query based on your training data and knowledge.`,
  };

  // Provider-specific sentiment categories
  const sentimentCategories = {
    chatgpt: [
      { category: 'General', description: 'How ChatGPT describes this brand in general conversations' },
      { category: 'Professional', description: 'How ChatGPT describes this brand in professional/business contexts' },
      { category: 'Technical', description: 'How ChatGPT describes technical capabilities and expertise' },
    ],
    perplexity: [
      { category: 'Search Results', description: 'How this brand appears in search results' },
      { category: 'Source Quality', description: 'Quality of sources mentioning this brand' },
      { category: 'Recency', description: 'How recent and up-to-date information is' },
    ],
    gemini: [
      { category: 'General', description: 'How Gemini describes this brand in general conversations' },
      { category: 'Professional', description: 'How Gemini describes this brand in professional/business contexts' },
      { category: 'Technical', description: 'How Gemini describes technical capabilities and expertise' },
    ],
  };

  const categories = sentimentCategories[provider];

  return `IMPORTANT: You MUST respond with ONLY a JSON object. No introductory text, no explanations, no markdown - just pure JSON starting with { and ending with }.

${providerInstructions[provider]}

**User Query:** "${trackedPrompt.prompt}"

**Brand Being Tracked:**
- Name: ${context.brandName}
- Website: ${context.websiteUrl}
- Industry: ${context.industry}
- Target Audience: ${context.targetAudience}${locationContext}
- Known Competitors: ${context.competitors.slice(0, 8).join(', ')}${contextKeywords}

**Your Task:**
1. Generate a natural, complete response to the user query as if you were answering it
2. Analyze how you would mention ${context.brandName} (if at all)
3. Provide comprehensive sentiment analysis, brand recognition, positioning, and insights

Return your analysis in this EXACT JSON structure:

{
  "prompt": "${trackedPrompt.prompt}",
  "fullResponse": "<Complete, natural response to the user query (500-1000 words). This is how you would actually respond.>",
  "brandMentioned": <true/false>,
  "mentionPosition": <1-10 if mentioned, null if not>,
  "mentionContext": "<exact sentence where brand would be mentioned, or null>",

  "llmProvider": {
    "name": "${provider === 'chatgpt' ? 'ChatGPT' : provider === 'perplexity' ? 'Perplexity' : 'Gemini'}",
    "logo": "/icons/${provider === 'chatgpt' ? 'openai' : provider === 'perplexity' ? 'perplexity' : 'gemini'}.svg",
    "score": <number 0-100>,
    "status": "excellent" | "good" | "average" | "needs-improvement",
    "trend": "up" | "down" | "stable"
  },

  "brandRecognition": {
    "provider": "${provider === 'chatgpt' ? 'ChatGPT' : provider === 'perplexity' ? 'Perplexity' : 'Gemini'}",
    "logo": "/icons/${provider === 'chatgpt' ? 'openai' : provider === 'perplexity' ? 'perplexity' : 'gemini'}.svg",
    "score": <number 0-100>,
    "marketPosition": "Niche" | "Emerging" | "Established" | "Leader",
    "brandArchetype": "<Innovator | Expert | Challenger | Partner | etc>",
    "confidenceLevel": <number 0-100>,
    "mentionDepth": <number 1-10>,
    "sourceQuality": <number 1-10>,
    "dataRichness": <number 1-10>
  },

  "sentimentAnalysis": {
    "provider": "${provider === 'chatgpt' ? 'ChatGPT' : provider === 'perplexity' ? 'Perplexity' : 'Gemini'}",
    "totalScore": <number 0-100>,
    "polarization": <number 0-100>,
    "reliableData": <boolean>,
    "metrics": [
      {
        "category": "${categories[0].category}",
        "score": <number 0-100>,
        "description": "<${categories[0].description}>",
        "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
      },
      {
        "category": "${categories[1].category}",
        "score": <number 0-100>,
        "description": "<${categories[1].description}>",
        "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
      },
      {
        "category": "${categories[2].category}",
        "score": <number 0-100>,
        "description": "<${categories[2].description}>",
        "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
      }
    ]
  },

  "brandPositioning": {
    "xAxisLabel": {
      "low": "Budget-Friendly",
      "high": "Enterprise-Grade"
    },
    "yAxisLabel": {
      "low": "Traditional",
      "high": "AI-Innovative"
    },
    "positions": [
      { "name": "${context.brandName}", "x": <0-100>, "y": <0-100>, "isYourBrand": true },
      { "name": "<Competitor 1>", "x": <0-100>, "y": <0-100> },
      { "name": "<Competitor 2>", "x": <0-100>, "y": <0-100> },
      { "name": "<Competitor 3>", "x": <0-100>, "y": <0-100> },
      { "name": "<Competitor 4>", "x": <0-100>, "y": <0-100> },
      { "name": "<Competitor 5>", "x": <0-100>, "y": <0-100> }
    ]
  },

  "competitors": [
    {
      "name": "<competitor name>",
      "domain": "<competitor domain or null>",
      "position": <1-10>,
      "context": "<how you'd describe them>",
      "shareOfVoice": <percentage 0-100>
    }
  ],

  "marketCompetition": [
    {
      "title": "<Market Segment 1 - e.g., 'IT Staff Augmentation', 'Cloud Hosting', 'E-commerce Platforms'>",
      "queries": <number of relevant queries>,
      "totalMentions": <total brand mentions in this segment>,
      "data": [
        { "name": "${context.brandName}", "value": <percentage>, "color": "#3b82f6" },
        { "name": "<Competitor 1>", "value": <percentage>, "color": "#8b5cf6" },
        { "name": "<Competitor 2>", "value": <percentage>, "color": "#ec4899" },
        { "name": "<Competitor 3>", "value": <percentage>, "color": "#f59e0b" },
        { "name": "Other", "value": <percentage>, "color": "#6b7280" }
      ],
      "keyFactors": ["<key success factor 1>", "<key success factor 2>", "<key success factor 3>"]
    },
    {
      "title": "<Market Segment 2 - e.g., 'Custom Software Development', 'SaaS Solutions'>",
      "queries": <number of relevant queries>,
      "totalMentions": <total brand mentions in this segment>,
      "data": [
        { "name": "${context.brandName}", "value": <percentage>, "color": "#3b82f6" },
        { "name": "<Competitor 1>", "value": <percentage>, "color": "#8b5cf6" },
        { "name": "<Competitor 2>", "value": <percentage>, "color": "#ec4899" },
        { "name": "<Competitor 3>", "value": <percentage>, "color": "#f59e0b" },
        { "name": "Other", "value": <percentage>, "color": "#6b7280" }
      ],
      "keyFactors": ["<key success factor 1>", "<key success factor 2>", "<key success factor 3>"]
    },
    {
      "title": "<Market Segment 3 - e.g., 'Cloud & DevOps Services', 'AI/ML Solutions'>",
      "queries": <number of relevant queries>,
      "totalMentions": <total brand mentions in this segment>,
      "data": [
        { "name": "${context.brandName}", "value": <percentage>, "color": "#3b82f6" },
        { "name": "<Competitor 1>", "value": <percentage>, "color": "#8b5cf6" },
        { "name": "<Competitor 2>", "value": <percentage>, "color": "#ec4899" },
        { "name": "<Competitor 3>", "value": <percentage>, "color": "#f59e0b" },
        { "name": "Other", "value": <percentage>, "color": "#6b7280" }
      ],
      "keyFactors": ["<key success factor 1>", "<key success factor 2>", "<key success factor 3>"]
    }
  ],

  "analysisSummary": {
    "strengths": [
      {
        "title": "<What the brand does well in AI responses for this prompt>",
        "description": "<Specific evidence from the AI response - e.g., 'Brand is mentioned in position #2 for feature X', 'AI highlights brand's unique Y capability'>"
      }
    ],
    "opportunities": [
      {
        "title": "Write: <Specific blog post topic> OR Update: <Specific page to improve>",
        "description": "<Actionable content to create or page to update - e.g., 'Write a 2000+ word guide on [specific topic] targeting [specific keywords]' OR 'Update the [page name] to include [specific content] to rank for this query'>"
      }
    ],
    "marketTrajectory": {
      "status": "positive" | "negative" | "neutral",
      "description": "<Overall market trajectory analysis for this specific prompt>"
    }
  },

  "narrativeThemes": [
    "<Theme 1: How AI describes this brand for this prompt>",
    "<Theme 2: Common narrative>",
    "<Theme 3: Positioning statement>"
  ],

  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": <0-100>
}

**Critical Requirements:**
- ✅ Generate a COMPLETE, natural response (500-1000 words) - this is critical for the Mentions tab
- ✅ Analyze ONLY your (${provider}) perspective
- ✅ Be realistic - most brands score 40-70
- ✅ Include 5-6 competitor positions on the positioning map
- ✅ Include 3 sentiment metrics with detailed descriptions
- ✅ **STRENGTHS** (2-4): What ${context.brandName} does well in AI responses - be SPECIFIC:
  - "Mentioned in position #X for [topic]"
  - "AI highlights [specific feature/benefit]"
  - "Strong narrative around [specific value prop]"
- ✅ **OPPORTUNITIES** (2-4): Actionable content or page updates - be SPECIFIC:
  - Start with "Write:" for blog content: "Write: Complete Guide to [Topic] - 2000+ word article targeting [keywords]"
  - Start with "Update:" for page improvements: "Update: [Page Name] to add [specific content] for this query"
  - NO generic business advice like "Enterprise Partnerships" or "Market Expansion"
- ✅ Include 3-5 narrative themes
- ✅ **MUST include EXACTLY 3 market segments** with industry-specific titles (e.g., "IT Staff Augmentation", "Custom Software Development", "Cloud & DevOps Services")
- ✅ Each market segment needs unique title, key factors, and share of voice data that adds up to 100%

⚠️ CRITICAL: Your response MUST be valid JSON only. Start with { and end with }. No text before or after the JSON. No apologies, no explanations, no markdown code blocks - ONLY the raw JSON object.`;
}

// ============================================================
// Batch Prompt Analysis
// Analyze multiple prompts in one query (more efficient)
// ============================================================

export function getBatchPromptAnalysisPrompt(
  context: ProjectScanContext,
  prompts: TrackedPromptInput[]
): string {
  const promptsList = prompts.slice(0, 5).map((p, i) =>
    `${i + 1}. "${p.prompt}"${p.targetLocation ? ` (${p.targetLocation})` : ''}`
  ).join('\n');

  const contextKeywords = context.contextKeywords?.length
    ? `\n- Context Keywords: ${context.contextKeywords.slice(0, 10).join(', ')}`
    : '';

  return `You are simulating how AI assistants naturally respond to user queries.

**Brand Being Tracked:**
- Name: ${context.brandName}
- Website: ${context.websiteUrl}
- Industry: ${context.industry}
- Target Audience: ${context.targetAudience}
- Known Competitors: ${context.competitors.slice(0, 8).join(', ')}${contextKeywords}

**User Queries to Analyze:**
${promptsList}

**Your Task:**
For EACH query, simulate how you would naturally respond and check if ${context.brandName} would be mentioned.

Return JSON:

{
  "results": [
    {
      "prompt": "<the user query>",
      "brandMentioned": <true/false>,
      "mentionPosition": <1-10 if mentioned, null if not>,
      "mentionContext": "<sentence where brand mentioned, or null>",
      "responseSnippet": "<brief snippet of natural response>",
      "topCompetitors": [
        { "name": "<name>", "position": <1-5> }
      ],
      "sentiment": "positive" | "neutral" | "negative",
      "sentimentScore": <0-100>
    }
  ],
  "overallBrandVisibility": <0-100>,
  "keyInsights": [
    "<insight about brand visibility>",
    "<insight about competitor landscape>",
    "<actionable recommendation>"
  ]
}

**Critical Guidelines:**
- Be REALISTIC - most brands aren't mentioned unless truly relevant
- mentionPosition: 1 = first recommendation, null = not mentioned
- Include actual competitors you would mention in natural responses
- overallBrandVisibility: % of queries where brand WOULD be mentioned

Return ONLY valid JSON.`;
}

// ============================================================
// Opportunity Generation Prompt
// Generate opportunities from scan results with rich context
// ============================================================

/**
 * Extended project context for richer opportunity generation
 * Includes vectorized data from RAG system
 */
export interface EnrichedProjectContext {
  // From Project
  brandName: string;
  websiteUrl: string;
  industry: string;
  targetAudience: string;

  // From websiteContext (LLM-generated)
  icp?: string; // Ideal Customer Profile
  valueProposition?: string;

  // From vectorized history (RAG)
  recentStrengths?: Array<{ title: string; description: string }>;
  recentOpportunities?: Array<{ title: string; description: string }>;
  narrativeThemes?: string[];

  // From competitor insights
  competitorStrengths?: string[];
  competitorWeaknesses?: string[];
}

export function getOpportunityGenerationPrompt(
  context: ProjectScanContext,
  scanSummary: {
    visibilityScore: number;
    mentionRate: number;
    topKeywords: string[];
    lowVisibilityKeywords: string[];
    topCompetitors: Array<{ name: string; mentionCount: number }>;
    sentimentAverage: number;
  },
  enrichedContext?: EnrichedProjectContext
): string {
  // Get prompts for context
  const trackedPromptsText = context.trackedPrompts.slice(0, 5).map(p => p.prompt).join(', ');
  const contextKeywordsText = context.contextKeywords?.slice(0, 10).join(', ') || 'N/A';

  // Build enriched context sections
  const icpSection = enrichedContext?.icp
    ? `\n- Ideal Customer Profile (ICP): ${enrichedContext.icp}`
    : '';

  const valuePropositionSection = enrichedContext?.valueProposition
    ? `\n- Value Proposition: ${enrichedContext.valueProposition}`
    : '';

  const recentStrengthsSection = enrichedContext?.recentStrengths?.length
    ? `\n\n**Recent Brand Strengths (from past scans):**\n${enrichedContext.recentStrengths.map(s => `- ${s.title}: ${s.description}`).join('\n')}`
    : '';

  const recentOpportunitiesSection = enrichedContext?.recentOpportunities?.length
    ? `\n\n**Previously Identified Opportunities (avoid duplicates):**\n${enrichedContext.recentOpportunities.map(o => `- ${o.title}`).join('\n')}`
    : '';

  const narrativeThemesSection = enrichedContext?.narrativeThemes?.length
    ? `\n- AI Narrative Themes: ${enrichedContext.narrativeThemes.join(', ')}`
    : '';

  const competitorInsightsSection = (enrichedContext?.competitorStrengths?.length || enrichedContext?.competitorWeaknesses?.length)
    ? `\n\n**Competitor Intelligence:**${
        enrichedContext.competitorStrengths?.length
          ? `\n- Competitor Strengths to Counter: ${enrichedContext.competitorStrengths.join(', ')}`
          : ''
      }${
        enrichedContext.competitorWeaknesses?.length
          ? `\n- Competitor Weaknesses to Exploit: ${enrichedContext.competitorWeaknesses.join(', ')}`
          : ''
      }`
    : '';

  return `IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, just the JSON object.

You are an AEO (Answer Engine Optimization) strategist and content marketing expert. Based on the comprehensive context below, generate highly actionable opportunities for ${context.brandName}.

**Brand Context:**
- Name: ${context.brandName}
- Website: ${context.websiteUrl}
- Industry: ${context.industry}
- Target Audience: ${context.targetAudience}${icpSection}${valuePropositionSection}${narrativeThemesSection}
- Tracked queries: ${trackedPromptsText}
- Context keywords: ${contextKeywordsText}

**Scan Results Summary:**
- Overall Visibility Score: ${scanSummary.visibilityScore}/100
- Brand Mention Rate: ${scanSummary.mentionRate}% of queries
- Average Sentiment: ${scanSummary.sentimentAverage}/100
- Top performing keywords: ${scanSummary.topKeywords.join(', ')}
- Low visibility keywords: ${scanSummary.lowVisibilityKeywords.join(', ')}
- Top competitors appearing: ${scanSummary.topCompetitors.map(c => `${c.name} (${c.mentionCount}x)`).join(', ')}${recentStrengthsSection}${recentOpportunitiesSection}${competitorInsightsSection}

**Generate 4-6 Strategic Opportunities:**

There are ONLY 2 types of opportunities:
1. **CONTENT** - Write long-form blog content (2000+ words) to improve visibility
2. **ACTION** - Take a specific action to improve an existing page or fix an issue

Return JSON with opportunities. Each opportunity has a **title** and detailed **instructions** in markdown format:

{
  "opportunities": [
    {
      "type": "CONTENT",
      "title": "Create: [Specific Topic Title]",
      "priority": 8,
      "impact": "high",
      "relatedKeywords": ["keyword1", "keyword2", "keyword3"],
      "instructions": "# [Content Title - The H1 headline for the blog post]\\n\\n## Overview\\n[2-3 sentences on what this content should achieve]\\n\\n## Target Keywords\\n- Primary: [main keyword]\\n- Secondary: [keyword 2], [keyword 3]\\n\\n## Content Structure\\n1. **Introduction** - [what to cover]\\n2. **[Section Title]** - [what to cover]\\n3. **[Section Title]** - [what to cover]\\n4. **[Section Title]** - [what to cover]\\n5. **Conclusion** - [key takeaways + CTA]\\n\\n## Tone & Style\\n- [tone guidance]\\n- [style guidelines]\\n\\n## Key Points to Include\\n- [important point 1]\\n- [important point 2]\\n- [important point 3]\\n\\n## Word Count\\n2000-2500 words"
    },
    {
      "type": "ACTION",
      "title": "Update: [Page Name] - [What to Improve]",
      "priority": 7,
      "impact": "medium",
      "relatedKeywords": ["keyword1", "keyword2"],
      "instructions": "## Page to Update\\n[Specific URL or page name]\\n\\n## Current Issue\\n[What's wrong with the current page]\\n\\n## Required Changes\\n1. [Specific change 1 with details]\\n2. [Specific change 2 with details]\\n3. [Specific change 3 with details]\\n\\n## Expected Outcome\\n[How this will improve AI visibility]\\n\\n## Estimated Effort\\n[low/medium/high]\\n\\n## Success Metrics\\n[How to measure if this worked]"
    }
  ]
}

**CONTENT Opportunities - CRITICAL REQUIREMENTS:**
- The **instructions** field MUST start with a markdown H1 (# Title) that will be the content title/headline
- Include a comprehensive outline with 5+ sections
- Specify target keywords (primary and secondary)
- Include tone and style guidance
- List key points that MUST be covered
- Recommend word count (typically 2000-2500 words)
- Make instructions comprehensive enough for a writer to start immediately

**ACTION Opportunities - CRITICAL REQUIREMENTS:**
- Be specific about which page to update (URL or page name)
- List 3+ exact changes required with implementation details
- Include success metrics to measure improvement
- Estimate the effort level

**Priority Guidelines:**
- 9-10: Critical, needs immediate action (major visibility gaps)
- 7-8: High priority, act within a week
- 5-6: Medium priority, plan for next month
- 1-4: Low priority, backlog

**Quality Checks:**
- Each opportunity must have detailed, actionable instructions
- Instructions should be in clean markdown format with proper headings
- For CONTENT type: Always start with the H1 content title
- Avoid generic advice - be specific to ${context.brandName}'s situation

Generate a mix of CONTENT and ACTION opportunities based on the scan data.
Return ONLY valid JSON. Do not wrap in markdown code blocks.`;
}

// ============================================================
// Provider Configuration
// ============================================================

export const SCANNER_PROVIDERS = {
  chatgpt: {
    name: 'ChatGPT',
    model: 'openai/gpt-5-mini',
    enabled: true,
  },
  perplexity: {
    name: 'Perplexity',
    model: 'perplexity/sonar',
    enabled: true,
  },
  gemini: {
    name: 'Gemini',
    model: 'google/gemini-2.5-flash',
    enabled: true,
  },
  claude: {
    name: 'Claude',
    model: 'anthropic/claude-sonnet-4-5',
    enabled: false, // Optional, more expensive
  },
} as const;

