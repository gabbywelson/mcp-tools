import type { YnabClient } from "../ynab-client.js";

/**
 * Get category budgeted amounts, activity, and balances for a specific month
 */
export async function getCategoryActivity(client: YnabClient, month?: string): Promise<string> {
  try {
    // Get month data (defaults to current month if not provided)
    const monthDetail = await client.getCategories(undefined, month);

    // Get budget info for currency formatting
    const budgetDetail = await client.getBudget();
    const currencySymbol = budgetDetail.budget.currency_format.currency_symbol;

    // Group categories by category group
    interface CategoryDisplay {
      id: string;
      name: string;
      budgeted: number;
      budgetedFormatted: string;
      activity: number;
      activityFormatted: string;
      balance: number;
      balanceFormatted: string;
      goalType: string | null;
      goalTarget: number | null;
      goalTargetFormatted: string | null;
      goalPercentageComplete: number | null;
    }
    const categoryMap = new Map<string, CategoryDisplay[]>();

    for (const category of monthDetail.categories) {
      if (category.deleted || category.hidden) {
        continue;
      }

      const groupName = category.category_group_name || "Unknown";
      if (!categoryMap.has(groupName)) {
        categoryMap.set(groupName, []);
      }

      categoryMap.get(groupName)?.push({
        id: category.id,
        name: category.name,
        budgeted: category.budgeted,
        budgetedFormatted: formatMilliunits(category.budgeted, currencySymbol),
        activity: category.activity,
        activityFormatted: formatMilliunits(category.activity, currencySymbol),
        balance: category.balance,
        balanceFormatted: formatMilliunits(category.balance, currencySymbol),
        goalType: category.goal_type,
        goalTarget: category.goal_target,
        goalTargetFormatted: category.goal_target
          ? formatMilliunits(category.goal_target, currencySymbol)
          : null,
        goalPercentageComplete: category.goal_percentage_complete,
      });
    }

    // Calculate totals and group summaries
    const groups = Array.from(categoryMap.entries()).map(([groupName, categories]) => {
      const groupBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
      const groupActivity = categories.reduce((sum, c) => sum + c.activity, 0);
      const groupBalance = categories.reduce((sum, c) => sum + c.balance, 0);

      return {
        name: groupName,
        budgeted: groupBudgeted,
        budgetedFormatted: formatMilliunits(groupBudgeted, currencySymbol),
        activity: groupActivity,
        activityFormatted: formatMilliunits(groupActivity, currencySymbol),
        balance: groupBalance,
        balanceFormatted: formatMilliunits(groupBalance, currencySymbol),
        categoryCount: categories.length,
        categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
      };
    });

    const totalBudgeted = groups.reduce((sum, g) => sum + g.budgeted, 0);
    const totalActivity = groups.reduce((sum, g) => sum + g.activity, 0);
    const totalBalance = groups.reduce((sum, g) => sum + g.balance, 0);

    const analysis = {
      month: monthDetail.month,
      monthSummary: {
        income: monthDetail.income,
        incomeFormatted: formatMilliunits(monthDetail.income, currencySymbol),
        budgeted: monthDetail.budgeted,
        budgetedFormatted: formatMilliunits(monthDetail.budgeted, currencySymbol),
        activity: monthDetail.activity,
        activityFormatted: formatMilliunits(monthDetail.activity, currencySymbol),
        toBeBudgeted: monthDetail.to_be_budgeted,
        toBeBudgetedFormatted: formatMilliunits(monthDetail.to_be_budgeted, currencySymbol),
        ageOfMoney: monthDetail.age_of_money,
      },
      totals: {
        budgeted: totalBudgeted,
        budgetedFormatted: formatMilliunits(totalBudgeted, currencySymbol),
        activity: totalActivity,
        activityFormatted: formatMilliunits(totalActivity, currencySymbol),
        balance: totalBalance,
        balanceFormatted: formatMilliunits(totalBalance, currencySymbol),
      },
      categoryGroups: groups.sort((a, b) => a.name.localeCompare(b.name)),
    };

    return JSON.stringify(analysis, null, 2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category activity: ${error.message}`);
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
