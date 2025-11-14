import { describe, expect, it } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("Config / Environment Variables", () => {
  it("should have correct config structure", () => {
    const mockConfig: WhoopConfig = {
      WHOOP_CLIENT_ID: "test",
      WHOOP_CLIENT_SECRET: "test",
      WHOOP_REFRESH_TOKEN: "test",
    };

    expect(typeof mockConfig.WHOOP_CLIENT_ID).toBe("string");
    expect(typeof mockConfig.WHOOP_CLIENT_SECRET).toBe("string");
    expect(typeof mockConfig.WHOOP_REFRESH_TOKEN).toBe("string");
  });

  it("should accept valid config values", () => {
    const config: WhoopConfig = {
      WHOOP_CLIENT_ID: "abc123",
      WHOOP_CLIENT_SECRET: "secret456",
      WHOOP_REFRESH_TOKEN: "token789",
    };

    expect(config.WHOOP_CLIENT_ID).toBe("abc123");
    expect(config.WHOOP_CLIENT_SECRET).toBe("secret456");
    expect(config.WHOOP_REFRESH_TOKEN).toBe("token789");
  });

  it("should require all three config fields", () => {
    const config: WhoopConfig = {
      WHOOP_CLIENT_ID: "test-id",
      WHOOP_CLIENT_SECRET: "test-secret",
      WHOOP_REFRESH_TOKEN: "test-token",
    };

    // TypeScript enforces these at compile time
    expect(config).toHaveProperty("WHOOP_CLIENT_ID");
    expect(config).toHaveProperty("WHOOP_CLIENT_SECRET");
    expect(config).toHaveProperty("WHOOP_REFRESH_TOKEN");
  });
});
