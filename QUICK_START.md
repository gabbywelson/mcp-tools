# Quick Start Guide

Get your WHOOP MCP Server running in 5 minutes!

## Prerequisites

- Node.js 18+
- pnpm 8+
- WHOOP account with active membership

## 1. Install Dependencies (30 seconds)

```bash
pnpm install
```

## 2. Get WHOOP Credentials (2-3 minutes)

### Get Client ID & Secret

1. Go to [developer.whoop.com](https://developer.whoop.com)
2. Create an application
3. Copy your Client ID and Client Secret

### Get Refresh Token

1. Build this URL (replace YOUR_CLIENT_ID, YOUR_REDIRECT_URI, and add a random state):

   ```
   https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=read:recovery%20read:cycles%20read:sleep%20read:workout%20read:profile%20read:body_measurement%20offline&state=randomstate123
   ```
   
   **Note:** `state` must be at least 8 characters for security

2. Visit the URL, authorize, and copy the `code` from the redirect

3. Exchange for tokens:

   ```bash
   curl --request POST \
     --url https://api.prod.whoop.com/oauth/oauth2/token \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'grant_type=authorization_code' \
     --data-urlencode 'code=YOUR_CODE' \
     --data-urlencode 'client_id=YOUR_CLIENT_ID' \
     --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
     --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
   ```

4. Save the `refresh_token` from the response

## 3. Configure Environment (30 seconds)

```bash
cd packages/whoop-mcp
cp .env.example .env
```

Edit `.env`:

```env
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REFRESH_TOKEN=your_refresh_token
```

## 4. Build & Test (1 minute)

```bash
# Build
pnpm build

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node packages/whoop-mcp/dist/index.js
```

## 5. Use It!

### With MCP Inspector

1. Open the web interface that launched
2. Click on any tool (e.g., `whoop_get_overview`)
3. Click "Run Tool"
4. See your WHOOP data!

### With Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Restart Claude and ask: "What's my WHOOP recovery score today?"

## Available Tools

1. **whoop_get_overview** - Complete daily summary
2. **whoop_get_sleep** - Sleep analysis
3. **whoop_get_recovery** - Recovery metrics with trends
4. **whoop_get_strain** - Strain and activities
5. **whoop_get_healthspan** - Biological age (when available)

## Example Queries

- "What's my WHOOP data for today?"
- "How did I sleep last night?"
- "What's my recovery score?"
- "Show me my activities and strain for yesterday"
- "How is my HRV trending?"

## Troubleshooting

**"Configuration validation failed"**
→ Check your `.env` file has all three variables

**"Failed to refresh access token"**
→ Verify your credentials are correct, get a new refresh token

**"No data available"**
→ Try querying yesterday's data instead of today

## Need More Help?

- **Detailed Setup**: [INSTALLATION.md](./INSTALLATION.md)
- **Full Documentation**: [packages/whoop-mcp/README.md](./packages/whoop-mcp/README.md)
- **OAuth Guide**: [packages/whoop-mcp/scripts/get-refresh-token.md](./packages/whoop-mcp/scripts/get-refresh-token.md)
- **Getting Started**: [GETTING_STARTED.md](./GETTING_STARTED.md)

## Deploy to Production

For production use with Poke:

1. Deploy to [Smithery](https://smithery.ai)
2. Configure your credentials in Smithery UI
3. Connect to Poke
4. Start asking questions about your fitness data!

---

**That's it!** You now have a working WHOOP MCP Server. 🎉
