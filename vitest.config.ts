import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Use projects configuration for monorepo
		projects: ["packages/*/vitest.config.ts"],
		
		// Global test settings
		globals: true,
		
		// Coverage configuration
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/*.config.*",
				"**/coverage/**",
				"**/.changeset/**",
			],
		},
	},
});

