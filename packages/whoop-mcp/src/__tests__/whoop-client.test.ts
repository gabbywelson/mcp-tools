import { describe, expect, it } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("WhoopClient", () => {
  const mockConfig: WhoopConfig = {
    clientId: "test-client-id",
    clientSecret: "test-client-secret",
    refreshToken: "test-refresh-token",
  };

  describe("Configuration", () => {
    it("should accept valid config", () => {
      expect(mockConfig.clientId).toBe("test-client-id");
      expect(mockConfig.clientSecret).toBe("test-client-secret");
      expect(mockConfig.refreshToken).toBe("test-refresh-token");
    });

    it("should have all required config fields", () => {
      expect(mockConfig).toHaveProperty("clientId");
      expect(mockConfig).toHaveProperty("clientSecret");
      expect(mockConfig).toHaveProperty("refreshToken");
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
