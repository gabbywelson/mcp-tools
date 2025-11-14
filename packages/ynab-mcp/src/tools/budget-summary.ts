import type { YnabClient } from "../ynab-client.js";

/**
 * Get comprehensive budget summary including accounts and category totals
 */
export async function getBudgetSummary(client: YnabClient): Promise<string> {
  try {
    const budgetDetail = await client.getBudget();
    const budget = budgetDetail.budget;

    // Calculate total account balances
    const accounts = budget.accounts || [];
    const onBudgetAccounts = accounts.filter((a) => a.on_budget && !a.closed);
    const offBudgetAccounts = accounts.filter((a) => !a.on_budget && !a.closed);

    const totalOnBudget = onBudgetAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalOffBudget = offBudgetAccounts.reduce((sum, a) => sum + a.balance, 0);

    // Calculate category totals
    const categoryGroups = budget.category_groups || [];
    let totalBudgeted = 0;
    let totalActivity = 0;
    let totalAvailable = 0;

    const categoryGroupSummaries = categoryGroups
      .filter((cg) => !cg.hidden && !cg.deleted)
      .map((cg) => {
        const categories = cg.categories || [];
        const visibleCategories = categories.filter((c) => !c.hidden && !c.deleted);

        const groupBudgeted = visibleCategories.reduce((sum, c) => sum + c.budgeted, 0);
        const groupActivity = visibleCategories.reduce((sum, c) => sum + c.activity, 0);
        const groupBalance = visibleCategories.reduce((sum, c) => sum + c.balance, 0);

        totalBudgeted += groupBudgeted;
        totalActivity += groupActivity;
        totalAvailable += groupBalance;

        return {
          name: cg.name,
          budgeted: groupBudgeted,
          activity: groupActivity,
          balance: groupBalance,
          categoryCount: visibleCategories.length,
        };
      });

    const summary = {
      budget: {
        id: budget.id,
        name: budget.name,
        currency: budget.currency_format.iso_code,
        currencySymbol: budget.currency_format.currency_symbol,
        lastModified: budget.last_modified_on,
      },
      accounts: {
        onBudget: {
          count: onBudgetAccounts.length,
          totalBalance: totalOnBudget,
          totalBalanceFormatted: formatMilliunits(
            totalOnBudget,
            budget.currency_format.currency_symbol
          ),
          accounts: onBudgetAccounts.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            balance: a.balance,
            balanceFormatted: formatMilliunits(a.balance, budget.currency_format.currency_symbol),
            clearedBalance: a.cleared_balance,
            unclearedBalance: a.uncleared_balance,
          })),
        },
        offBudget: {
          count: offBudgetAccounts.length,
          totalBalance: totalOffBudget,
          totalBalanceFormatted: formatMilliunits(
            totalOffBudget,
            budget.currency_format.currency_symbol
          ),
          accounts: offBudgetAccounts.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            balance: a.balance,
            balanceFormatted: formatMilliunits(a.balance, budget.currency_format.currency_symbol),
          })),
        },
        netWorth: totalOnBudget + totalOffBudget,
        netWorthFormatted: formatMilliunits(
          totalOnBudget + totalOffBudget,
          budget.currency_format.currency_symbol
        ),
      },
      categoryGroups: {
        totalBudgeted,
        totalBudgetedFormatted: formatMilliunits(
          totalBudgeted,
          budget.currency_format.currency_symbol
        ),
        totalActivity,
        totalActivityFormatted: formatMilliunits(
          totalActivity,
          budget.currency_format.currency_symbol
        ),
        totalAvailable,
        totalAvailableFormatted: formatMilliunits(
          totalAvailable,
          budget.currency_format.currency_symbol
        ),
        groups: categoryGroupSummaries.map((g) => ({
          ...g,
          budgetedFormatted: formatMilliunits(g.budgeted, budget.currency_format.currency_symbol),
          activityFormatted: formatMilliunits(g.activity, budget.currency_format.currency_symbol),
          balanceFormatted: formatMilliunits(g.balance, budget.currency_format.currency_symbol),
        })),
      },
    };

    return JSON.stringify(summary, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get budget summary: ${error.message}`);
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
  return `${symbol}${amount.toFixed(2)}`;
}
