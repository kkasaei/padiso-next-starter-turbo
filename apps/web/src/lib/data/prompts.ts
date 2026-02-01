export type AIProvider = "claude" | "openai" | "perplexity" | "gemini" | "grok" | "mistral" | "llama";

export type Prompt = {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: "general" | "content" | "code" | "analysis" | "creative" | "custom";
  aiProvider: AIProvider;
  projectId?: string;
  projectName?: string;
  isGlobal: boolean;
  isFromProject: boolean;
  tags: string[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

// AI Provider configurations
export const AI_PROVIDERS: { value: AIProvider; label: string; color: string; icon: string }[] = [
  { value: "claude", label: "Claude", color: "bg-orange-50 text-orange-700 border-orange-200", icon: "/icons/claude.svg" },
  { value: "openai", label: "OpenAI", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "/icons/openai.svg" },
  { value: "perplexity", label: "Perplexity", color: "bg-blue-50 text-blue-700 border-blue-200", icon: "/icons/perplexity.svg" },
  { value: "gemini", label: "Gemini", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "/icons/gemini.svg" },
  { value: "grok", label: "Grok", color: "bg-zinc-100 text-zinc-700 border-zinc-200", icon: "/icons/grok.svg" },
  { value: "mistral", label: "Mistral", color: "bg-amber-50 text-amber-700 border-amber-200", icon: "/icons/mistral.svg" },
  { value: "llama", label: "Llama", color: "bg-violet-50 text-violet-700 border-violet-200", icon: "/icons/meta-brand.svg" },
];

// Mock projects for filtering
export const mockProjects = [
  { id: "1", name: "Fintech Mobile App Redesign" },
  { id: "2", name: "Internal PM System" },
  { id: "3", name: "AI Learning Platform" },
  { id: "4", name: "Internal CRM System" },
  { id: "5", name: "Ecommerce website" },
];

// Mock data for prompts
export const mockPrompts: Prompt[] = [
  {
    id: "1",
    name: "SEO Meta Description Generator",
    description: "Generate compelling meta descriptions for web pages",
    content: "Write a compelling meta description for a webpage about {{topic}}. The description should be between 150-160 characters, include the main keyword naturally, and have a clear call-to-action.",
    category: "content",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: false,
    tags: ["seo", "marketing"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Code Review Assistant",
    description: "Analyze code for best practices and potential issues",
    content: "Review the following code and provide feedback on:\n1. Code quality and readability\n2. Potential bugs or edge cases\n3. Performance optimizations\n4. Security concerns\n5. Suggestions for improvement\n\nCode:\n{{code}}",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: false,
    tags: ["development", "review"],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Customer Email Response",
    description: "Professional email responses for customer inquiries",
    content: "Write a professional and empathetic email response to a customer who has the following concern: {{concern}}. The tone should be helpful and solution-oriented.",
    category: "content",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "1",
    projectName: "Fintech Mobile App Redesign",
    tags: ["customer-service", "email"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    name: "Data Analysis Summary",
    description: "Summarize data insights in clear language",
    content: "Analyze the following data and provide:\n1. Key findings and trends\n2. Statistical significance\n3. Actionable recommendations\n4. Potential areas for further investigation\n\nData: {{data}}",
    category: "analysis",
    aiProvider: "gemini",
    isGlobal: true,
    isFromProject: false,
    tags: ["data", "reporting"],
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "5",
    name: "Product Feature Brainstorm",
    description: "Generate creative feature ideas for products",
    content: "Brainstorm 10 innovative feature ideas for {{product_type}} that would:\n- Solve a real user problem\n- Be technically feasible\n- Differentiate from competitors\n- Align with current market trends\n\nFor each idea, provide a brief description and potential impact.",
    category: "creative",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "2",
    projectName: "Internal PM System",
    tags: ["product", "innovation"],
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "6",
    name: "API Documentation Writer",
    description: "Generate clear API documentation",
    content: "Write comprehensive API documentation for the following endpoint:\n\nEndpoint: {{endpoint}}\nMethod: {{method}}\nParameters: {{parameters}}\n\nInclude: description, request/response examples, error codes, and usage notes.",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: false,
    tags: ["api", "documentation"],
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
  },
  {
    id: "7",
    name: "Meeting Notes Summarizer",
    description: "Convert meeting transcripts into actionable summaries",
    content: "Summarize the following meeting transcript into:\n1. Key discussion points\n2. Decisions made\n3. Action items with owners and deadlines\n4. Open questions or parking lot items\n\nTranscript: {{transcript}}",
    category: "general",
    aiProvider: "perplexity",
    isGlobal: true,
    isFromProject: false,
    tags: ["productivity", "meetings"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "8",
    name: "Social Media Caption",
    description: "Create engaging social media captions",
    content: "Create an engaging social media caption for {{platform}} about {{topic}}. Include:\n- Attention-grabbing hook\n- Value proposition\n- Relevant hashtags (5-10)\n- Call-to-action\n\nTone: {{tone}}",
    category: "creative",
    aiProvider: "grok",
    isGlobal: true,
    isFromProject: false,
    tags: ["social-media", "marketing"],
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "9",
    name: "Technical Architecture Review",
    description: "Review system architecture for scalability",
    content: "Review this technical architecture and provide feedback on:\n1. Scalability concerns\n2. Security vulnerabilities\n3. Performance bottlenecks\n4. Suggested improvements\n\nArchitecture: {{architecture}}",
    category: "code",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "3",
    projectName: "AI Learning Platform",
    tags: ["architecture", "review"],
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-08"),
  },
  {
    id: "10",
    name: "Research Summary Generator",
    description: "Summarize research papers and articles",
    content: "Summarize the following research content:\n{{content}}\n\nProvide:\n1. Main thesis/findings\n2. Methodology used\n3. Key conclusions\n4. Practical implications",
    category: "analysis",
    aiProvider: "perplexity",
    isGlobal: true,
    isFromProject: true,
    projectId: "4",
    projectName: "Internal CRM System",
    tags: ["research", "summary"],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "11",
    name: "E-commerce Product Description",
    description: "Write compelling product descriptions",
    content: "Write a compelling product description for {{product_name}}.\n\nFeatures: {{features}}\nTarget audience: {{audience}}\n\nInclude benefits, use cases, and a persuasive call-to-action.",
    category: "content",
    aiProvider: "gemini",
    isGlobal: true,
    isFromProject: true,
    projectId: "5",
    projectName: "Ecommerce website",
    tags: ["ecommerce", "copywriting"],
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
  {
    id: "12",
    name: "Bug Report Analysis",
    description: "Analyze bug reports and suggest fixes",
    content: "Analyze this bug report and provide:\n1. Root cause analysis\n2. Potential fix approaches\n3. Testing recommendations\n4. Prevention strategies\n\nBug report: {{bug_report}}",
    category: "code",
    aiProvider: "mistral",
    isGlobal: true,
    isFromProject: false,
    tags: ["debugging", "qa"],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "13",
    name: "User Story Writer",
    description: "Generate user stories for agile development",
    content: "Write a user story for {{feature}}.\n\nFormat:\nAs a [type of user], I want [goal] so that [benefit].\n\nAcceptance criteria:\n- Criterion 1\n- Criterion 2\n- Criterion 3",
    category: "general",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "2",
    projectName: "Internal PM System",
    tags: ["agile", "requirements"],
    createdAt: new Date("2024-02-17"),
    updatedAt: new Date("2024-02-17"),
  },
  {
    id: "14",
    name: "SQL Query Generator",
    description: "Generate SQL queries from natural language",
    content: "Generate an optimized SQL query for the following request:\n\n{{request}}\n\nDatabase schema:\n{{schema}}\n\nInclude comments explaining the query logic.",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: false,
    tags: ["sql", "database"],
    createdAt: new Date("2024-02-18"),
    updatedAt: new Date("2024-02-18"),
  },
  {
    id: "15",
    name: "Competitive Analysis",
    description: "Analyze competitors and market positioning",
    content: "Perform a competitive analysis for {{company}} against {{competitors}}.\n\nAnalyze:\n1. Product features comparison\n2. Pricing strategies\n3. Market positioning\n4. Strengths and weaknesses\n5. Opportunities for differentiation",
    category: "analysis",
    aiProvider: "perplexity",
    isGlobal: true,
    isFromProject: true,
    projectId: "1",
    projectName: "Fintech Mobile App Redesign",
    tags: ["market-research", "strategy"],
    createdAt: new Date("2024-02-19"),
    updatedAt: new Date("2024-02-19"),
  },
  {
    id: "16",
    name: "Blog Post Outline",
    description: "Create structured blog post outlines",
    content: "Create a detailed blog post outline for the topic: {{topic}}\n\nTarget audience: {{audience}}\nTarget word count: {{word_count}}\n\nInclude:\n- Catchy headline options\n- Introduction hook\n- Main sections with key points\n- Conclusion with CTA",
    category: "content",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: false,
    tags: ["blogging", "content-marketing"],
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "17",
    name: "Unit Test Generator",
    description: "Generate unit tests for code",
    content: "Generate comprehensive unit tests for the following code:\n\n{{code}}\n\nInclude:\n1. Happy path tests\n2. Edge cases\n3. Error handling tests\n4. Mock objects where needed\n\nUse {{testing_framework}} framework.",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: true,
    projectId: "3",
    projectName: "AI Learning Platform",
    tags: ["testing", "development"],
    createdAt: new Date("2024-02-21"),
    updatedAt: new Date("2024-02-21"),
  },
  {
    id: "18",
    name: "Marketing Email Sequence",
    description: "Create email drip campaigns",
    content: "Create a {{num_emails}}-email marketing sequence for {{product/service}}.\n\nGoal: {{campaign_goal}}\nTarget audience: {{audience}}\n\nFor each email provide:\n- Subject line (with A/B variant)\n- Preview text\n- Email body\n- CTA",
    category: "content",
    aiProvider: "gemini",
    isGlobal: true,
    isFromProject: false,
    tags: ["email-marketing", "automation"],
    createdAt: new Date("2024-02-22"),
    updatedAt: new Date("2024-02-22"),
  },
  {
    id: "19",
    name: "Sentiment Analysis",
    description: "Analyze sentiment in customer feedback",
    content: "Analyze the sentiment of the following customer feedback:\n\n{{feedback}}\n\nProvide:\n1. Overall sentiment (positive/negative/neutral)\n2. Sentiment score (1-10)\n3. Key themes identified\n4. Emotional triggers\n5. Actionable insights",
    category: "analysis",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "4",
    projectName: "Internal CRM System",
    tags: ["customer-feedback", "analytics"],
    createdAt: new Date("2024-02-23"),
    updatedAt: new Date("2024-02-23"),
  },
  {
    id: "20",
    name: "Landing Page Copy",
    description: "Write conversion-focused landing page copy",
    content: "Write landing page copy for {{product/service}}.\n\nValue proposition: {{value_prop}}\nTarget audience: {{audience}}\n\nInclude:\n- Headline & subheadline\n- Hero section copy\n- Feature highlights\n- Social proof section\n- FAQ section\n- CTA variations",
    category: "content",
    aiProvider: "grok",
    isGlobal: true,
    isFromProject: true,
    projectId: "5",
    projectName: "Ecommerce website",
    tags: ["copywriting", "conversion"],
    createdAt: new Date("2024-02-24"),
    updatedAt: new Date("2024-02-24"),
  },
  {
    id: "21",
    name: "Code Refactoring Assistant",
    description: "Refactor code for better quality",
    content: "Refactor the following code to improve:\n1. Readability\n2. Performance\n3. Maintainability\n4. SOLID principles adherence\n\nCode:\n{{code}}\n\nExplain each change made.",
    category: "code",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: false,
    tags: ["refactoring", "clean-code"],
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "22",
    name: "Interview Questions Generator",
    description: "Generate role-specific interview questions",
    content: "Generate interview questions for a {{role}} position.\n\nExperience level: {{level}}\nKey skills: {{skills}}\n\nInclude:\n1. Technical questions (5)\n2. Behavioral questions (5)\n3. Situational questions (3)\n4. Culture fit questions (2)\n\nWith expected answers/evaluation criteria.",
    category: "general",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: false,
    tags: ["hiring", "hr"],
    createdAt: new Date("2024-02-26"),
    updatedAt: new Date("2024-02-26"),
  },
  {
    id: "23",
    name: "Pricing Strategy Analyzer",
    description: "Analyze and suggest pricing strategies",
    content: "Analyze pricing strategy for {{product}}.\n\nCurrent pricing: {{current_pricing}}\nCost structure: {{costs}}\nCompetitor pricing: {{competitors}}\n\nRecommend:\n1. Optimal price points\n2. Pricing models (subscription/one-time/freemium)\n3. Discount strategies\n4. Revenue projections",
    category: "analysis",
    aiProvider: "gemini",
    isGlobal: true,
    isFromProject: true,
    projectId: "1",
    projectName: "Fintech Mobile App Redesign",
    tags: ["pricing", "business"],
    createdAt: new Date("2024-02-27"),
    updatedAt: new Date("2024-02-27"),
  },
  {
    id: "24",
    name: "Creative Tagline Generator",
    description: "Generate catchy taglines and slogans",
    content: "Generate 10 creative taglines for {{brand/product}}.\n\nBrand personality: {{personality}}\nTarget audience: {{audience}}\nKey message: {{message}}\n\nInclude variations:\n- Serious/professional\n- Playful/witty\n- Emotional/inspiring",
    category: "creative",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: false,
    tags: ["branding", "creative"],
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    id: "25",
    name: "Database Schema Designer",
    description: "Design database schemas from requirements",
    content: "Design a database schema for {{application_type}}.\n\nRequirements:\n{{requirements}}\n\nProvide:\n1. Entity-relationship diagram description\n2. Table definitions with columns\n3. Primary and foreign keys\n4. Indexes recommendations\n5. Sample queries",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: true,
    projectId: "2",
    projectName: "Internal PM System",
    tags: ["database", "architecture"],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "26",
    name: "Press Release Writer",
    description: "Write professional press releases",
    content: "Write a press release for {{announcement}}.\n\nCompany: {{company}}\nDate: {{date}}\nKey stakeholders: {{stakeholders}}\n\nFollow AP style guidelines. Include:\n- Headline\n- Dateline\n- Lead paragraph\n- Body with quotes\n- Boilerplate\n- Contact info",
    category: "content",
    aiProvider: "perplexity",
    isGlobal: true,
    isFromProject: false,
    tags: ["pr", "communications"],
    createdAt: new Date("2024-03-02"),
    updatedAt: new Date("2024-03-02"),
  },
  {
    id: "27",
    name: "A/B Test Hypothesis",
    description: "Create structured A/B test hypotheses",
    content: "Create an A/B test hypothesis for {{element_to_test}}.\n\nCurrent state: {{current}}\nGoal: {{goal}}\n\nStructure:\n- Hypothesis statement\n- Test variations\n- Success metrics\n- Sample size calculation\n- Test duration estimate\n- Risk assessment",
    category: "analysis",
    aiProvider: "mistral",
    isGlobal: true,
    isFromProject: true,
    projectId: "3",
    projectName: "AI Learning Platform",
    tags: ["experimentation", "optimization"],
    createdAt: new Date("2024-03-03"),
    updatedAt: new Date("2024-03-03"),
  },
  {
    id: "28",
    name: "Customer Persona Builder",
    description: "Create detailed customer personas",
    content: "Create a detailed customer persona for {{product/service}}.\n\nMarket segment: {{segment}}\n\nInclude:\n- Demographics\n- Psychographics\n- Goals and motivations\n- Pain points\n- Buying behavior\n- Preferred channels\n- Objections and concerns",
    category: "creative",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "4",
    projectName: "Internal CRM System",
    tags: ["marketing", "research"],
    createdAt: new Date("2024-03-04"),
    updatedAt: new Date("2024-03-04"),
  },
  {
    id: "29",
    name: "Regex Pattern Generator",
    description: "Generate regex patterns from descriptions",
    content: "Generate a regex pattern to match: {{description}}\n\nProvide:\n1. The regex pattern\n2. Explanation of each component\n3. Test cases (matching and non-matching)\n4. Common edge cases\n5. Performance considerations",
    category: "code",
    aiProvider: "openai",
    isGlobal: true,
    isFromProject: false,
    tags: ["regex", "utilities"],
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "30",
    name: "Video Script Writer",
    description: "Write scripts for video content",
    content: "Write a video script for {{video_type}} about {{topic}}.\n\nDuration: {{duration}}\nTone: {{tone}}\nPlatform: {{platform}}\n\nInclude:\n- Hook (first 3 seconds)\n- Introduction\n- Main content with timestamps\n- Call-to-action\n- Visual/B-roll suggestions",
    category: "creative",
    aiProvider: "gemini",
    isGlobal: true,
    isFromProject: true,
    projectId: "5",
    projectName: "Ecommerce website",
    tags: ["video", "content"],
    createdAt: new Date("2024-03-06"),
    updatedAt: new Date("2024-03-06"),
  },
  {
    id: "31",
    name: "Error Message Writer",
    description: "Write user-friendly error messages",
    content: "Write user-friendly error messages for {{application}}.\n\nError scenarios:\n{{scenarios}}\n\nFor each error provide:\n1. User-facing message\n2. Technical log message\n3. Suggested user action\n4. Help link text",
    category: "content",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: false,
    tags: ["ux-writing", "errors"],
    createdAt: new Date("2024-03-07"),
    updatedAt: new Date("2024-03-07"),
  },
  {
    id: "32",
    name: "Sprint Retrospective Facilitator",
    description: "Generate retrospective discussion prompts",
    content: "Generate sprint retrospective discussion prompts for a team of {{team_size}}.\n\nSprint focus: {{sprint_focus}}\nKnown challenges: {{challenges}}\n\nInclude:\n- What went well (5 prompts)\n- What could improve (5 prompts)\n- Action items template\n- Team health check questions",
    category: "general",
    aiProvider: "llama",
    isGlobal: true,
    isFromProject: true,
    projectId: "2",
    projectName: "Internal PM System",
    tags: ["agile", "team"],
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-08"),
  },
  {
    id: "33",
    name: "Legal Document Summarizer",
    description: "Summarize legal documents in plain language",
    content: "Summarize the following legal document in plain language:\n\n{{document}}\n\nProvide:\n1. Executive summary (2-3 sentences)\n2. Key terms and definitions\n3. Main obligations\n4. Important dates/deadlines\n5. Potential risks\n6. Questions to ask a lawyer",
    category: "analysis",
    aiProvider: "perplexity",
    isGlobal: true,
    isFromProject: false,
    tags: ["legal", "summary"],
    createdAt: new Date("2024-03-09"),
    updatedAt: new Date("2024-03-09"),
  },
  {
    id: "34",
    name: "Microservice Design",
    description: "Design microservice architecture",
    content: "Design a microservice for {{functionality}}.\n\nContext: {{system_context}}\n\nProvide:\n1. Service responsibilities (single responsibility)\n2. API endpoints design\n3. Data model\n4. Integration points\n5. Scalability considerations\n6. Monitoring/alerting strategy",
    category: "code",
    aiProvider: "claude",
    isGlobal: true,
    isFromProject: true,
    projectId: "3",
    projectName: "AI Learning Platform",
    tags: ["architecture", "microservices"],
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "35",
    name: "Onboarding Flow Designer",
    description: "Design user onboarding experiences",
    content: "Design an onboarding flow for {{product_type}}.\n\nTarget user: {{user_type}}\nKey features to highlight: {{features}}\n\nProvide:\n1. Step-by-step flow (5-7 steps max)\n2. Copy for each step\n3. Progress indicators\n4. Skip/later options\n5. Success metrics\n6. A/B test suggestions",
    category: "creative",
    aiProvider: "grok",
    isGlobal: true,
    isFromProject: true,
    projectId: "1",
    projectName: "Fintech Mobile App Redesign",
    tags: ["ux", "onboarding"],
    createdAt: new Date("2024-03-11"),
    updatedAt: new Date("2024-03-11"),
  },
];

export type PromptCategory = Prompt["category"];

export const PROMPT_CATEGORIES: { value: PromptCategory; label: string; description: string }[] = [
  { value: "general", label: "General", description: "General purpose prompts" },
  { value: "content", label: "Content", description: "Content writing and editing" },
  { value: "code", label: "Code", description: "Code generation and analysis" },
  { value: "analysis", label: "Analysis", description: "Data and text analysis" },
  { value: "creative", label: "Creative", description: "Creative writing and brainstorming" },
  { value: "custom", label: "Custom", description: "Custom prompts" },
];

export type FilterCounts = {
  category?: Record<string, number>;
  aiProvider?: Record<string, number>;
  project?: Record<string, number>;
  tags?: Record<string, number>;
};

export function computePromptFilterCounts(list: Prompt[]): FilterCounts {
  const res: FilterCounts = {
    category: {},
    aiProvider: {},
    project: {},
    tags: {},
  };

  for (const p of list) {
    // category
    res.category![p.category] = (res.category![p.category] || 0) + 1;
    // AI provider
    res.aiProvider![p.aiProvider] = (res.aiProvider![p.aiProvider] || 0) + 1;
    // project
    if (p.projectId) {
      res.project![p.projectId] = (res.project![p.projectId] || 0) + 1;
    }
    // tags
    for (const t of p.tags || []) {
      const id = t.toLowerCase();
      res.tags![id] = (res.tags![id] || 0) + 1;
    }
  }

  return res;
}

// Get category config for styling
export function getCategoryConfig(category: PromptCategory) {
  switch (category) {
    case "general":
      return { label: "General", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    case "content":
      return { label: "Content", color: "bg-blue-50 text-blue-700 border-blue-200" };
    case "code":
      return { label: "Code", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "analysis":
      return { label: "Analysis", color: "bg-purple-50 text-purple-700 border-purple-200" };
    case "creative":
      return { label: "Creative", color: "bg-orange-50 text-orange-700 border-orange-200" };
    case "custom":
      return { label: "Custom", color: "bg-rose-50 text-rose-700 border-rose-200" };
    default:
      return { label: category, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
  }
}

// Get AI provider config for styling
export function getAIProviderConfig(provider: AIProvider) {
  const config = AI_PROVIDERS.find((p) => p.value === provider);
  return config || { 
    value: provider, 
    label: provider, 
    color: "bg-zinc-100 text-zinc-700 border-zinc-200",
    icon: "/icons/default.svg" // Fallback icon
  };
}
