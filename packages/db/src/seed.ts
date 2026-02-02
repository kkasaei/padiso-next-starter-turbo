import "dotenv/config";
import { db } from "./db.js";
import { env } from "./env";
import {
  workspaces,
  brands,
  brandMembers,
  tasks,
  files,
  prompts,
  promptTags,
} from "./schema/index";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await db.delete(tasks);
    await db.delete(files);
    await db.delete(prompts);
    await db.delete(promptTags);
    await db.delete(brandMembers);
    await db.delete(brands);
    await db.delete(workspaces);

    // Seed workspace
    console.log("🏢 Seeding workspace...");
    
    // Use environment variable or default for flexibility
    const clerkOrgId = env.CLERK_ORG_ID || "org_37EN42BgW9DyBqRndpdDSeqfdah";
    console.log(`  Using Clerk Org ID: ${clerkOrgId}`);
    
    const [workspace] = await db
      .insert(workspaces)
      .values({
        clerkOrgId,
        status: "active",
        planId: "growth",
        planName: "Growth Plan",
      })
      .returning();

    if (!workspace) {
      throw new Error("Failed to create workspace");
    }

    console.log(`✅ Created workspace: ${workspace.clerkOrgId} (${workspace.id})`);

    // Seed brands
    console.log("🏷️  Seeding brands...");
    const now = new Date();
    const nextScan = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const brandsData: Array<typeof brands.$inferInsert> = [
      {
        workspaceId: workspace.id,
        brandName: "CAPITALY",
        websiteUrl: "https://capitaly.vc",
        brandColor: "#3B82F6",
        status: "active" as const,
        createdByUserId: "user_37EN2vZ0fFCSzsEf8Bmnpov3t2X",
        // AI Visibility
        visibilityScore: 72,
        lastScanAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        nextScanAt: nextScan,
      },
      {
        workspaceId: workspace.id,
        brandName: "PADISO",
        websiteUrl: "https://padiso.co",
        brandColor: "#10B981",
        status: "active" as const,
        createdByUserId: "user_37EN2vZ0fFCSzsEf8Bmnpov3t2X",
        // AI Visibility
        visibilityScore: 85,
        lastScanAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        nextScanAt: nextScan,
      },
      {
        workspaceId: workspace.id,
        brandName: "SearchFIT",
        websiteUrl: "https://searchfit.ai",
        brandColor: "#8B5CF6",
        status: "active" as const,
        createdByUserId: "user_37EN2vZ0fFCSzsEf8Bmnpov3t2X",
        // AI Visibility
        visibilityScore: 91,
        lastScanAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        nextScanAt: nextScan,
      },
    ];

    const createdBrands = [];
    for (const brandData of brandsData) {
      const [brand] = await db.insert(brands).values(brandData).returning();
      if (brand) {
        createdBrands.push(brand);
        console.log(`  ✅ Created brand: ${brand.brandName}`);
      }
    }

    // Seed tasks
    console.log("📋 Seeding tasks...");
    const tasksData: Array<typeof tasks.$inferInsert> = [
      {
        brandId: createdBrands[0]!.id, // CAPITALY
        name: "Update portfolio showcase",
        description: "Refresh portfolio companies section with latest investments",
        status: "in-progress" as const,
        priority: "high" as const,
        tag: "content",
      },
      {
        brandId: createdBrands[0]!.id, // CAPITALY
        name: "SEO optimization for VC keywords",
        description: "Optimize for venture capital and investment keywords",
        status: "todo" as const,
        priority: "medium" as const,
        tag: "seo",
      },
      {
        brandId: createdBrands[1]!.id, // PADISO
        name: "Product documentation update",
        description: "Update technical documentation for latest features",
        status: "in-progress" as const,
        priority: "high" as const,
        tag: "documentation",
      },
      {
        brandId: createdBrands[1]!.id, // PADISO
        name: "Blog content calendar",
        description: "Plan Q1 blog content strategy",
        status: "done" as const,
        priority: "medium" as const,
        tag: "content",
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "AI tracking feature launch",
        description: "Launch new AI tracking analytics dashboard",
        status: "in-progress" as const,
        priority: "urgent" as const,
        tag: "feature",
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "Content optimization guide",
        description: "Create comprehensive guide for SEO content optimization",
        status: "todo" as const,
        priority: "low" as const,
        tag: "documentation",
      },
    ];

    for (const taskData of tasksData) {
      const [task] = await db.insert(tasks).values(taskData).returning();
      if (task) {
        console.log(`  ✅ Created task: ${task.name}`);
      }
    }

    // Seed prompt tags
    console.log("🏷️  Seeding prompt tags...");
    const promptTagsData: Array<typeof promptTags.$inferInsert> = [
      {
        brandId: createdBrands[0]!.id, // CAPITALY
        name: "Investment",
        color: "#3B82F6",
        description: "Investment analysis and research prompts",
      },
      {
        brandId: createdBrands[1]!.id, // PADISO
        name: "Documentation",
        color: "#10B981",
        description: "Technical and user documentation prompts",
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "SEO",
        color: "#8B5CF6",
        description: "Search engine optimization prompts",
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "Content",
        color: "#F59E0B",
        description: "Content creation and copywriting prompts",
      },
    ];

    const createdTags = [];
    for (const tagData of promptTagsData) {
      const [tag] = await db.insert(promptTags).values(tagData).returning();
      if (tag) {
        createdTags.push(tag);
        console.log(`  ✅ Created tag: ${tag.name}`);
      }
    }

    // Seed prompts
    console.log("💬 Seeding prompts...");
    const promptsData: Array<typeof prompts.$inferInsert> = [
      {
        brandId: createdBrands[0]!.id, // CAPITALY
        name: "VC Investment Analysis",
        prompt: "Generate a comprehensive investment analysis for {{company_name}} in the {{industry}} sector, focusing on {{key_metrics}}",
        aiProvider: "claude",
        tagId: createdTags[0]!.id, // Investment tag
      },
      {
        brandId: createdBrands[1]!.id, // PADISO
        name: "Technical Documentation",
        prompt: "Create clear and concise technical documentation for {{feature_name}} including setup, usage, and best practices",
        aiProvider: "openai",
        tagId: createdTags[1]!.id, // Documentation tag
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "SEO Content Generator",
        prompt: "Generate SEO-optimized content for {{topic}} targeting {{keyword}} with a focus on answer engine optimization",
        aiProvider: "perplexity",
        tagId: createdTags[2]!.id, // SEO tag
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "Meta Description Creator",
        prompt: "Create a compelling meta description (max 160 characters) for a page about {{topic}} that encourages clicks",
        aiProvider: "gemini",
        tagId: createdTags[2]!.id, // SEO tag
      },
      {
        brandId: createdBrands[2]!.id, // SearchFIT
        name: "Blog Post Writer",
        prompt: "Write an engaging blog post about {{topic}} that targets {{audience}} and includes {{keywords}}",
        aiProvider: "claude",
        tagId: createdTags[3]!.id, // Content tag
      },
    ];

    for (const promptData of promptsData) {
      const [prompt] = await db.insert(prompts).values(promptData).returning();
      if (prompt) {
        console.log(`  ✅ Created prompt: ${prompt.name}`);
      }
    }

    console.log("\n✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("👋 Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
