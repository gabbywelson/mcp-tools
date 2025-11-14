import { describe, expect, it } from "vitest";
import type {
  Account,
  BudgetSummary,
  Category,
  SaveTransaction,
  Transaction,
  YnabResponse,
} from "../types.js";

/**
 * Tests for TypeScript type definitions
 * These tests verify that types are properly defined and exported
 */

describe("YNAB Type Definitions", () => {
  it("should define YnabResponse type", () => {
    const response: YnabResponse<{ test: string }> = {
      data: { test: "value" },
    };
    expect(response.data.test).toBe("value");
  });

  it("should define BudgetSummary type", () => {
    const budget: Partial<BudgetSummary> = {
      id: "test-id",
      name: "Test Budget",
      last_modified_on: "2024-01-01",
    };
    expect(budget.id).toBe("test-id");
  });

  it("should define Account type", () => {
    const account: Partial<Account> = {
      id: "account-id",
      name: "Checking",
      type: "checking",
      balance: 100000,
      on_budget: true,
      closed: false,
      deleted: false,
    };
    expect(account.type).toBe("checking");
  });

  it("should define Category type", () => {
    const category: Partial<Category> = {
      id: "category-id",
      name: "Groceries",
      budgeted: 50000,
      activity: -30000,
      balance: 20000,
      hidden: false,
      deleted: false,
    };
    expect(category.name).toBe("Groceries");
  });

  it("should define Transaction type", () => {
    const transaction: Partial<Transaction> = {
      id: "transaction-id",
      date: "2024-01-01",
      amount: -50000,
      cleared: "cleared",
      approved: true,
      deleted: false,
    };
    expect(transaction.amount).toBe(-50000);
  });

  it("should define SaveTransaction type", () => {
    const saveTransaction: SaveTransaction = {
      account_id: "account-id",
      date: "2024-01-01",
      amount: -50000,
      payee_name: "Test Payee",
      memo: "Test memo",
    };
    expect(saveTransaction.account_id).toBe("account-id");
  });
});
