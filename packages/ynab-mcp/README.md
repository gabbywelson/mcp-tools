# YNAB MCP Server

A Model Context Protocol (MCP) server for accessing YNAB (You Need A Budget) data using Personal Access Token authentication. Integrate your YNAB budget and transaction data into Claude, Poke, and other MCP-compatible applications.

## Features

- **Budget Summary** - Complete overview of accounts, balances, and category totals
- **Category Activity** - Detailed spending analysis by category for any month
- **Recent Transactions** - List and filter transactions with full details
- **Create Transactions** - Add new transactions programmatically
- **Simple Authentication** - Uses YNAB Personal Access Tokens (no OAuth flow required)
- **Type-Safe Configuration** - Built with T3 Env for runtime validation and type safety

## Prerequisites

1. **YNAB Account** - Active YNAB subscription
2. **Personal Access Token** - Generated from YNAB Account Settings
3. **Budget ID** - Your YNAB budget identifier

## Getting Your Credentials

### Step 1: Get Your Personal Access Token

1. Sign in to [YNAB](https://app.ynab.com)
2. Go to **Account Settings** (click your email in bottom left)
3. Navigate to **Developer Settings**
4. Under **Personal Access Tokens**, click **New Token**
5. Enter a name for your token (e.g., "MCP Server")
6. Click **Generate** and copy the token immediately (you won't be able to see it again!)

### Step 2: Get Your Budget ID

**Option 1: From the URL**
- Open your budget in YNAB web app
- Look at the URL: `https://app.ynab.com/{budget_id}/budget`
- Copy the UUID between the domain and `/budget`

**Option 2: Use "last-used"**
- You can use the special value `last-used` to automatically use your most recently accessed budget

**Option 3: From the API**
- Use the token to call: `https://api.ynab.com/v1/budgets`
- Find your budget's `id` in the response

## Installation

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gabbywelson/mcp-tools.git
   cd mcp-tools
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cd packages/ynab-mcp
   cp .env.example .env
   ```

4. **Edit `.env` with your credentials**:
   ```env
   YNAB_ACCESS_TOKEN=your_personal_access_token_here
   YNAB_BUDGET_ID=your_budget_id_or_last-used
   ```

5. **Build the project**:
   ```bash
   pnpm build
   ```

6. **Run in development mode**:
   ```bash
   pnpm dev
   ```

### Deployment on Smithery

1. **Deploy to Smithery** using their CLI or web interface

2. **Configure via Smithery UI**:
   - Access Token: Your YNAB Personal Access Token
   - Budget ID: Your YNAB Budget ID (or "last-used")

3. **Connect to Poke or other MCP clients**

## Using with Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ynab": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tools/packages/ynab-mcp/dist/index.js"],
      "env": {
        "YNAB_ACCESS_TOKEN": "your_personal_access_token_here",
        "YNAB_BUDGET_ID": "your_budget_id_or_last-used"
      }
    }
  }
}
```

Replace `/absolute/path/to/mcp-tools/` with the actual path to this directory.

## Using with Poke

1. **Deploy the MCP server** on Smithery or run it locally

2. **Add to Poke**:
   - Go to Poke settings
   - Add new MCP server
   - Provide the server URL or stdio configuration
   - Configure your YNAB credentials

3. **Start using**: Ask Poke questions about your YNAB budget!

## Available Tools

### ynab_get_budget_summary

Retrieves comprehensive budget overview including all accounts and category totals.

**Parameters:** None

**Returns:**
- Budget name and currency information
- On-budget accounts with balances
- Off-budget (tracking) accounts
- Net worth calculation
- Category group summaries with budgeted/activity/balance totals

**Example queries:**
```
"What's my current budget summary?"
"Show me all my account balances"
"What's my net worth according to YNAB?"
```

### ynab_get_category_activity

Retrieves detailed category spending analysis for a specific month.

**Parameters:**
- `month` (optional) - Month in YYYY-MM-DD format (use first day of month). Defaults to current month.

**Returns:**
- Month summary (income, budgeted, activity, to be budgeted)
- Age of money
- Category groups with all categories
- Budgeted amounts, activity (spending), and balances
- Goal progress for categories with goals

**Example queries:**
```
"How much did I spend on groceries this month?"
"Show me my category activity for January 2024"
"What categories am I overspending in?"
"Which categories have unmet goals?"
```

### ynab_list_recent_transactions

Lists recent transactions with optional filtering.

**Parameters:**
- `since_date` (optional) - Only show transactions on or after this date (YYYY-MM-DD format)
- `limit` (optional) - Maximum number of transactions to return (default: 20, max: 100)

**Returns:**
- Transaction list with date, payee, category, amount, cleared status
- Summary statistics (total inflow, outflow, net)
- Formatted currency amounts

**Example queries:**
```
"Show me my recent transactions"
"What transactions have I made since January 1st?"
"List my last 50 transactions"
"What did I spend money on this week?"
```

### ynab_create_transaction

Creates a new transaction in YNAB.

**Parameters:**
- `account_id` (required) - Account UUID from YNAB
- `date` (required) - Transaction date in YYYY-MM-DD format
- `amount` (required) - Amount in milliunits (1000 = $1.00)
  - Negative amounts = outflows (expenses)
  - Positive amounts = inflows (income)
- `payee_name` (optional) - Name of the payee
- `memo` (optional) - Transaction note/memo
- `category_id` (optional) - Category UUID from YNAB

**Returns:**
- Created transaction details
- Confirmation message
- Formatted amount

**Example queries:**
```
"Add a $50 grocery transaction to my checking account"
"Create a transaction for $25.50 at Starbucks"
"Record a $1000 paycheck deposit"
```

**Important Notes:**
- Amounts must be in milliunits: multiply dollars by 1000
  - $50.00 = 50000 milliunits
  - -$25.50 = -25500 milliunits (negative for expenses)
- You'll need account IDs and category IDs from your budget (use `ynab_get_budget_summary` to find them)

## Understanding YNAB Milliunits

YNAB uses **milliunits** for all currency amounts to avoid floating-point precision issues:

- **1 milliunit = $0.001** (one-thousandth of a dollar)
- **1000 milliunits = $1.00**

### Examples:
- $10.00 = 10,000 milliunits
- $50.75 = 50,750 milliunits
- -$25.50 = -25,500 milliunits (expense)

### Quick Conversion:
- **Dollars to milliunits**: multiply by 1000
- **Milliunits to dollars**: divide by 1000

The MCP tools automatically format milliunits to readable currency strings in responses.

## How It Works

The server uses YNAB's Personal Access Token for authentication:

1. Token is included in Authorization header for all requests
2. No token refresh needed (tokens don't expire unless revoked)
3. All data is fetched in real-time from YNAB API
4. Rate limit: 200 requests per hour per token

### Type-Safe Configuration

This project uses [T3 Env](https://env.t3.gg/) for environment variable management:

- ✅ Runtime validation on startup
- ✅ Full TypeScript type safety
- ✅ Clear error messages for invalid config
- ✅ Zero runtime overhead

## API Rate Limits

YNAB API has the following limits:
- **200 requests per hour** per access token
- Rate limit resets every hour
- Exceeding the limit returns a 429 error

**Tips:**
- Cache responses when possible
- Batch related queries together
- Use `since_date` parameter to limit transaction queries

## Security Best Practices

- **Never commit** your `.env` file or share your access token
- Store access tokens securely
- Revoke and regenerate tokens if compromised
- Use environment variables for production deployments
- Don't share tokens between applications

## Troubleshooting

### "Configuration validation failed"
- Ensure both `YNAB_ACCESS_TOKEN` and `YNAB_BUDGET_ID` are set
- Check for typos in variable names
- Verify values are not empty strings

### "Invalid or expired access token"
- Verify your Personal Access Token is correct
- Check if token was revoked in YNAB settings
- Generate a new token if needed

### "Resource not found"
- Verify your Budget ID is correct
- Try using "last-used" as the budget ID
- Check that account/category IDs exist in your budget

### "Rate limit exceeded"
- You've made more than 200 requests in the past hour
- Wait for the rate limit to reset
- Reduce the frequency of requests

### "No transactions found"
- Check the `since_date` parameter isn't too restrictive
- Verify your budget has transactions
- Try without any date filter first

## Development

### Project Structure

```
packages/ynab-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── env.ts                # T3 Env configuration
│   ├── config.ts             # Configuration exports
│   ├── types.ts              # TypeScript type definitions
│   ├── ynab-client.ts        # YNAB API client
│   └── tools/                # MCP tool implementations
│       ├── budget-summary.ts
│       ├── category-activity.ts
│       ├── recent-transactions.ts
│       └── create-transaction.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Building

```bash
pnpm build
```

### Running in Development

```bash
pnpm dev
```

### Testing with MCP Inspector

The MCP Inspector provides a web UI for testing your MCP server.

**Using your `.env` file (recommended)**:

```bash
# From packages/ynab-mcp directory
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js
```

**Setting environment variables inline**:

```bash
YNAB_ACCESS_TOKEN=your_token \
YNAB_BUDGET_ID=your_budget_id \
npx @modelcontextprotocol/inspector node dist/index.js
```

The inspector will open in your browser at `http://localhost:5173`

### Running Tests

```bash
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once
pnpm test:coverage # Generate coverage report
```

### Code Quality

```bash
pnpm check         # Format and lint (auto-fix)
pnpm format        # Format with Biome
pnpm lint          # Lint with Biome
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see LICENSE file for details

## Resources

- [YNAB API Documentation](https://api.ynab.com)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Smithery Documentation](https://smithery.ai/docs)
- [Poke AI Assistant](https://interaction.co/mcp)
- [T3 Env Documentation](https://env.t3.gg)

## Support

For issues related to:
- **YNAB API**: Contact YNAB Support or check [YNAB API docs](https://api.ynab.com)
- **MCP Server**: Open an issue on GitHub
- **Smithery Deployment**: Contact Smithery Support
- **Poke Integration**: Contact Poke Support

## Acknowledgments

Built with:
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- [T3 Env](https://env.t3.gg/) for type-safe environment variables
- [Axios](https://axios-http.com/) for HTTP requests
- [Zod](https://zod.dev/) for schema validation

