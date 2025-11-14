# Getting Started with YNAB MCP

This guide will walk you through setting up the YNAB MCP server from scratch.

## Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- A YNAB account with active subscription
- YNAB Personal Access Token

## Step 1: Install Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/gabbywelson/mcp-tools.git
cd mcp-tools
pnpm install
```

## Step 2: Get Your Personal Access Token

1. Sign in to [YNAB](https://app.ynab.com)
2. Click your email in the bottom left corner
3. Select **Account Settings**
4. Navigate to **Developer Settings**
5. Under **Personal Access Tokens**, click **New Token**
6. Enter a descriptive name (e.g., "MCP Server" or "Claude Desktop")
7. Click **Generate**
8. **Copy the token immediately** - you won't be able to see it again!

::: warning
Store your Personal Access Token securely. It provides full access to your YNAB data.
:::

## Step 3: Get Your Budget ID

You need your budget's unique identifier. Choose one of these methods:

### Method 1: From the URL (Recommended)

1. Open your budget in the YNAB web app
2. Look at the browser URL bar
3. The URL format is: `https://app.ynab.com/{budget_id}/budget`
4. Copy the UUID (the long string of letters and numbers between the slashes)

Example:
```
URL: https://app.ynab.com/a1b2c3d4-e5f6-7890-abcd-ef1234567890/budget
Budget ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Method 2: Use "last-used"

You can use the special value `last-used` which automatically uses your most recently accessed budget:

```bash
YNAB_BUDGET_ID=last-used
```

### Method 3: Via API

Use curl with your access token:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://api.ynab.com/v1/budgets
```

Find your budget in the response and copy its `id` field.

## Step 4: Configure Environment

Create a `.env` file in `packages/ynab-mcp/`:

```bash
cd packages/ynab-mcp
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
YNAB_ACCESS_TOKEN=your_personal_access_token_here
YNAB_BUDGET_ID=your_budget_id_or_last-used
```

## Step 5: Build the Server

Build the TypeScript code:

```bash
# From the root directory
pnpm build

# Or from the package directory
cd packages/ynab-mcp
pnpm build
```

## Step 6: Test the Server

Run the server:

```bash
# From the root directory
pnpm --filter @mcp-tools/ynab-mcp start

# Or from the package directory
cd packages/ynab-mcp
pnpm start
```

You should see:

```
YNAB MCP Server running on stdio
```

## Step 7: Connect to an AI Assistant

### Option A: Claude Desktop

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ynab": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tools/packages/ynab-mcp/dist/index.js"],
      "env": {
        "YNAB_ACCESS_TOKEN": "your-access-token",
        "YNAB_BUDGET_ID": "your-budget-id"
      }
    }
  }
}
```

::: tip
Replace `/absolute/path/to/mcp-tools/` with the actual full path on your system.
:::

Restart Claude Desktop.

### Option B: MCP Inspector (Testing)

Use the MCP Inspector to test your server:

```bash
cd packages/ynab-mcp
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web UI at `http://localhost:5173` where you can test the MCP tools.

### Option C: Smithery + Poke

Deploy to Smithery for use with Poke:

```bash
cd packages/ynab-mcp
smithery deploy
```

Then connect in Poke settings.

## Verify It Works

Try asking Claude (or your AI assistant):

> "What's my budget summary?"

> "How much did I spend on groceries this month?"

> "Show me my recent transactions"

You should get responses with your actual YNAB data!

## Next Steps

- [Configuration](./configuration) - Learn about all config options
- [Available Tools](./tools) - See what data you can access
- [API Reference](https://api.ynab.com) - YNAB API documentation

## Troubleshooting

### "Invalid environment variables"

Make sure your `.env` file exists and has both required variables:

```bash
# Check if file exists
ls -la packages/ynab-mcp/.env

# Verify it has both variables
cat packages/ynab-mcp/.env
```

### "Invalid or expired access token"

Your Personal Access Token may be invalid:

1. Go to YNAB Account Settings → Developer Settings
2. Check if your token still exists
3. If not, create a new token
4. Update `YNAB_ACCESS_TOKEN` in `.env`
5. Restart the server

### "Resource not found"

Your Budget ID may be incorrect:

1. Verify the Budget ID in your `.env` file
2. Try using `last-used` instead
3. Check the YNAB web app URL to confirm the correct ID

### "Rate limit exceeded"

You've made more than 200 requests in the past hour:

1. Wait for the rate limit to reset (up to 1 hour)
2. Reduce the frequency of requests
3. Consider caching responses if building custom integrations

### "Cannot find module"

Make sure you've run `pnpm build` first:

```bash
cd packages/ynab-mcp
pnpm build
```

### "Command not found: node"

Install Node.js 18 or higher from [nodejs.org](https://nodejs.org/).

## Development

For development with hot reload:

```bash
cd packages/ynab-mcp
pnpm dev
```

Run tests:

```bash
pnpm test
```

Format and lint:

```bash
pnpm check
```

## Getting Help

- Check the [Configuration Guide](./configuration)
- Review [Available Tools](./tools)
- Read the [YNAB API Documentation](https://api.ynab.com)
- Open an issue on GitHub

## What's Next?

Now that you have the YNAB MCP server running, you can:

1. **Explore the tools** - See [Available Tools](./tools)
2. **Build integrations** - Use the MCP protocol
3. **Automate budgeting** - Create custom workflows
4. **Contribute** - Help improve the project

Happy budgeting! 💰

