import type { YnabClient } from "../ynab-client.js";

/**
 * List recent transactions with optional date filter
 */
export async function getRecentTransactions(
  client: YnabClient,
  sinceDate?: string,
  limit?: number
): Promise<string> {
  try {
    // Get transactions
    const transactionsResponse = await client.getTransactions(undefined, sinceDate);

    // Get budget info for currency formatting
    const budgetDetail = await client.getBudget();
    const currencySymbol = budgetDetail.budget.currency_format.currency_symbol;

    // Filter out deleted transactions and sort by date (most recent first)
    let transactions = transactionsResponse.transactions
      .filter((t) => !t.deleted)
      .sort((a, b) => {
        // Sort by date descending, then by amount descending
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return Math.abs(b.amount) - Math.abs(a.amount);
      });

    // Apply limit if specified
    const maxTransactions = limit || 20;
    transactions = transactions.slice(0, maxTransactions);

    // Format transactions for display
    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      date: t.date,
      amount: t.amount,
      amountFormatted: formatMilliunits(t.amount, currencySymbol),
      payee: t.payee_name || "Unknown",
      category: t.category_name || "Uncategorized",
      account: t.account_name,
      memo: t.memo,
      cleared: t.cleared,
      approved: t.approved,
      flagColor: t.flag_color,
      isTransfer: t.transfer_account_id !== null,
      transferAccount: t.transfer_account_id,
      hasSubtransactions: t.subtransactions && t.subtransactions.length > 0,
      subtransactionCount: t.subtransactions ? t.subtransactions.length : 0,
    }));

    // Calculate summary statistics
    const totalInflow = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutflow = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const result = {
      summary: {
        transactionCount: formattedTransactions.length,
        totalShown: formattedTransactions.length,
        totalAvailable: transactionsResponse.transactions.filter((t) => !t.deleted).length,
        sinceDate: sinceDate || "all time",
        limit: maxTransactions,
        totalInflow,
        totalInflowFormatted: formatMilliunits(totalInflow, currencySymbol),
        totalOutflow,
        totalOutflowFormatted: formatMilliunits(totalOutflow, currencySymbol),
        netAmount: totalInflow - totalOutflow,
        netAmountFormatted: formatMilliunits(totalInflow - totalOutflow, currencySymbol),
      },
      transactions: formattedTransactions,
    };

    return JSON.stringify(result, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get recent transactions: ${error.message}`);
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
