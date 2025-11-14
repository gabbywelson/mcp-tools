# Configuration

The YNAB MCP server uses environment variables for configuration, validated with [T3 Env](https://env.t3.gg/) for type safety.

## Environment Variables

Create a `.env` file in the `packages/ynab-mcp` directory:

```bash
YNAB_ACCESS_TOKEN=your_personal_access_token_here
YNAB_BUDGET_ID=your_budget_id_or_last-used
```

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `YNAB_ACCESS_TOKEN` | Personal Access Token | [YNAB Account Settings](https://app.ynab.com) → Developer Settings |
| `YNAB_BUDGET_ID` | Budget UUID or "last-used" | Budget URL or API |

## Type-Safe Configuration

The server uses T3 Env for runtime validation:

```typescript
import { env } from "./env.js";

// Type-safe access to environment variables
console.log(env.YNAB_ACCESS_TOKEN);
console.log(env.YNAB_BUDGET_ID);
```

### Validation

Environment variables are validated on startup:

- ✅ All required variables must be present
- ✅ Variables must be non-empty strings
- ✅ Clear error messages if validation fails

Example error:

```
❌ Invalid environment variables:
{
  YNAB_ACCESS_TOKEN: [ 'Required' ],
  YNAB_BUDGET_ID: [ 'Required' ]
}
```

## Personal Access Token

YNAB Personal Access Tokens are simple and secure:

1. **No Expiration**: Tokens don't expire unless revoked
2. **Full Access**: Tokens have full read/write access to your budget
3. **Easy to Revoke**: Can be revoked anytime from Account Settings
4. **No Refresh Needed**: Unlike OAuth, no token refresh logic required

### Getting a Token

1. Go to [YNAB Account Settings](https://app.ynab.com)
2. Navigate to Developer Settings
3. Click "New Token" under Personal Access Tokens
4. Enter a descriptive name
5. Click "Generate"
6. Copy and save the token immediately

::: warning
You can only see the token once. If you lose it, you'll need to generate a new one.
:::

### Revoking a Token

If a token is compromised:

1. Go to YNAB Account Settings → Developer Settings
2. Find the token in the list
3. Click "Revoke"
4. Generate a new token
5. Update your `.env` file

## Budget ID

### Using a Specific Budget

Get your budget ID from the URL:

```
URL: https://app.ynab.com/a1b2c3d4-e5f6-7890-abcd-ef1234567890/budget
Budget ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Using "last-used"

The special value `last-used` automatically uses your most recently accessed budget:

```bash
YNAB_BUDGET_ID=last-used
```

This is convenient if you only have one budget or always use the same one.

## MCP Configuration

### Claude Desktop

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ynab": {
      "command": "node",
      "args": ["/path/to/mcp-tools/packages/ynab-mcp/dist/index.js"],
      "env": {
        "YNAB_ACCESS_TOKEN": "your-access-token",
        "YNAB_BUDGET_ID": "your-budget-id"
      }
    }
  }
}
```

::: tip
Use absolute paths in the config file for reliability.
:::

### Smithery

Create a `smithery.yaml` file:

```yaml
name: ynab-mcp
version: 1.0.0
description: YNAB budget and transaction data integration for MCP
runtime: node
entry: dist/index.js
env:
  - YNAB_ACCESS_TOKEN
  - YNAB_BUDGET_ID
```

Deploy to Smithery:

```bash
smithery deploy
```

## Security Best Practices

### Environment Variables

- ✅ **Never commit** `.env` files to version control
- ✅ Use `.env.example` as a template
- ✅ Store production secrets in secure vaults
- ✅ Rotate credentials regularly

### Access Tokens

- ✅ Keep tokens secure like passwords
- ✅ Use descriptive names to track token usage
- ✅ Revoke unused tokens
- ✅ Monitor for unauthorized access

### API Access

- ✅ Use HTTPS for all API requests (enforced by client)
- ✅ Respect rate limits (200 requests/hour)
- ✅ Log errors but not sensitive data
- ✅ Handle errors gracefully

## Troubleshooting

### "Invalid environment variables"

**Problem**: Missing or invalid environment variables.

**Solution**: Check your `.env` file:

```bash
# Verify file exists
ls -la packages/ynab-mcp/.env

# Check contents (be careful not to expose secrets!)
cat packages/ynab-mcp/.env
```

Ensure both variables are present and non-empty.

### "Invalid or expired access token"

**Problem**: Access token is invalid or has been revoked.

**Solution**: Generate a new token:

1. Go to YNAB Account Settings → Developer Settings
2. Create a new Personal Access Token
3. Update `YNAB_ACCESS_TOKEN` in `.env`
4. Restart the server

### "Resource not found"

**Problem**: Budget ID is incorrect or budget doesn't exist.

**Solution**: Verify your Budget ID:

1. Check the YNAB web app URL
2. Try using `last-used` instead
3. Ensure you have access to the budget

### "Rate limit exceeded"

**Problem**: Made more than 200 requests in the past hour.

**Solution**: Wait for rate limit to reset:

1. Rate limits reset every hour
2. Reduce request frequency
3. Implement caching if needed

## Advanced Configuration

### Multiple Budgets

To use multiple budgets, create separate MCP server instances:

```json
{
  "mcpServers": {
    "ynab-personal": {
      "command": "node",
      "args": ["/path/to/mcp-tools/packages/ynab-mcp/dist/index.js"],
      "env": {
        "YNAB_ACCESS_TOKEN": "token1",
        "YNAB_BUDGET_ID": "budget-id-1"
      }
    },
    "ynab-business": {
      "command": "node",
      "args": ["/path/to/mcp-tools/packages/ynab-mcp/dist/index.js"],
      "env": {
        "YNAB_ACCESS_TOKEN": "token2",
        "YNAB_BUDGET_ID": "budget-id-2"
      }
    }
  }
}
```

### Custom Base URL

For testing or development, you can modify the base URL:

```typescript
// packages/ynab-mcp/src/ynab-client.ts
private readonly baseURL = "https://api.ynab.com/v1";
```

### Logging

Add custom logging for debugging:

```typescript
// packages/ynab-mcp/src/index.ts
console.error("Error fetching data:", error);
```

## Environment File Template

Here's a complete `.env.example` template:

```bash
# YNAB Personal Access Token
# Get this from: Account Settings → Developer Settings → Personal Access Tokens → New Token
YNAB_ACCESS_TOKEN=your_personal_access_token_here

# YNAB Budget ID
# Get this from your budget URL: https://app.ynab.com/<budget_id>/budget
# Or use "last-used" to automatically use your most recently used budget
YNAB_BUDGET_ID=your_budget_id_here
```

## Next Steps

- [Getting Started](./getting-started) - Complete setup guide
- [Available Tools](./tools) - See what data you can access
- [YNAB API Documentation](https://api.ynab.com) - Official API docs

