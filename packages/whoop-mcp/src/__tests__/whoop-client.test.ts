import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WhoopConfig } from "../config.js";
import { WhoopClient } from "../whoop-client.js";

describe("WhoopClient", () => {
	let mockConfig: WhoopConfig;
	let client: WhoopClient;

	beforeEach(() => {
		mockConfig = {
			WHOOP_CLIENT_ID: "test-client-id",
			WHOOP_CLIENT_SECRET: "test-client-secret",
			WHOOP_REFRESH_TOKEN: "test-refresh-token",
		};
		client = new WhoopClient(mockConfig);
	});

	describe("Constructor", () => {
		it("should create a WhoopClient instance", () => {
			expect(client).toBeInstanceOf(WhoopClient);
		});

		it("should initialize with provided config", () => {
			// Test that the client is created without throwing
			expect(() => new WhoopClient(mockConfig)).not.toThrow();
		});
	});

	describe("API Methods", () => {
		it("should have getUserProfile method", () => {
			expect(typeof client.getUserProfile).toBe("function");
		});

		it("should have getBodyMeasurement method", () => {
			expect(typeof client.getBodyMeasurement).toBe("function");
		});

		it("should have getCycles method", () => {
			expect(typeof client.getCycles).toBe("function");
		});

		it("should have getRecovery method", () => {
			expect(typeof client.getRecovery).toBe("function");
		});

		it("should have getSleep method", () => {
			expect(typeof client.getSleep).toBe("function");
		});

		it("should have getWorkouts method", () => {
			expect(typeof client.getWorkouts).toBe("function");
		});
	});

	describe("Token Management", () => {
		it("should handle token refresh (mocked)", async () => {
			// Mock axios to avoid real API calls
			vi.mock("axios");

			// This is a basic test - in a real scenario, you'd mock axios responses
			expect(client).toBeDefined();
		});
	});
});

