# Configuration

The WHOOP MCP server uses environment variables for configuration, validated with [T3 Env](https://env.t3.gg/) for type safety.

## Environment Variables

Create a `.env` file in the `packages/whoop-mcp` directory:

```bash
WHOOP_CLIENT_ID=your-client-id-here
WHOOP_CLIENT_SECRET=your-client-secret-here
WHOOP_REFRESH_TOKEN=your-refresh-token-here
```

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `WHOOP_CLIENT_ID` | OAuth Client ID | [WHOOP Developer Portal](https://developer.whoop.com) |
| `WHOOP_CLIENT_SECRET` | OAuth Client Secret | [WHOOP Developer Portal](https://developer.whoop.com) |
| `WHOOP_REFRESH_TOKEN` | OAuth Refresh Token | [OAuth Setup Guide](./oauth-setup) |

## Type-Safe Configuration

The server uses T3 Env for runtime validation:

```typescript
import { env } from "./env.js";

// Type-safe access to environment variables
console.log(env.WHOOP_CLIENT_ID);
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
  WHOOP_CLIENT_ID: [ 'Required' ],
  WHOOP_CLIENT_SECRET: [ 'Required' ]
}
```

## OAuth Token Management

The server automatically manages OAuth tokens:

1. **Access Token**: Short-lived token for API requests
2. **Refresh Token**: Long-lived token to get new access tokens

### Automatic Refresh

The client automatically refreshes access tokens when they expire:

```typescript
// Token refresh happens automatically
const data = await client.getUserProfile();
```

### Token Storage

- Access tokens are stored in memory (not persisted)
- Refresh tokens are read from environment variables
- New refresh tokens (if provided by API) update the in-memory value

## MCP Configuration

### Claude Desktop

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": ["/path/to/mcp-tools/packages/whoop-mcp/dist/index.js"],
      "env": {
        "WHOOP_CLIENT_ID": "your-client-id",
        "WHOOP_CLIENT_SECRET": "your-client-secret",
        "WHOOP_REFRESH_TOKEN": "your-refresh-token"
      }
    }
  }
}
```

### Smithery

Create a `smithery.yaml` file:

```yaml
name: whoop-mcp
version: 1.0.0
description: WHOOP fitness data integration for MCP
runtime: node
entry: dist/index.js
env:
  - WHOOP_CLIENT_ID
  - WHOOP_CLIENT_SECRET
  - WHOOP_REFRESH_TOKEN
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

### OAuth Tokens

- ✅ Keep refresh tokens secure
- ✅ Use proper OAuth scopes (principle of least privilege)
- ✅ Monitor token usage for anomalies
- ✅ Revoke tokens when no longer needed

### API Access

- ✅ Use HTTPS for all API requests (enforced by client)
- ✅ Implement rate limiting (handled by WHOOP API)
- ✅ Log errors but not sensitive data
- ✅ Handle token expiration gracefully

## Troubleshooting

### "Invalid environment variables"

**Problem**: Missing or invalid environment variables.

**Solution**: Check your `.env` file:

```bash
# Verify file exists
ls -la packages/whoop-mcp/.env

# Check contents (be careful not to expose secrets!)
cat packages/whoop-mcp/.env
```

### "Token refresh failed"

**Problem**: Refresh token is invalid or expired.

**Solution**: Get a new refresh token:

1. Follow the [OAuth Setup Guide](./oauth-setup)
2. Update `WHOOP_REFRESH_TOKEN` in `.env`
3. Restart the server

### "Client authentication failed"

**Problem**: Invalid client ID or secret.

**Solution**: Verify credentials:

1. Check [WHOOP Developer Portal](https://developer.whoop.com)
2. Ensure no typos in `.env` file
3. Regenerate credentials if needed

## Advanced Configuration

### Custom Base URL

For testing or development, you can modify the base URL:

```typescript
// packages/whoop-mcp/src/whoop-client.ts
private readonly baseURL = "https://api.prod.whoop.com/developer";
```

### Timeout Settings

Adjust timeout settings in Vitest config:

```typescript
// packages/whoop-mcp/vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000,  // 10 seconds
    hookTimeout: 10000,
  },
});
```

### Logging

Add custom logging:

```typescript
// packages/whoop-mcp/src/index.ts
console.error("Error fetching data:", error);
```

## Next Steps

- [OAuth Setup Guide](./oauth-setup) - Get your refresh token
- [Available Tools](./tools) - See what data you can access
- [Getting Started](./getting-started) - Complete setup guide

