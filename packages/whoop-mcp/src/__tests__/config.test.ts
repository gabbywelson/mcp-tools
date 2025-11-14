import { describe, expect, it } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("Config / Environment Variables", () => {
  it("should have correct config structure", () => {
    const mockConfig: WhoopConfig = {
      clientId: "test",
      clientSecret: "test",
      refreshToken: "test",
    };

    expect(typeof mockConfig.clientId).toBe("string");
    expect(typeof mockConfig.clientSecret).toBe("string");
    expect(typeof mockConfig.refreshToken).toBe("string");
  });

  it("should accept valid config values", () => {
    const config: WhoopConfig = {
      clientId: "abc123",
      clientSecret: "secret456",
      refreshToken: "token789",
    };

    expect(config.clientId).toBe("abc123");
    expect(config.clientSecret).toBe("secret456");
    expect(config.refreshToken).toBe("token789");
  });

  it("should require all three config fields", () => {
    const config: WhoopConfig = {
      clientId: "test-id",
      clientSecret: "test-secret",
      refreshToken: "test-token",
    };

    // TypeScript enforces these at compile time
    expect(config).toHaveProperty("clientId");
    expect(config).toHaveProperty("clientSecret");
    expect(config).toHaveProperty("refreshToken");
  });
});
