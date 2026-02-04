import "dotenv/config";
import { db } from "../src/db.js";
import {
  publicReports,
  reportUnlockRequests,
  contactRequests,
} from "../src/schema/index";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB extended JSON type helpers
interface MongoDate {
  $date: string;
}

interface MongoOid {
  $oid: string;
}

interface MongoNumberLong {
  $numberLong: string;
}

// MongoDB document types
interface MongoPublicReport {
  _id: MongoOid;
  domain: string;
  domain_url: string;
  status: string;
  data?: unknown;
  llm_results?: unknown;
  generation_time_ms?: number;
  total_cost?: number;
  expires_at?: MongoDate;
  last_viewed_at?: MongoDate;
  view_count?: number | MongoNumberLong;
  regenerated_at?: MongoDate;
  pdf_url?: string;
  pdf_generated_at?: MongoDate;
  og_image_url?: string;
  og_image_generated_at?: MongoDate;
  created_at?: MongoDate;
  updated_at?: MongoDate;
}

interface MongoReportUnlockRequest {
  _id: MongoOid;
  domain: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  ip_address?: string;
  user_agent?: string;
  unlocked?: boolean;
  unlocked_at?: MongoDate;
  pdf_generated_count?: number | MongoNumberLong;
  pdf_download_count?: number | MongoNumberLong;
  last_pdf_generated_at?: MongoDate;
  last_pdf_downloaded_at?: MongoDate;
  created_at?: MongoDate;
  updated_at?: MongoDate;
}

interface MongoContactRequest {
  _id: MongoOid;
  email: string;
  first_name: string;
  last_name: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  responded?: boolean;
  responded_at?: MongoDate;
  responded_by?: string;
  created_at?: MongoDate;
  updated_at?: MongoDate;
}

// Helper functions to parse MongoDB extended JSON
function parseMongoDate(dateObj: MongoDate | undefined): Date | undefined {
  if (!dateObj || !dateObj.$date) return undefined;
  return new Date(dateObj.$date);
}

function parseMongoNumber(
  numObj: number | MongoNumberLong | undefined
): number {
  if (numObj === undefined) return 0;
  if (typeof numObj === "number") return numObj;
  if (numObj.$numberLong) return parseInt(numObj.$numberLong, 10);
  return 0;
}

// Read and parse JSON files
function readMongoBackupFile<T>(filename: string): T[] {
  const backupDir = path.resolve(
    __dirname,
    "../../../mongo_DB backup"
  );
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T[];
}

async function seedPublicReports() {
  console.log("📊 Seeding public_reports...");

  const mongoData = readMongoBackupFile<MongoPublicReport>(
    "searchfit-db.public_reports.json"
  );

  if (mongoData.length === 0) {
    console.log("  ⚠️  No public_reports data found");
    return new Set<string>();
  }

  const seededDomains = new Set<string>();
  let successCount = 0;
  let errorCount = 0;

  for (const doc of mongoData) {
    try {
      // Calculate expires_at (7 days from created_at or now)
      const createdAt = parseMongoDate(doc.created_at) || new Date();
      const expiresAt =
        parseMongoDate(doc.expires_at) ||
        new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      await db
        .insert(publicReports)
        .values({
          domain: doc.domain,
          domainURL: doc.domain_url,
          status: doc.status as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "EXPIRED",
          data: doc.data,
          llmResults: doc.llm_results,
          generationTimeMs: doc.generation_time_ms,
          totalCost: doc.total_cost,
          expiresAt,
          lastViewedAt: parseMongoDate(doc.last_viewed_at),
          viewCount: parseMongoNumber(doc.view_count),
          regeneratedAt: parseMongoDate(doc.regenerated_at),
          pdfUrl: doc.pdf_url,
          pdfGeneratedAt: parseMongoDate(doc.pdf_generated_at),
          ogImageUrl: doc.og_image_url,
          ogImageGeneratedAt: parseMongoDate(doc.og_image_generated_at),
          createdAt: parseMongoDate(doc.created_at),
          updatedAt: parseMongoDate(doc.updated_at),
        })
        .onConflictDoNothing({ target: publicReports.domain });

      seededDomains.add(doc.domain);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Failed to insert public_report for ${doc.domain}:`, error);
    }
  }

  console.log(`  ✅ Seeded ${successCount} public_reports (${errorCount} errors)`);
  return seededDomains;
}

async function seedReportUnlockRequests(validDomains: Set<string>) {
  console.log("🔓 Seeding report_unlock_requests...");

  const mongoData = readMongoBackupFile<MongoReportUnlockRequest>(
    "searchfit-db.report_unlock_requests.json"
  );

  if (mongoData.length === 0) {
    console.log("  ⚠️  No report_unlock_requests data found");
    return;
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const doc of mongoData) {
    // Skip if the domain doesn't exist in public_reports (FK constraint)
    if (!validDomains.has(doc.domain)) {
      console.log(`  ⚠️  Skipping unlock request - domain ${doc.domain} not in public_reports`);
      skippedCount++;
      continue;
    }

    try {
      await db.insert(reportUnlockRequests).values({
        domain: doc.domain,
        email: doc.email,
        firstName: doc.first_name,
        lastName: doc.last_name,
        companyName: doc.company_name,
        ipAddress: doc.ip_address,
        userAgent: doc.user_agent,
        unlocked: doc.unlocked ?? false,
        unlockedAt: parseMongoDate(doc.unlocked_at),
        pdfGeneratedCount: parseMongoNumber(doc.pdf_generated_count),
        pdfDownloadCount: parseMongoNumber(doc.pdf_download_count),
        lastPdfGeneratedAt: parseMongoDate(doc.last_pdf_generated_at),
        lastPdfDownloadedAt: parseMongoDate(doc.last_pdf_downloaded_at),
        createdAt: parseMongoDate(doc.created_at),
        updatedAt: parseMongoDate(doc.updated_at),
      });
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Failed to insert unlock request for ${doc.email}:`, error);
    }
  }

  console.log(
    `  ✅ Seeded ${successCount} report_unlock_requests (${skippedCount} skipped, ${errorCount} errors)`
  );
}

async function seedContactRequests() {
  console.log("📧 Seeding contact_requests...");

  const mongoData = readMongoBackupFile<MongoContactRequest>(
    "searchfit-db.contact_requests.json"
  );

  if (mongoData.length === 0) {
    console.log("  ⚠️  No contact_requests data found");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const doc of mongoData) {
    try {
      await db.insert(contactRequests).values({
        email: doc.email,
        firstName: doc.first_name,
        lastName: doc.last_name,
        message: doc.message,
        ipAddress: doc.ip_address,
        userAgent: doc.user_agent,
        responded: doc.responded ?? false,
        respondedAt: parseMongoDate(doc.responded_at),
        respondedBy: doc.responded_by,
        createdAt: parseMongoDate(doc.created_at),
        updatedAt: parseMongoDate(doc.updated_at),
      });
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Failed to insert contact request for ${doc.email}:`, error);
    }
  }

  console.log(`  ✅ Seeded ${successCount} contact_requests (${errorCount} errors)`);
}

async function main() {
  console.log("🌱 Starting MongoDB backup migration seed...\n");

  try {
    // Seed in order of dependencies:
    // 1. public_reports (no dependencies)
    // 2. report_unlock_requests (depends on public_reports.domain)
    // 3. contact_requests (no dependencies)

    const validDomains = await seedPublicReports();
    await seedReportUnlockRequests(validDomains);
    await seedContactRequests();

    console.log("\n✅ MongoDB backup migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("👋 Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
