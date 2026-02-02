/**
 * Prompts for AEO Report Generation
 * Each LLM provider gets specialized prompts for their strengths
 */

// ============================================================
// Business Vertical Labels
// ============================================================

const VERTICAL_LABELS: Record<string, string> = {
  saas: 'SaaS / Software',
  ecommerce: 'E-commerce / Retail',
  agency: 'Agency / Consulting',
  fintech: 'Fintech / Finance',
  healthcare: 'Healthcare / Medical',
  education: 'Education / EdTech',
  media: 'Media / Publishing',
  travel: 'Travel / Hospitality',
  realestate: 'Real Estate',
  manufacturing: 'Manufacturing / Industrial',
  nonprofit: 'Non-profit / NGO',
  other: 'Other',
};

function getVerticalLabel(vertical: string): string {
  return VERTICAL_LABELS[vertical] || vertical;
}

// ============================================================
// ChatGPT Prompt - Brand Recognition & Sentiment
// ============================================================

export function getChatGPTPrompt(domain: string, vertical?: string): string {
  const verticalContext = vertical
    ? `\n\n**Business Context**: This is a ${getVerticalLabel(vertical)} company. Analyze them within this industry context and compare with competitors in the same vertical.`
    : '';

  return `You are an Answer Engine Optimization (AEO) expert. Analyze how ChatGPT (you) would respond to queries about this brand.

Analyze the domain: ${domain}${verticalContext}

**Your task**: Analyze ONLY how ChatGPT handles queries about this brand based on your training data and knowledge graph.

Provide your analysis in this EXACT JSON structure:

{
  "llmProviders": [
    {
      "name": "ChatGPT",
      "logo": "/icons/openai.svg",
      "score": <number 0-100>,
      "status": "excellent" | "good" | "average" | "needs-improvement",
      "trend": "up" | "down" | "stable"
    }
  ],
  "brandRecognition": [
    {
      "provider": "ChatGPT",
      "logo": "/icons/openai.svg",
      "score": <number 0-100>,
      "marketPosition": "Niche" | "Emerging" | "Established" | "Leader",
      "brandArchetype": "<Innovator | Expert | Challenger | Partner | etc>",
      "confidenceLevel": <number 0-100>,
      "mentionDepth": <number 1-10>,
      "sourceQuality": <number 1-10>,
      "dataRichness": <number 1-10>
    }
  ],
  "sentimentAnalysis": [
    {
      "provider": "ChatGPT",
      "totalScore": <number 0-100>,
      "polarization": <number 0-100>,
      "reliableData": <boolean>,
      "metrics": [
        {
          "category": "General",
          "score": <number 0-100>,
          "description": "<How ChatGPT describes this brand in general conversations>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Professional",
          "score": <number 0-100>,
          "description": "<How ChatGPT describes this brand in professional/business contexts>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Technical",
          "score": <number 0-100>,
          "description": "<How ChatGPT describes technical capabilities and expertise>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        }
      ]
    }
  ],
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
      { "name": "${domain}", "domain": "${domain}", "x": <0-100>, "y": <0-100>, "isYourBrand": true },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> }
    ]
  }
}

**Scoring Guidelines:**

1. **LLM Provider Score (0-100)**: How well ChatGPT can answer questions about this brand
   - 80-100: Excellent - Rich, detailed knowledge in training data
   - 60-79: Good - Solid knowledge, can provide helpful information
   - 40-59: Average - Basic knowledge, limited details
   - 0-39: Poor - Very limited or no knowledge

2. **Brand Recognition**: How well you know and can describe this brand
   - **marketPosition**: Your assessment of their market standing
   - **brandArchetype**: The primary role/identity you associate with them
   - **confidenceLevel**: How certain you are (0-100)
   - **mentionDepth**: How detailed your knowledge is (1-10)
   - **sourceQuality**: Quality of your training data about them (1-10)
   - **dataRichness**: Amount of information you have (1-10)

3. **Sentiment Analysis**: Tone and context in your responses about this brand
   - **totalScore**: Overall sentiment (0=very negative, 50=neutral, 100=very positive)
   - **polarization**: How varied opinions are (0=consistent, 100=very mixed)
   - **reliableData**: Whether you have enough data for confident analysis
   - **metrics**: Three categories analyzing different aspects

4. **Brand Positioning**: Where you place this brand relative to competitors
   - X-axis: Cost/scale (0=budget-friendly, 100=enterprise-grade)
   - Y-axis: Innovation (0=traditional, 100=AI-innovative)
   - Include 5-6 REAL competitors with their actual brand names and website domains
   - Use actual competitor names like "Salesforce", "HubSpot", "Monday.com" - NOT "Competitor 1", "Competitor 2", etc.

**Critical Requirements:**
- ✅ Analyze ONLY ChatGPT's perspective (not other AI platforms)
- ✅ Base analysis on YOUR training data and knowledge graph
- ✅ Be realistic - most brands score 40-70
- ✅ Set low confidenceLevel if you have limited knowledge
- ✅ ALL arrays must have exactly 1 item (for ChatGPT only)
- ✅ Include 3 sentiment metrics (General, Professional, Technical)
- ✅ Include 5-6 competitor positions with REAL brand names and domains (NOT "Competitor 1", "Competitor 2")

Return ONLY valid JSON, no markdown, no additional text.`;
}

// ============================================================
// Perplexity Prompt - Market Competition & Positioning
// ============================================================

export function getPerplexityPrompt(domain: string, vertical?: string): string {
  const verticalContext = vertical
    ? `\n\n**Business Context**: This is a ${getVerticalLabel(vertical)} company. Analyze them within this industry context and compare with competitors in the same vertical.`
    : '';

  return `You are an Answer Engine Optimization (AEO) expert. Analyze how Perplexity (you) would respond to queries about this brand.

Analyze the domain: ${domain}${verticalContext}

**Your task**: Analyze ONLY how Perplexity handles queries about this brand based on your search capabilities and real-time data.

Provide your analysis in this EXACT JSON structure:

{
  "llmProviders": [
    {
      "name": "Perplexity",
      "logo": "/icons/perplexity.svg",
      "score": <number 0-100>,
      "status": "excellent" | "good" | "average" | "needs-improvement",
      "trend": "up" | "down" | "stable"
    }
  ],
  "brandRecognition": [
    {
      "provider": "Perplexity",
      "logo": "/icons/perplexity.svg",
      "score": <number 0-100>,
      "marketPosition": "Niche" | "Emerging" | "Established" | "Leader",
      "brandArchetype": "<Innovator | Expert | etc>",
      "confidenceLevel": <number 0-100>,
      "mentionDepth": <number 1-10>,
      "sourceQuality": <number 1-10>,
      "dataRichness": <number 1-10>
    }
  ],
  "sentimentAnalysis": [
    {
      "provider": "Perplexity",
      "totalScore": <number 0-100>,
      "polarization": <number 0-100>,
      "reliableData": <boolean>,
      "metrics": [
        {
          "category": "Search Results",
          "score": <number 0-100>,
          "description": "<How this brand appears in search results>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Source Quality",
          "score": <number 0-100>,
          "description": "<Quality of sources mentioning this brand>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Recency",
          "score": <number 0-100>,
          "description": "<How recent and up-to-date information is>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        }
      ]
    }
  ],
  "marketCompetition": [
    {
      "title": "<Market Segment Name>",
      "queries": <number of queries analyzed>,
      "totalMentions": <total brand mentions>,
      "data": [
        { "name": "Your Brand", "value": <percentage>, "color": "#3b82f6" },
        { "name": "<Real Competitor Brand>", "value": <percentage>, "color": "#8b5cf6" },
        { "name": "<Real Competitor Brand>", "value": <percentage>, "color": "#ec4899" },
        { "name": "<Real Competitor Brand>", "value": <percentage>, "color": "#f59e0b" },
        { "name": "<Real Competitor Brand>", "value": <percentage>, "color": "#10b981" },
        { "name": "Other", "value": <percentage>, "color": "#6b7280" }
      ],
      "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
    }
    // ... 2-3 market segments
  ],
  "brandPositioning": {
    "xAxisLabel": {
      "low": "<Budget-Friendly | Small Scale | etc>",
      "high": "<Enterprise-Grade | Large Scale | etc>"
    },
    "yAxisLabel": {
      "low": "<Traditional | Basic | etc>",
      "high": "<Modern | Advanced | etc>"
    },
    "positions": [
      { "name": "${domain}", "domain": "${domain}", "x": <0-100>, "y": <0-100>, "isYourBrand": true },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> }
      // ... 5-8 competitors with REAL brand names and domains
    ]
  }
}

**Analysis Guidelines:**

1. **Market Segments**: Identify 2-3 key market segments where this brand competes
   - Segments should be specific (e.g., "Cloud Hosting", "E-commerce Platforms")
   - Estimate mention share based on typical AI search results
   - Use REAL competitor names like "Salesforce", "HubSpot" - NOT "Competitor 1", "Competitor 2"

2. **Brand Positioning Chart**:
   - X-axis: Cost/scale dimension (budget to enterprise)
   - Y-axis: Innovation dimension (traditional to modern)
   - Place the brand and 5-8 REAL competitors on this 2D space
   - Use actual brand names and their website domains
   - Position should reflect how AI search results describe them

3. **Key Factors**: List 3-5 factors that determine success in each segment

**Important**:
1. Identify REAL competitors that appear alongside this brand in AI search results - use actual brand names NOT "Competitor 1", "Competitor 2", etc.
2. Include the domain (e.g., "salesforce.com", "hubspot.com") for each competitor
3. Market share percentages should add up to 100%
4. Use descriptive axis labels that make sense for this industry
5. Be realistic about positioning

Return ONLY the JSON object, no additional text.`;
}

// ============================================================
// Gemini Prompt - Strategic Insights & Content Ideas
// ============================================================

export function getGeminiPrompt(domain: string, vertical?: string): string {
  const verticalContext = vertical
    ? `\n\n**Business Context**: This is a ${getVerticalLabel(vertical)} company. Analyze them within this industry context and compare with competitors in the same vertical.`
    : '';

  return `You are an Answer Engine Optimization (AEO) expert. Analyze how Gemini (you) would respond to queries about this brand.

Analyze the domain: ${domain}${verticalContext}

**Your task**: Analyze ONLY how Gemini handles queries about this brand based on your training data and knowledge.

Provide your analysis in this EXACT JSON structure:

{
  "llmProviders": [
    {
      "name": "Gemini",
      "logo": "/icons/gemini.svg",
      "score": <number 0-100>,
      "status": "excellent" | "good" | "average" | "needs-improvement",
      "trend": "up" | "down" | "stable"
    }
  ],
  "brandRecognition": [
    {
      "provider": "Gemini",
      "logo": "/icons/gemini.svg",
      "score": <number 0-100>,
      "marketPosition": "Niche" | "Emerging" | "Established" | "Leader",
      "brandArchetype": "<Innovator | Expert | Challenger | Partner | etc>",
      "confidenceLevel": <number 0-100>,
      "mentionDepth": <number 1-10>,
      "sourceQuality": <number 1-10>,
      "dataRichness": <number 1-10>
    }
  ],
  "sentimentAnalysis": [
    {
      "provider": "Gemini",
      "totalScore": <number 0-100>,
      "polarization": <number 0-100>,
      "reliableData": <boolean>,
      "metrics": [
        {
          "category": "General",
          "score": <number 0-100>,
          "description": "<How Gemini describes this brand in general conversations>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Professional",
          "score": <number 0-100>,
          "description": "<How Gemini describes this brand in professional/business contexts>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        },
        {
          "category": "Technical",
          "score": <number 0-100>,
          "description": "<How Gemini describes technical capabilities and expertise>",
          "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
        }
      ]
    }
  ],
  "analysisSummary": {
    "strengths": [
      {
        "title": "<Strength title>",
        "description": "<Detailed description of this strength and why it matters>"
      }
      // ... EXACTLY 4 strengths (REQUIRED)
    ],
    "opportunities": [
      {
        "title": "<Opportunity title>",
        "description": "<Detailed description and how to capitalize on it>"
      }
      // ... EXACTLY 4 opportunities (REQUIRED)
    ],
    "marketTrajectory": {
      "status": "positive" | "negative" | "neutral",
      "description": "<Overall market trajectory analysis>"
    }
  },
  "narrativeThemes": [
    "<Theme 1: How AI describes this brand>",
    "<Theme 2: Common narrative>",
    "<Theme 3: Positioning statement>",
    // ... 5-8 themes
  ],
  "contentIdeas": [
    {
      "title": "<Content title>",
      "description": "<Why this content will improve AEO visibility>",
      "category": "Guide" | "Case Study" | "Blog Post" | "Social Media" | "Video",
      "priority": "high" | "medium" | "low",
      "topics": ["<topic 1>", "<topic 2>", "<topic 3>"]
    }
    // ... 4-6 content ideas
  ],
  "brandPositioning": {
    "xAxisLabel": {
      "low": "<Budget-Friendly | Small Scale | etc>",
      "high": "<Enterprise-Grade | Large Scale | etc>"
    },
    "yAxisLabel": {
      "low": "<Traditional | Basic | etc>",
      "high": "<AI-Innovative | Advanced | etc>"
    },
    "positions": [
      { "name": "${domain}", "domain": "${domain}", "x": <0-100>, "y": <0-100>, "isYourBrand": true },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> },
      { "name": "<Real Brand Name>", "domain": "<competitor-domain.com>", "x": <0-100>, "y": <0-100> }
      // ... 5-8 competitors with REAL brand names and domains based on how Gemini perceives the competitive landscape
    ]
  }
}

**Scoring Guidelines:**

1. **LLM Provider Score (0-100)**: How well Gemini can answer questions about this brand
   - 80-100: Excellent - Rich, detailed knowledge in training data
   - 60-79: Good - Solid knowledge, can provide helpful information
   - 40-59: Average - Basic knowledge, limited details
   - 0-39: Poor - Very limited or no knowledge

2. **Brand Recognition**: How well you know and can describe this brand
   - **marketPosition**: Your assessment of their market standing
   - **brandArchetype**: The primary role/identity you associate with them
   - **confidenceLevel**: How confident you are in your knowledge (0-100%)
   - **mentionDepth**: How deeply you discuss this brand (1-10 scale)
   - **sourceQuality**: Quality of your training data sources (1-10 scale)
   - **dataRichness**: Breadth of information available (1-10 scale)

3. **Sentiment Analysis**: How positively/negatively you describe this brand
   - **totalScore**: Overall sentiment (0-100, where 50 is neutral)
   - **polarization**: How divided opinions are (0-100, where 0 is unanimous)
   - **reliableData**: Whether you have enough data for reliable assessment
   - **metrics**: Three categories of sentiment analysis

4. **Strengths**: Identify EXACTLY 4 key strengths based on:
   - How AI search engines currently describe the brand
   - Unique value propositions that stand out
   - Competitive advantages
   - Market positioning and brand recognition

5. **Opportunities**: Identify EXACTLY 4 growth opportunities:
   - Content gaps where competitors dominate
   - Emerging topics in the industry
   - Ways to improve AI search visibility
   - Strategic positioning improvements

6. **Market Trajectory**: Overall assessment of brand direction
   - "positive": Growing visibility, strong positioning
   - "neutral": Stable but room for growth
   - "negative": Declining or weak visibility

7. **Narrative Themes**: 5-8 common themes about how AI describes this brand
   - Look for repeated phrases and concepts
   - Identify the brand archetype
   - Note positioning statements

8. **Content Ideas**: 4-6 strategic content recommendations
   - Prioritize ideas that will improve AI search visibility
   - Focus on topics where the brand can establish authority
   - Mix formats (guides, case studies, blog posts, etc.)
   - "high" priority: Will significantly impact visibility
   - "medium" priority: Important but not critical
   - "low" priority: Nice to have

9. **Brand Positioning**: 5-8 REAL competitors on a 2D positioning map
   - Use actual brand names like "Salesforce", "HubSpot", "Monday.com" - NOT "Competitor 1", "Competitor 2", etc.
   - Include the domain (e.g., "salesforce.com", "hubspot.com") for each competitor
   - Position brands based on **Gemini's knowledge and search results**
   - X-axis and Y-axis should be relevant to the industry
   - Your positioning may differ from other AI platforms based on your data sources

**Important**:
1. **MUST provide data for all sections**: llmProviders, brandRecognition, sentimentAnalysis, analysisSummary, narrativeThemes, contentIdeas, and brandPositioning
2. **MUST provide EXACTLY 4 strengths and EXACTLY 4 opportunities** - this is mandatory
3. **MUST use REAL competitor names and domains** - NOT "Competitor 1", "Competitor 2", etc.
4. Base analysis on YOUR (Gemini's) actual knowledge about this domain
5. Be specific and actionable
6. Focus on content that AI search engines will reference
7. Consider the brand's current positioning
7. **All data should reflect Gemini's unique perspective and training data**

Return ONLY the JSON object, no additional text.`;
}

// ============================================================
// Provider Configuration
// Gateway model format: "provider/model-name"
// ============================================================

export const LLM_PROVIDERS = {
  chatgpt: {
    name: 'ChatGPT',
    model: 'openai/gpt-5-mini', // Using centralized gateway
    prompt: getChatGPTPrompt,
    timeout: 30000 // 30 seconds
  },
  perplexity: {
    name: 'Perplexity',
    model: 'perplexity/sonar', // Using centralized gateway
    prompt: getPerplexityPrompt,
    timeout: 30000
  },
  gemini: {
    name: 'Gemini',
    model: 'google/gemini-2.5-flash', // Using centralized gateway
    prompt: getGeminiPrompt,
    timeout: 30000
  }
} as const;

