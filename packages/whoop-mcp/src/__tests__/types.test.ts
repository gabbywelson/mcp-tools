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
        user_id: 123,
        height_meter: 1.8,
        weight_kilogram: 75,
        max_heart_rate: 190,
      };

      expect(measurement.height_meter).toBe(1.8);
      expect(measurement.weight_kilogram).toBe(75);
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
      };

      expect(token.access_token).toBe("test-access-token");
      expect(token.expires_in).toBe(3600);
    });

    it("should have required fields", () => {
      const token: TokenResponse = {
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
      };

      expect(token.access_token).toBeDefined();
      expect(token.refresh_token).toBeDefined();
    });
  });

  describe("PaginatedResponse", () => {
    it("should accept paginated response with records", () => {
      const response: PaginatedResponse<Cycle> = {
        records: [],
        next_token: undefined,
      };

      expect(Array.isArray(response.records)).toBe(true);
      expect(response.next_token).toBeUndefined();
    });
  });
});
