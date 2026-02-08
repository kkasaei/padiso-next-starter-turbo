import { db, adminSettings, adminPrompts } from "@workspace/db";

async function seed() {
  console.log("🌱 Seeding admin settings and prompts...");

  // Seed admin settings
  const settings = [
    {
      key: "auth_mode",
      category: "authentication",
      description: "Controls authentication flow: waitlist mode (true) or open signup (false)",
      value: {
        use_waitlist_mode: true,
      },
      isActive: true,
      metadata: {},
    },
    {
      key: "maintenance_mode",
      category: "maintenance",
      description: "Global and subsection maintenance controls",
      value: {
        enabled: false,
        scope: "all",
        subsections: {
          dashboard: false,
          marketing: false,
          api: false,
          mcp: false,
        },
        message: {
          default: "We're performing scheduled maintenance. Back soon!",
          dashboard: "Dashboard is temporarily unavailable",
          marketing: "Site is under maintenance",
          api: "API is under maintenance",
          mcp: "MCP server is temporarily unavailable",
        },
        estimated_end: null,
        allowed_ips: [],
        show_countdown: false,
      },
      isActive: true,
      metadata: {},
    },
    {
      key: "data_source",
      category: "system",
      description: "Toggle between mock/test data and real production data",
      value: {
        use_mock_data: false,
      },
      isActive: true,
      metadata: {},
    },
    {
      key: "app_features",
      category: "features",
      description: "Enable or disable app features - disabled features show as 'Coming Soon'",
      value: {
        tasks: true, // ✅ Enabled by default
        workspace_prompts: true, // ✅ Enabled by default
        brands: {
          content: true, // ✅ Enabled by default
          analytics: true, // ✅ Enabled by default
          ai_tracking: true, // ✅ Enabled by default
          backlinks: false, // ❌ Disabled by default
          technical_audit: true, // ✅ Enabled by default
          social_listening: true, // ✅ Enabled by default
          tasks: true, // ✅ Enabled by default
        },
      },
      isActive: true,
      metadata: {},
    },
    {
      key: "integrations",
      category: "integrations",
      description: "Enable or disable third-party integrations - disabled integrations show as 'Coming Soon'",
      value: {
        // Search & Knowledge
        google: true, // ✅ Enabled by default
        microsoft: false,
        
        // Communication
        slack: false,
        microsoft_teams: false,
        
        // Project Management
        linear: false,
        
        // Analytics
        adobe_analytics: false,
        mixpanel: false,
        
        // Content & CMS
        wordpress: true, // ✅ Enabled by default
        webflow: true, // ✅ Enabled by default
        
        // Version Control
        github: false,
        
        // Social Media & Commerce
        twitter: false,
        linkedin: false,
        discord: false,
        tiktok: false,
        
        // SEO Tools
        ahrefs: false,
        moz: false,
        semrush: false,
        kw_finder: false,
        
        // Automation & Integrations
        zapier: false,
        make: false,
        n8n: false,
        
        // E-commerce
        shopify: true, // ✅ Enabled by default
        
        // Advertisement
        meta_ads: false,
        
        // AI & Platforms
        api: false,
        mcp: false,
        webhooks: true, // ✅ Enabled by default
        
        // Platforms
        davinci: false,
        fabriq: false,
        klaviyo: false,
        apifox: false,
        airtable: false,
        
        // CRM & Sales
        salesforce: false,
        intercom: false,
        hubspot: false,
        
        // AI Search
        perplexity: false,
        gemini: false,
        chatgpt: false,
      },
      isActive: true,
      metadata: {},
    },
  ];

  for (const setting of settings) {
    await db.insert(adminSettings).values(setting).onConflictDoNothing();
    console.log(`✅ Created setting: ${setting.key}`);
  }

  // Seed admin prompts
  const prompts = [
    {
      name: "Master System Prompt",
      description: "Default system-wide prompt for all content generation",
      prompt: `You are a helpful AI assistant that generates high-quality SEO content. Focus on creating engaging, informative content that provides value to readers while naturally incorporating relevant keywords.

Guidelines:
- Maintain a professional yet approachable tone
- Use clear, concise language
- Naturally incorporate keywords without keyword stuffing
- Focus on providing value to the reader
- Structure content with clear headings and sections
- Include actionable insights and takeaways`,
      purpose: "master",
      aiProvider: "claude",
      isMaster: true,
      isActive: true,
      config: {
        temperature: 0.7,
        maxTokens: 4000,
        model: "claude-3-5-sonnet-20241022",
      },
      version: 1,
      usageCount: 0,
    },
    {
      name: "SEO Blog Article Generator",
      description: "Generates SEO-optimized blog articles with keyword focus",
      prompt: `Generate a comprehensive, SEO-optimized blog article about {{topic}}.

Target Keywords: {{keywords}}

Requirements:
1. Write an engaging introduction that hooks the reader
2. Use H2 and H3 subheadings to structure the content
3. Naturally incorporate the target keywords throughout
4. Include relevant examples and data points
5. Add a strong call-to-action at the end
6. Aim for 1500-2000 words
7. Use a conversational yet professional tone

Format the output in markdown with proper headings and formatting.`,
      purpose: "seo_optimization",
      aiProvider: "claude",
      isMaster: false,
      isActive: true,
      config: {
        temperature: 0.8,
        maxTokens: 3000,
      },
      version: 1,
      usageCount: 0,
    },
    {
      name: "Social Media Post Creator",
      description: "Creates engaging social media posts for various platforms",
      prompt: `Create engaging social media posts about {{topic}} for {{platform}}.

Brand Voice: {{brand_voice}}
Target Audience: {{target_audience}}

Requirements:
- Keep it concise and attention-grabbing
- Include relevant hashtags
- Add emojis where appropriate (but don't overdo it)
- Include a clear call-to-action
- Optimize for the specific platform's format and audience

Generate 3 variations so we can A/B test.`,
      purpose: "social_media",
      aiProvider: "claude",
      isMaster: false,
      isActive: true,
      config: {
        temperature: 0.9,
        maxTokens: 500,
      },
      version: 1,
      usageCount: 0,
    },
  ];

  for (const prompt of prompts) {
    await db.insert(adminPrompts).values(prompt).onConflictDoNothing();
    console.log(`✅ Created prompt: ${prompt.name}`);
  }

  console.log("✨ Seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
