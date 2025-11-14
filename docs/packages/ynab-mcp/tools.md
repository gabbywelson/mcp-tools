# Available Tools

The YNAB MCP server exposes four tools that AI assistants can use to access your YNAB budget data.

## Budget Summary Tool

### `ynab_get_budget_summary`

Get a comprehensive overview of your entire budget including accounts and category totals.

**Parameters:** None

**Returns:**
- Budget name and currency information
- On-budget accounts with balances
- Off-budget (tracking) accounts
- Net worth calculation
- Category group summaries with budgeted/activity/balance totals

**Example:**

```typescript
// Get budget summary
const summary = await client.getBudgetSummary();
```

**Response Format:**

```json
{
  "budget": {
    "id": "a1b2c3d4-...",
    "name": "My Budget",
    "currency": "USD",
    "currencySymbol": "$"
  },
  "accounts": {
    "onBudget": {
      "count": 3,
      "totalBalance": 15000000,
      "totalBalanceFormatted": "$15,000.00",
      "accounts": [
        {
          "id": "...",
          "name": "Checking",
          "type": "checking",
          "balance": 5000000,
          "balanceFormatted": "$5,000.00"
        }
      ]
    },
    "offBudget": {
      "count": 1,
      "totalBalance": 50000000,
      "totalBalanceFormatted": "$50,000.00"
    },
    "netWorth": 65000000,
    "netWorthFormatted": "$65,000.00"
  },
  "categoryGroups": {
    "totalBudgeted": 3000000,
    "totalActivity": -2500000,
    "totalAvailable": 500000,
    "groups": [...]
  }
}
```

**Example Queries:**

> "What's my current budget summary?"

> "Show me all my account balances"

> "What's my net worth?"

> "How much money do I have in my checking account?"

## Category Activity Tool

### `ynab_get_category_activity`

Get detailed category budgeted amounts, activity (spending), and balances for a specific month.

**Parameters:**
- `month` (optional): Month in YYYY-MM-DD format (use first day of month). Defaults to current month.

**Returns:**
- Month summary (income, budgeted, activity, to be budgeted)
- Age of money
- Category groups with all categories
- Budgeted amounts, activity (spending), and balances
- Goal progress for categories with goals

**Example:**

```typescript
// Get current month
const activity = await client.getCategoryActivity();

// Get specific month
const activity = await client.getCategoryActivity("2024-01-01");
```

**Response Format:**

```json
{
  "month": "2024-01-01",
  "monthSummary": {
    "income": 5000000,
    "incomeFormatted": "$5,000.00",
    "budgeted": 4500000,
    "budgetedFormatted": "$4,500.00",
    "activity": -4200000,
    "activityFormatted": "-$4,200.00",
    "toBeBudgeted": 500000,
    "toBeBudgetedFormatted": "$500.00",
    "ageOfMoney": 45
  },
  "categoryGroups": [
    {
      "name": "Immediate Obligations",
      "budgeted": 2000000,
      "budgetedFormatted": "$2,000.00",
      "activity": -1950000,
      "activityFormatted": "-$1,950.00",
      "balance": 50000,
      "balanceFormatted": "$50.00",
      "categories": [
        {
          "name": "Rent",
          "budgeted": 1500000,
          "activity": -1500000,
          "balance": 0,
          "goalType": "TB",
          "goalTarget": 1500000
        }
      ]
    }
  ]
}
```

**Example Queries:**

> "How much did I spend on groceries this month?"

> "Show me my category activity for January 2024"

> "What categories am I overspending in?"

> "Which categories have unmet goals?"

> "How much do I have left to budget?"

## Recent Transactions Tool

### `ynab_list_recent_transactions`

List recent transactions with optional date filter and limit.

**Parameters:**
- `since_date` (optional): Only show transactions on or after this date (YYYY-MM-DD format)
- `limit` (optional): Maximum number of transactions to return (default: 20, max: 100)

**Returns:**
- Transaction list with date, payee, category, amount, cleared status
- Summary statistics (total inflow, outflow, net)
- Formatted currency amounts

**Example:**

```typescript
// Get last 20 transactions
const transactions = await client.getRecentTransactions();

// Get transactions since a date
const transactions = await client.getRecentTransactions("2024-01-01");

// Get last 50 transactions
const transactions = await client.getRecentTransactions(undefined, 50);
```

**Response Format:**

```json
{
  "summary": {
    "transactionCount": 20,
    "sinceDate": "2024-01-01",
    "totalInflow": 5000000,
    "totalInflowFormatted": "$5,000.00",
    "totalOutflow": 3500000,
    "totalOutflowFormatted": "$3,500.00",
    "netAmount": 1500000,
    "netAmountFormatted": "$1,500.00"
  },
  "transactions": [
    {
      "id": "...",
      "date": "2024-01-15",
      "amount": -50000,
      "amountFormatted": "-$50.00",
      "payee": "Grocery Store",
      "category": "Groceries",
      "account": "Checking",
      "memo": "Weekly shopping",
      "cleared": "cleared",
      "approved": true,
      "flagColor": null
    }
  ]
}
```

**Example Queries:**

> "Show me my recent transactions"

> "What transactions have I made since January 1st?"

> "List my last 50 transactions"

> "What did I spend money on this week?"

> "Show me all my grocery transactions"

## Create Transaction Tool

### `ynab_create_transaction`

Create a new transaction in YNAB.

**Parameters:**
- `account_id` (required): Account UUID from YNAB
- `date` (required): Transaction date in YYYY-MM-DD format
- `amount` (required): Amount in milliunits (1000 = $1.00)
  - Negative amounts = outflows (expenses)
  - Positive amounts = inflows (income)
- `payee_name` (optional): Name of the payee
- `memo` (optional): Transaction note/memo
- `category_id` (optional): Category UUID from YNAB

**Returns:**
- Created transaction details
- Confirmation message
- Formatted amount

**Example:**

```typescript
// Create an expense
const result = await client.createTransaction(
  "account-uuid",
  "2024-01-15",
  -50000,  // -$50.00
  "Grocery Store",
  "Weekly shopping",
  "category-uuid"
);

// Create income
const result = await client.createTransaction(
  "account-uuid",
  "2024-01-15",
  1000000,  // $1,000.00
  "Employer",
  "Paycheck"
);
```

**Response Format:**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "id": "...",
    "date": "2024-01-15",
    "amount": -50000,
    "amountFormatted": "-$50.00",
    "payee": "Grocery Store",
    "category": "Groceries",
    "account": "Checking",
    "memo": "Weekly shopping",
    "cleared": "uncleared",
    "approved": true
  }
}
```

**Example Queries:**

> "Add a $50 grocery transaction to my checking account"

> "Create a transaction for $25.50 at Starbucks"

> "Record a $1000 paycheck deposit"

> "Add a $75 gas expense"

::: warning Important
To create transactions, you need to know your account IDs and category IDs. Use `ynab_get_budget_summary` to find these IDs first.
:::

## Understanding Milliunits

All amounts in YNAB are in **milliunits** to avoid floating-point precision issues:

- **1 milliunit = $0.001** (one-thousandth of a dollar)
- **1000 milliunits = $1.00**

### Conversion Examples:

| Dollars | Milliunits | Notes |
|---------|------------|-------|
| $10.00 | 10,000 | Positive = income |
| $50.75 | 50,750 | |
| -$25.50 | -25,500 | Negative = expense |
| -$100.00 | -100,000 | |

### Quick Conversion:
- **Dollars to milliunits**: multiply by 1000
- **Milliunits to dollars**: divide by 1000

The MCP tools automatically format milliunits to readable currency strings (e.g., "$50.00") in all responses.

## Using Tools with AI Assistants

### Claude Desktop

Once configured, you can ask Claude natural language questions:

> "What's my budget summary?"

> "How much did I spend on dining out this month?"

> "Show me my transactions from last week"

> "Add a $30 transaction for coffee"

Claude will automatically:
1. Call the appropriate MCP tool
2. Parse the response
3. Format it in a human-readable way
4. Answer your question

### Poke

Connect your Smithery-deployed YNAB MCP server to Poke, then ask:

> "Give me a spending report for January"

> "Compare my grocery spending to my budget"

> "What's my net worth trend?"

Poke can make multiple tool calls and aggregate data across months.

## Error Handling

All tools handle errors gracefully with clear messages:

```json
{
  "error": "Invalid or expired access token. Please check your YNAB_ACCESS_TOKEN."
}
```

Common errors:
- **Invalid token**: Access token is wrong or revoked
- **Resource not found**: Budget ID or account/category ID doesn't exist
- **Rate limit exceeded**: Made more than 200 requests in past hour
- **Invalid date**: Date format must be YYYY-MM-DD
- **Invalid amount**: Amount must be a number in milliunits

## Rate Limiting

YNAB's API has rate limits:
- **200 requests per hour** per access token
- Rate limit resets every hour
- Exceeding returns HTTP 429 error

The client handles rate limit errors with clear messages.

## Data Freshness

YNAB data is updated in real-time:
- **Transactions**: Immediately available after creation
- **Balances**: Updated with each transaction
- **Budgets**: Updated when you make budget changes
- **Categories**: Reflect current month's activity

## Privacy & Security

All data access:
- ✅ Requires valid Personal Access Token
- ✅ Uses secure HTTPS connections
- ✅ Respects YNAB's data policies
- ✅ Only accesses the budget you specify

## Next Steps

- [Configuration](./configuration) - Configure the server
- [Getting Started](./getting-started) - Set up from scratch
- [YNAB API Documentation](https://api.ynab.com) - Official API reference

## Advanced Usage

### Finding Account and Category IDs

To create transactions, you need account and category IDs. Get them with:

> "Show me my budget summary"

The response will include all account and category IDs.

### Multi-Month Analysis

AI assistants can make multiple calls for trend analysis:

> "Compare my spending in January vs February"

The AI will call `ynab_get_category_activity` for both months and compare.

### Budget Health Checks

> "Am I on track with my budget this month?"

The AI will analyze your budgeted amounts vs actual spending.

### Transaction Patterns

> "What are my most common expenses?"

The AI will analyze recent transactions to identify patterns.

## API Reference

For developers building custom integrations, see the TypeScript types:

```typescript
// packages/ynab-mcp/src/types.ts

interface BudgetSummary {
  id: string;
  name: string;
  currency_format: {
    iso_code: string;
    currency_symbol: string;
  };
  accounts?: Account[];
  categories?: Category[];
}

interface Transaction {
  id: string;
  date: string;
  amount: number;  // in milliunits
  payee_name: string | null;
  category_name: string | null;
  cleared: "cleared" | "uncleared" | "reconciled";
  approved: boolean;
}

interface SaveTransaction {
  account_id: string;
  date: string;
  amount: number;  // in milliunits
  payee_name?: string;
  memo?: string;
  category_id?: string;
}
```

See the [source code](https://github.com/gabbywelson/mcp-tools/tree/main/packages/ynab-mcp/src) for complete type definitions.

