# Getting Started with MCP Tools

This guide will help you set up and run the WHOOP MCP Server.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up WHOOP Credentials

Before you can use the WHOOP MCP server, you need to obtain OAuth credentials from WHOOP:

#### Get Your WHOOP Developer Credentials

1. Visit [WHOOP Developer Portal](https://developer.whoop.com)
2. Sign in with your WHOOP account
3. Create a new application
4. Note your **Client ID** and **Client Secret**

#### Obtain a Refresh Token

You'll need to complete an OAuth flow to get a refresh token. Here's the easiest way:

1. **Build the authorization URL** (replace YOUR_CLIENT_ID, YOUR_REDIRECT_URI, and YOUR_RANDOM_STATE):
   ```
   https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=read:recovery%20read:cycles%20read:sleep%20read:workout%20read:profile%20read:body_measurement%20offline&state=YOUR_RANDOM_STATE
   ```
   
   **Note:** `state` must be a random string of at least 8 characters (e.g., `randomstate123`)

2. **Visit the URL** in your browser and authorize the application

3. **Copy the authorization code** from the redirect URL

4. **Exchange the code for tokens** using curl:
   ```bash
   curl --request POST \
     --url https://api.prod.whoop.com/oauth/oauth2/token \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'grant_type=authorization_code' \
     --data-urlencode 'code=YOUR_AUTHORIZATION_CODE' \
     --data-urlencode 'client_id=YOUR_CLIENT_ID' \
     --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
     --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
   ```

5. **Save the refresh_token** from the response

### 3. Configure Environment Variables

```bash
cd packages/whoop-mcp
cp .env.example .env
```

Edit `.env` with your credentials:
```env
WHOOP_CLIENT_ID=your_client_id_here
WHOOP_CLIENT_SECRET=your_client_secret_here
WHOOP_REFRESH_TOKEN=your_refresh_token_here
```

### 4. Build and Run

```bash
# Build the project
pnpm build

# Run in development mode (with hot reload)
pnpm dev
```

## Testing the Server

### Option 1: Use MCP Inspector

The MCP Inspector provides a web UI for testing MCP servers:

```bash
cd packages/whoop-mcp
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js
```

### Option 2: Use with Claude Desktop

1. Build the project: `pnpm build`

2. Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tools/packages/whoop-mcp/dist/index.js"],
      "env": {
        "WHOOP_CLIENT_ID": "your_client_id",
        "WHOOP_CLIENT_SECRET": "your_client_secret",
        "WHOOP_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. Try asking: "What's my WHOOP recovery score today?"

## Available Commands

From the root directory:

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Run all packages in development mode
pnpm dev

# Clean all build artifacts
pnpm clean
```

From the `packages/whoop-mcp` directory:

```bash
# Build the package
pnpm build

# Run in development mode
pnpm dev

# Start the built server
pnpm start

# Clean build artifacts
pnpm clean
```

## Example Queries

Once connected to Claude or Poke, try these queries:

- "What's my WHOOP data for today?"
- "How did I sleep last night?"
- "What's my recovery score?"
- "Show me my strain and activities for yesterday"
- "How is my HRV trending?"

## Troubleshooting

### "Configuration validation failed"
- Make sure all three environment variables are set in your `.env` file
- Check for typos in the variable names
- Ensure there are no extra spaces or quotes

### "Failed to refresh access token"
- Verify your Client ID and Client Secret are correct
- Your refresh token may have expired - obtain a new one
- Check that you requested all required scopes during authorization

### "No data available for this date"
- WHOOP data is only available for past dates
- Recovery data requires a completed sleep session
- Try querying yesterday's data instead

## Next Steps

- Read the [WHOOP MCP README](./packages/whoop-mcp/README.md) for detailed documentation
- Deploy to [Smithery](https://smithery.ai) for production use
- Connect to [Poke](https://interaction.co/mcp) for AI-powered interactions

## Need Help?

- Check the [WHOOP Developer Documentation](https://developer.whoop.com)
- Review the [MCP Specification](https://modelcontextprotocol.io)
- Open an issue on GitHub

