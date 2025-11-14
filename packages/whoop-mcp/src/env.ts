import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Type-safe environment variable configuration using T3 Env
 *
 * This provides runtime validation and type safety for all environment variables.
 * Variables are validated on startup, ensuring the application fails fast if
 * configuration is invalid.
 */
export const env = createEnv({
  /**
   * Server-side environment variables for WHOOP OAuth credentials
   * These are never exposed to the client and are only accessible on the server.
   */
  server: {
    WHOOP_CLIENT_ID: z
      .string()
      .min(1, "WHOOP Client ID is required")
      .describe("OAuth Client ID from WHOOP Developer Portal"),

    WHOOP_CLIENT_SECRET: z
      .string()
      .min(1, "WHOOP Client Secret is required")
      .describe("OAuth Client Secret from WHOOP Developer Portal"),

    WHOOP_REFRESH_TOKEN: z
      .string()
      .min(1, "WHOOP Refresh Token is required")
      .describe("OAuth Refresh Token obtained via authorization flow"),
  },

  /**
   * Runtime environment - uses process.env
   * This is where the actual environment variables are read from
   */
  runtimeEnv: process.env,

  /**
   * Skip validation during build time
   * Set to true to allow builds without environment variables
   */
  skipValidation: false,

  /**
   * Called when validation fails
   * Provides detailed error messages for missing or invalid variables
   */
  onValidationError: (error) => {
    console.error("❌ Invalid environment variables:");
    console.error(error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  },

  /**
   * Called when server variables are accessed on the client
   * This should never happen in an MCP server, but provides safety
   */
  onInvalidAccess: (variable) => {
    throw new Error(
      `❌ Attempted to access server-side environment variable '${variable}' on the client`
    );
  },

  /**
   * Whether to treat empty strings as undefined
   * Set to true so empty strings fail validation
   */
  emptyStringAsUndefined: true,
});

/**
 * Export type-safe config object for backwards compatibility
 */
export const config = {
  clientId: env.WHOOP_CLIENT_ID,
  clientSecret: env.WHOOP_CLIENT_SECRET,
  refreshToken: env.WHOOP_REFRESH_TOKEN,
} as const;

/**
 * Type definition for WHOOP configuration
 */
export type WhoopConfig = typeof config;
