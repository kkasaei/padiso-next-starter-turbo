import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import "dotenv/config";

const getEnvVariable = (name: string) => {
  const value = process.env[name];
  if (value == null) throw new Error(`environment variable ${name} not found`);
  return value;
};

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(getEnvVariable("DATABASE_URL"), { prepare: false });

export const db = drizzle(client, { schema });

