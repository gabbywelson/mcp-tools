import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@mcp-tools/ynab-mcp",

    // Test environment
    environment: "node",

    // Enable globals (describe, it, expect, etc.)
    globals: true,

    // Test file patterns
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["**/node_modules/**", "**/dist/**"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.{test,spec}.ts", "src/types.ts", "src/index.ts"],
    },

    // Timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
