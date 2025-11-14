# WHOOP MCP Server

A Model Context Protocol (MCP) server for accessing WHOOP fitness data using OAuth 2.0 authentication. Integrate your WHOOP biometric data into Claude, Poke, and other MCP-compatible applications.

## Features

- **Comprehensive Overview** - All your daily metrics in one call
- **Sleep Analysis** - Deep dive into sleep performance and quality
- **Recovery Metrics** - HRV, RHR, and recovery contributors with trends
- **Strain Tracking** - Day strain with heart rate zones and activities
- **Healthspan** - Biological age metrics (when available)
- **Automatic Token Refresh** - Seamless OAuth token management
- **Type-Safe Configuration** - Built with T3 Env for runtime validation and type safety

## Prerequisites

1. **WHOOP Account** - Active WHOOP membership
2. **WHOOP Developer Account** - Register at [WHOOP Developer Portal](https://developer.whoop.com)
3. **OAuth Credentials** - Client ID, Client Secret, and Refresh Token

## Getting OAuth Credentials

### Step 1: Create a WHOOP Developer Application

1. Go to [WHOOP Developer Portal](https://developer.whoop.com)
2. Sign in with your WHOOP account
3. Navigate to "Applications" and create a new application
4. Note your **Client ID** and **Client Secret**
5. Set a redirect URI (e.g., `http://localhost:3000/callback` for local testing)

### Step 2: Obtain a Refresh Token

You'll need to complete the OAuth authorization flow to get a refresh token:

1. **Authorization URL**: Construct and visit this URL in your browser:
   ```
   https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=read:recovery%20read:cycles%20read:sleep%20read:workout%20read:profile%20read:body_measurement%20offline&state=YOUR_RANDOM_STATE
   ```
   
   **Note:** Replace `YOUR_RANDOM_STATE` with a random string of at least 8 characters (e.g., `randomstate123`)

2. **Authorize**: Log in and authorize your application

3. **Get Authorization Code**: You'll be redirected to your redirect URI with a code parameter:
   ```
   http://localhost:3000/callback?code=AUTHORIZATION_CODE
   ```

4. **Exchange for Tokens**: Make a POST request to get your tokens:
   ```bash
   curl --request POST \
     --url https://api.prod.whoop.com/oauth/oauth2/token \
     --header 'Content-Type: application/x-www-form-urlencoded' \
     --data-urlencode 'grant_type=authorization_code' \
     --data-urlencode 'code=AUTHORIZATION_CODE' \
     --data-urlencode 'client_id=YOUR_CLIENT_ID' \
     --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
     --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
   ```

5. **Save Refresh Token**: The response will include a `refresh_token` - save this securely!

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
   cd packages/whoop-mcp
   cp .env.example .env
   ```

4. **Edit `.env` with your credentials**:
   ```env
   WHOOP_CLIENT_ID=your_client_id_here
   WHOOP_CLIENT_SECRET=your_client_secret_here
   WHOOP_REFRESH_TOKEN=your_refresh_token_here
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
   - Client ID: Your WHOOP OAuth Client ID
   - Client Secret: Your WHOOP OAuth Client Secret
   - Refresh Token: Your WHOOP OAuth Refresh Token

3. **Connect to Poke or other MCP clients**

## Using with Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-tools/packages/whoop-mcp/dist/index.js"],
      "env": {
        "WHOOP_CLIENT_ID": "your_client_id_here",
        "WHOOP_CLIENT_SECRET": "your_client_secret_here",
        "WHOOP_REFRESH_TOKEN": "your_refresh_token_here"
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
   - Configure OAuth credentials

3. **Start using**: Ask Poke questions about your WHOOP data!

## Available Tools

### whoop_get_overview

Retrieves comprehensive WHOOP overview data for a specific date in a single API call.

**Parameters:**
- `date` (optional) - Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Cycle info, recovery score, day strain, sleep hours
- All gauges and key statistics
- Today's activities with scores
- HRV, RHR, steps with trends

**Example queries:**
```
"Can you check my WHOOP data for today?"
"What was my recovery score on 2024-01-15?"
"Show me my WHOOP stats from yesterday"
```

### whoop_get_sleep

Retrieves detailed sleep analysis and performance metrics.

**Parameters:**
- `date` (optional) - Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Sleep performance score and state
- Hours slept vs needed
- Sleep efficiency and consistency
- Sleep stages (light, deep, REM, awake)
- Respiratory rate and disturbance count

**Example queries:**
```
"How did I sleep last night?"
"What's my sleep performance for October 27?"
"Why is my sleep score low today?"
```

### whoop_get_recovery

Retrieves comprehensive recovery analysis including contributors and trends.

**Parameters:**
- `date` (optional) - Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Recovery score (0-100%)
- Heart Rate Variability (HRV) with 30-day trend
- Resting Heart Rate (RHR) with 30-day trend
- SpO2 percentage
- Skin temperature

**Example queries:**
```
"What's my recovery score today?"
"Show me my recovery analysis for yesterday"
"How is my HRV trending compared to my baseline?"
```

### whoop_get_strain

Retrieves comprehensive strain analysis including activities and trends.

**Parameters:**
- `date` (optional) - Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Strain score with 30-day trend
- Heart rate zones for all activities
- Individual activity details with strain scores
- Total energy expenditure (kJ and calories)

**Example queries:**
```
"What's my strain score today?"
"Show me my strain analysis and activities"
"How much time did I spend in heart rate zones 4-5?"
```

### whoop_get_healthspan

Retrieves healthspan/biological age data.

**Parameters:**
- `date` (optional) - Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Note: This feature may not be available in the current WHOOP API version

**Example queries:**
```
"What's my biological age?"
"Show me my healthspan data"
```

## How It Works

The server automatically handles OAuth authentication:

1. Uses your refresh token to obtain access tokens
2. Access tokens are valid for 1 hour
3. Automatically refreshes tokens before expiration
4. Retries failed requests after token refresh
5. Stores tokens in memory only (no persistence)

### Type-Safe Configuration

This project uses [T3 Env](https://env.t3.gg/) for environment variable management:

- ✅ Runtime validation on startup
- ✅ Full TypeScript type safety
- ✅ Clear error messages for invalid config
- ✅ Zero runtime overhead

See [T3 Env Setup Documentation](./docs/T3_ENV_SETUP.md) for details.

## API Scopes Required

The following WHOOP API scopes are required:
- `read:recovery` - Recovery scores and metrics
- `read:cycles` - Daily strain and physiological cycles
- `read:sleep` - Sleep performance and stages
- `read:workout` - Workout activities and metrics
- `read:profile` - User profile information
- `read:body_measurement%20offline` - Body measurements

Make sure these scopes are included when obtaining your OAuth tokens.

## Security Best Practices

- **Never commit** your `.env` file or share your credentials
- Store refresh tokens securely
- Rotate credentials periodically
- Use environment variables for production deployments
- Limit API scopes to only what's needed

## Troubleshooting

### "Configuration validation failed"
- Ensure all three environment variables are set
- Check for typos in variable names
- Verify credentials are not empty strings

### "Failed to refresh access token"
- Verify your Client ID and Client Secret are correct
- Check that your refresh token hasn't expired
- Ensure you have the required API scopes
- Try obtaining a new refresh token

### "No data available for this date"
- WHOOP data may not be available for future dates
- Recovery data requires a completed sleep
- Strain data requires an active day cycle

## Development

### Project Structure

```
packages/whoop-mcp/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── env.ts             # T3 Env configuration (type-safe env vars)
│   ├── config.ts          # Configuration exports & backwards compatibility
│   ├── types.ts           # TypeScript type definitions
│   ├── whoop-client.ts    # WHOOP API client
│   └── tools/             # MCP tool implementations
│       ├── overview.ts
│       ├── sleep.ts
│       ├── recovery.ts
│       ├── strain.ts
│       └── healthspan.ts
├── docs/
│   └── T3_ENV_SETUP.md    # T3 Env documentation
├── scripts/
│   └── get-refresh-token.md
├── package.json
├── tsconfig.json
└── smithery.yaml          # Smithery deployment config
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

**Option 1: Using your `.env` file (recommended)**

```bash
# Load .env and run inspector
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js
```

**Option 2: Set environment variables inline**

```bash
WHOOP_CLIENT_ID=your_id \
WHOOP_CLIENT_SECRET=your_secret \
WHOOP_REFRESH_TOKEN=your_token \
npx @modelcontextprotocol/inspector node dist/index.js
```

**Option 3: Export variables first**

```bash
export WHOOP_CLIENT_ID=your_id
export WHOOP_CLIENT_SECRET=your_secret
export WHOOP_REFRESH_TOKEN=your_token
npx @modelcontextprotocol/inspector node dist/index.js
```

The inspector will open in your browser at `http://localhost:5173`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT - see LICENSE file for details

## Resources

- [WHOOP Developer Documentation](https://developer.whoop.com)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Smithery Documentation](https://smithery.ai/docs)
- [Poke AI Assistant](https://interaction.co/mcp)

## Support

For issues related to:
- **WHOOP API**: Contact WHOOP Developer Support
- **MCP Server**: Open an issue on GitHub
- **Smithery Deployment**: Contact Smithery Support
- **Poke Integration**: Contact Poke Support

