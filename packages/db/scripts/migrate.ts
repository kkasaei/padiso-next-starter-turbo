import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async () => {
  await migrate(db, {
    migrationsFolder: join(__dirname, "../drizzle"),
  });
  process.exit(0);
};

void main();