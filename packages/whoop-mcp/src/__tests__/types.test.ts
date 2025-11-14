import { describe, expect, it } from "vitest";
import type {
  BodyMeasurement,
  Cycle,
  PaginatedResponse,
  RecoveryScore,
  SleepActivity,
  TokenResponse,
  WhoopUser,
  Workout,
} from "../types.js";

describe("Type Definitions", () => {
  describe("WhoopUser", () => {
    it("should accept valid user object", () => {
      const user: WhoopUser = {
        user_id: 123,
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      };

      expect(user.user_id).toBe(123);
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("BodyMeasurement", () => {
    it("should accept valid body measurement object", () => {
      const measurement: BodyMeasurement = {
        height_centimeters: 180,
        weight_kilograms: 75,
        max_heart_rate: 190,
      };

      expect(measurement.height_centimeters).toBe(180);
      expect(measurement.weight_kilograms).toBe(75);
      expect(measurement.max_heart_rate).toBe(190);
    });
  });

  describe("TokenResponse", () => {
    it("should accept valid token response", () => {
      const token: TokenResponse = {
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
        scope: "read:profile",
      };

      expect(token.access_token).toBe("test-access-token");
      expect(token.expires_in).toBe(3600);
    });

    it("should accept token response without refresh_token", () => {
      const token: Partial<TokenResponse> = {
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
      };

      expect(token.access_token).toBe("test-access-token");
      expect(token.refresh_token).toBeUndefined();
    });
  });

  describe("PaginatedResponse", () => {
    it("should accept paginated response with records", () => {
      const response: PaginatedResponse<Cycle> = {
        records: [],
        next_token: null,
      };

      expect(Array.isArray(response.records)).toBe(true);
      expect(response.next_token).toBeNull();
    });
  });
});
