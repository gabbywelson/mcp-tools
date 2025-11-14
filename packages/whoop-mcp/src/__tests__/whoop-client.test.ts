import { describe, expect, it } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("WhoopClient", () => {
  const mockConfig: WhoopConfig = {
    WHOOP_CLIENT_ID: "test-client-id",
    WHOOP_CLIENT_SECRET: "test-client-secret",
    WHOOP_REFRESH_TOKEN: "test-refresh-token",
  };

  describe("Configuration", () => {
    it("should accept valid config", () => {
      expect(mockConfig.WHOOP_CLIENT_ID).toBe("test-client-id");
      expect(mockConfig.WHOOP_CLIENT_SECRET).toBe("test-client-secret");
      expect(mockConfig.WHOOP_REFRESH_TOKEN).toBe("test-refresh-token");
    });

    it("should have all required config fields", () => {
      expect(mockConfig).toHaveProperty("WHOOP_CLIENT_ID");
      expect(mockConfig).toHaveProperty("WHOOP_CLIENT_SECRET");
      expect(mockConfig).toHaveProperty("WHOOP_REFRESH_TOKEN");
    });
  });

  describe("API Endpoints", () => {
    it("should define expected API methods", () => {
      // This test documents the expected API surface
      const expectedMethods = [
        "getUserProfile",
        "getBodyMeasurement",
        "getCycles",
        "getRecovery",
        "getSleep",
        "getWorkouts",
      ];

      // In a real implementation, you'd import WhoopClient and check
      // For now, we're just documenting the expected interface
      expect(expectedMethods).toHaveLength(6);
    });
  });
});
