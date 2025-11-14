import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use projects configuration for monorepo
    projects: ["packages/*/vitest.config.ts"],

    // Global test settings
    globals: true,

    // Use single thread pool to avoid worker issues
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/*.config.*", "**/coverage/**"],
    },
  },
});
