import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { env } from "../env.js";

describe("Config / Environment Variables", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset modules and environment before each test
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		// Restore original environment
		process.env = originalEnv;
	});

	it("should have required environment variables defined", () => {
		// These should be set in the test environment or .env file
		expect(env.WHOOP_CLIENT_ID).toBeDefined();
		expect(env.WHOOP_CLIENT_SECRET).toBeDefined();
		expect(env.WHOOP_REFRESH_TOKEN).toBeDefined();
	});

	it("should export config values with correct types", () => {
		expect(typeof env.WHOOP_CLIENT_ID).toBe("string");
		expect(typeof env.WHOOP_CLIENT_SECRET).toBe("string");
		expect(typeof env.WHOOP_REFRESH_TOKEN).toBe("string");
	});

	it("should have non-empty config values", () => {
		expect(env.WHOOP_CLIENT_ID.length).toBeGreaterThan(0);
		expect(env.WHOOP_CLIENT_SECRET.length).toBeGreaterThan(0);
		expect(env.WHOOP_REFRESH_TOKEN.length).toBeGreaterThan(0);
	});
});

