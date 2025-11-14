# Getting Started with WHOOP MCP

This guide will walk you through setting up the WHOOP MCP server from scratch.

## Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- A WHOOP account
- WHOOP Developer credentials

## Step 1: Install Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/mcp-tools.git
cd mcp-tools
pnpm install
```

## Step 2: Get WHOOP Developer Credentials

1. Visit the [WHOOP Developer Portal](https://developer.whoop.com)
2. Sign in with your WHOOP account
3. Create a new application
4. Note your **Client ID** and **Client Secret**

## Step 3: Get a Refresh Token

Follow the [OAuth Setup Guide](./oauth-setup) to obtain a refresh token.

Quick version:

1. Build authorization URL with your client ID
2. Visit URL and authorize the app
3. Exchange authorization code for tokens
4. Save the refresh token

## Step 4: Configure Environment

Create a `.env` file in `packages/whoop-mcp/`:

```bash
cd packages/whoop-mcp
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
WHOOP_CLIENT_ID=your-client-id-here
WHOOP_CLIENT_SECRET=your-client-secret-here
WHOOP_REFRESH_TOKEN=your-refresh-token-here
```

## Step 5: Build the Server

Build the TypeScript code:

```bash
# From the root directory
pnpm build

# Or from the package directory
cd packages/whoop-mcp
pnpm build
```

## Step 6: Test the Server

Run the server:

```bash
# From the root directory
pnpm --filter @mcp-tools/whoop-mcp start

# Or from the package directory
cd packages/whoop-mcp
pnpm start
```

You should see:

```
WHOOP MCP Server running on stdio
```

## Step 7: Connect to an AI Assistant

### Option A: Claude Desktop

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tools/packages/whoop-mcp/dist/index.js"],
      "env": {
        "WHOOP_CLIENT_ID": "your-client-id",
        "WHOOP_CLIENT_SECRET": "your-client-secret",
        "WHOOP_REFRESH_TOKEN": "your-refresh-token"
      }
    }
  }
}
```

Restart Claude Desktop.

### Option B: MCP Inspector (Testing)

Use the MCP Inspector to test your server:

```bash
cd packages/whoop-mcp
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web UI where you can test the MCP tools.

### Option C: Smithery + Poke

Deploy to Smithery for use with Poke:

```bash
cd packages/whoop-mcp
smithery deploy
```

Then connect in Poke.

## Verify It Works

Try asking Claude (or your AI assistant):

> "What's my WHOOP recovery score today?"

You should get a response with your actual recovery data!

## Next Steps

- [Configuration](./configuration) - Learn about all config options
- [Available Tools](./tools) - See what data you can access
- [OAuth Setup](./oauth-setup) - Detailed OAuth flow guide

## Troubleshooting

### "Invalid environment variables"

Make sure your `.env` file exists and has all three required variables.

### "Token refresh failed"

Your refresh token may be invalid or expired. Get a new one following the [OAuth Setup Guide](./oauth-setup).

### "Cannot find module"

Make sure you've run `pnpm build` first.

### "Command not found: node"

Install Node.js 18 or higher from [nodejs.org](https://nodejs.org/).

## Development

For development with hot reload:

```bash
cd packages/whoop-mcp
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
- Open an issue on GitHub
- Join our Discord community

## What's Next?

Now that you have the WHOOP MCP server running, you can:

1. **Explore the tools** - See [Available Tools](./tools)
2. **Build integrations** - Use the MCP protocol
3. **Add more servers** - Extend the monorepo
4. **Contribute** - Help improve the project

Happy hacking! 🚀

