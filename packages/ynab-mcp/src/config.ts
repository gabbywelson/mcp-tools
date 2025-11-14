/**
 * Configuration module - re-exports from env.ts for backwards compatibility
 *
 * This file maintains the original API while using T3 Env under the hood.
 * You can import from either './config.js' or './env.js'
 */

import { type YnabConfig, env, config as envConfig } from "./env.js";

export { env, type YnabConfig };
export const config = envConfig;

/**
 * Load configuration (for backwards compatibility)
 * Now simply returns the validated config from T3 Env
 */
export function loadConfig(): YnabConfig {
  return config;
}

/**
 * Validate configuration object (for backwards compatibility)
 * T3 Env validates on module load, so this is now a no-op
 */
export function validateConfig(configObj: unknown): YnabConfig {
  // T3 Env already validated on import
  return configObj as YnabConfig;
}
