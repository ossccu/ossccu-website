import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const isDbConnected = Boolean(
  connectionString &&
    (connectionString.startsWith("postgres://") || connectionString.startsWith("postgresql://"))
);

// Initialize PostgreSQL client driver pool safely
const client = isDbConnected ? postgres(connectionString, { max: 10, prepare: false }) : null;

export const db = client ? drizzle(client, { schema }) : null;

export * from "./schema";
