import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import "dotenv/config";
import { getEnvVariable } from "./env";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(getEnvVariable("DATABASE_URL"), { prepare: false });

export const db = drizzle(client, { schema });

