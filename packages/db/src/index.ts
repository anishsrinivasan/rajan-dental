import { env } from "@my-better-t-app/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

// biome-ignore lint/performance/noNamespaceImport: Schema namespace is required for Drizzle configuration
import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });
