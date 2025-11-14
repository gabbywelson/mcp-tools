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

## Quick Start

### 1. Get Your Personal Access Token

1. Sign in to [YNAB](https://app.ynab.com)
2. Go to **Account Settings** (click your email in bottom left)
3. Navigate to **Developer Settings**
4. Under **Personal Access Tokens**, click **New Token**
5. Enter a name for your token (e.g., "MCP Server")
6. Click **Generate** and copy the token immediately

### 2. Get Your Budget ID

**Option 1: From the URL**
- Open your budget in YNAB web app
- Look at the URL: `https://app.ynab.com/{budget_id}/budget`
- Copy the UUID between the domain and `/budget`

**Option 2: Use "last-used"**
- You can use the special value `last-used` to automatically use your most recently accessed budget

### 3. Install and Configure

```bash
# Clone the repository
git clone https://github.com/gabbywelson/mcp-tools.git
cd mcp-tools

# Install dependencies
pnpm install

# Configure environment
cd packages/ynab-mcp
cp .env.example .env
# Edit .env with your credentials

# Build the server
pnpm build

# Test it
pnpm dev
```

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

## Available Tools

### ynab_get_budget_summary

Get comprehensive budget overview including all accounts and category totals.

**Example queries:**
- "What's my current budget summary?"
- "Show me all my account balances"
- "What's my net worth according to YNAB?"

### ynab_get_category_activity

Get detailed category spending analysis for a specific month.

**Example queries:**
- "How much did I spend on groceries this month?"
- "Show me my category activity for January 2024"
- "What categories am I overspending in?"

### ynab_list_recent_transactions

List recent transactions with optional filtering.

**Example queries:**
- "Show me my recent transactions"
- "What transactions have I made since January 1st?"
- "List my last 50 transactions"

### ynab_create_transaction

Create a new transaction in YNAB.

**Example queries:**
- "Add a $50 grocery transaction to my checking account"
- "Create a transaction for $25.50 at Starbucks"
- "Record a $1000 paycheck deposit"

## Understanding Milliunits

YNAB uses **milliunits** for all currency amounts:

- **1 milliunit = $0.001** (one-thousandth of a dollar)
- **1000 milliunits = $1.00**

### Examples:
- $10.00 = 10,000 milliunits
- $50.75 = 50,750 milliunits
- -$25.50 = -25,500 milliunits (expense)

The MCP tools automatically format milliunits to readable currency strings in responses.

## API Rate Limits

YNAB API has the following limits:
- **200 requests per hour** per access token
- Rate limit resets every hour
- Exceeding the limit returns a 429 error

## Security Best Practices

- **Never commit** your `.env` file or share your access token
- Store access tokens securely
- Revoke and regenerate tokens if compromised
- Use environment variables for production deployments

## Documentation

- [Getting Started](./getting-started) - Complete setup guide
- [Configuration](./configuration) - Environment variables and settings
- [Available Tools](./tools) - Detailed tool documentation

## Resources

- [YNAB API Documentation](https://api.ynab.com)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Smithery Documentation](https://smithery.ai/docs)
- [T3 Env Documentation](https://env.t3.gg)

## Support

For issues related to:
- **YNAB API**: Contact YNAB Support or check [YNAB API docs](https://api.ynab.com)
- **MCP Server**: Open an issue on GitHub
- **Smithery Deployment**: Contact Smithery Support
- **Poke Integration**: Contact Poke Support

