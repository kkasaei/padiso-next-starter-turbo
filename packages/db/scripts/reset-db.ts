import { sql } from "drizzle-orm";
import { db } from "../src/db";

async function resetDatabase() {
  console.log("🔄 Resetting database...");

  try {
    // Drop all tables in the public schema
    await db.execute(sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        -- Drop all tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        -- Drop all enums
        FOR r IN (SELECT t.typname FROM pg_type t 
                  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
                  WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
        
        -- Drop all sequences
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    console.log("✅ Database reset complete! All tables, enums, and sequences have been dropped.");
    console.log("📝 Now run 'pnpm db:push' to recreate the schema.");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }

  process.exit(0);
}

resetDatabase();
