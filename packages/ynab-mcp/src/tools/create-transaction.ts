import type { SaveTransaction } from "../types.js";
import type { YnabClient } from "../ynab-client.js";

/**
 * Create a new transaction
 */
export async function createTransaction(
  client: YnabClient,
  accountId: string,
  date: string,
  amount: number,
  payeeName?: string,
  memo?: string,
  categoryId?: string
): Promise<string> {
  try {
    // Validate required fields
    if (!accountId) {
      throw new Error("account_id is required");
    }
    if (!date) {
      throw new Error("date is required");
    }
    if (amount === undefined || amount === null) {
      throw new Error("amount is required");
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error("date must be in YYYY-MM-DD format");
    }

    // Build transaction object
    const transaction: SaveTransaction = {
      account_id: accountId,
      date,
      amount,
    };

    // Add optional fields
    if (payeeName) {
      transaction.payee_name = payeeName;
    }
    if (memo) {
      transaction.memo = memo;
    }
    if (categoryId) {
      transaction.category_id = categoryId;
    }

    // Create the transaction
    const response = await client.createTransaction(undefined, transaction);

    // Get budget info for currency formatting
    const budgetDetail = await client.getBudget();
    const currencySymbol = budgetDetail.budget.currency_format.currency_symbol;

    // Format the response
    const createdTransaction = response.transaction;
    if (!createdTransaction) {
      throw new Error("Transaction was created but no transaction data was returned");
    }

    const result = {
      success: true,
      message: "Transaction created successfully",
      transaction: {
        id: createdTransaction.id,
        date: createdTransaction.date,
        amount: createdTransaction.amount,
        amountFormatted: formatMilliunits(createdTransaction.amount, currencySymbol),
        payee: createdTransaction.payee_name || "Unknown",
        category: createdTransaction.category_name || "Uncategorized",
        account: createdTransaction.account_name,
        memo: createdTransaction.memo,
        cleared: createdTransaction.cleared,
        approved: createdTransaction.approved,
      },
      duplicateImportIds: response.duplicate_import_ids || [],
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Format milliunits to currency string
 * YNAB uses milliunits: 1000 milliunits = $1.00
 */
function formatMilliunits(milliunits: number, symbol: string): string {
  const amount = milliunits / 1000;
  const sign = amount < 0 ? "-" : "";
  const absAmount = Math.abs(amount);
  return `${sign}${symbol}${absAmount.toFixed(2)}`;
}
