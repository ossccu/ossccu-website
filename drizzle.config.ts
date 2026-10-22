import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load from .env explicitly
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "./src/database/schema/*",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});