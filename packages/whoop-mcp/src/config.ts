import { z } from "zod";
import type { WhoopConfig } from "./types.js";

/**
 * Configuration schema validation using Zod
 */
const WhoopConfigSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  refreshToken: z.string().min(1, "Refresh Token is required"),
});

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): WhoopConfig {
  const config = {
    clientId: process.env.WHOOP_CLIENT_ID || "",
    clientSecret: process.env.WHOOP_CLIENT_SECRET || "",
    refreshToken: process.env.WHOOP_REFRESH_TOKEN || "",
  };

  try {
    return WhoopConfigSchema.parse(config);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const messages = error.errors
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Configuration validation failed: ${messages}`);
    }
    throw error;
  }
}

/**
 * Validate configuration object
 */
export function validateConfig(config: unknown): WhoopConfig {
  return WhoopConfigSchema.parse(config);
}
