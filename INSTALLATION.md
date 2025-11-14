# Installation Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([download](https://nodejs.org/))
- **pnpm** 8 or higher ([installation guide](https://pnpm.io/installation))

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
pnpm --version  # Should be 8.0.0 or higher
```

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

## Step 1: Install Dependencies

From the root directory of the project:

```bash
pnpm install
```

This will install all dependencies for the monorepo and all packages.

## Step 2: Verify Installation

Check that dependencies were installed correctly:

```bash
# Check root dependencies
ls node_modules

# Check whoop-mcp dependencies
ls packages/whoop-mcp/node_modules
```

## Step 3: Build the Project

Compile the TypeScript code:

```bash
pnpm build
```

This will:
- Compile all TypeScript files to JavaScript
- Generate type declaration files
- Create source maps for debugging

You should see output similar to:
```
> mcp-tools@1.0.0 build /Users/you/code/mcp-tools
> pnpm -r build

> @mcp-tools/whoop-mcp@1.0.0 build /Users/you/code/mcp-tools/packages/whoop-mcp
> tsc
```

## Step 4: Configure WHOOP Credentials

### 4.1: Get WHOOP Developer Credentials

1. Visit [WHOOP Developer Portal](https://developer.whoop.com)
2. Sign in with your WHOOP account
3. Create a new application
4. Save your **Client ID** and **Client Secret**

### 4.2: Obtain a Refresh Token

Follow the detailed guide in [`packages/whoop-mcp/scripts/get-refresh-token.md`](./packages/whoop-mcp/scripts/get-refresh-token.md)

Quick summary:
1. Build authorization URL with your Client ID
2. Visit URL and authorize the app
3. Get authorization code from redirect
4. Exchange code for tokens using curl
5. Save the refresh token

### 4.3: Create Environment File

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

## Step 5: Test the Server

### Option A: Using MCP Inspector (Recommended for Testing)

The MCP Inspector provides a web interface for testing:

```bash
npx @modelcontextprotocol/inspector node packages/whoop-mcp/dist/index.js
```

This will:
1. Start the MCP server
2. Open a web interface in your browser
3. Allow you to test all available tools

### Option B: Using Claude Desktop

1. **Build the project** (if not already done):
   ```bash
   pnpm build
   ```

2. **Find the absolute path** to your project:
   ```bash
   pwd
   # Example output: /Users/yourname/code/mcp-tools
   ```

3. **Edit Claude Desktop config**:
   
   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   
   Add this configuration (replace paths and credentials):
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

4. **Restart Claude Desktop**

5. **Test it**: Ask Claude "What's my WHOOP recovery score today?"

### Option C: Direct Execution (for Debugging)

Run the server directly:

```bash
cd packages/whoop-mcp
node dist/index.js
```

The server will start and wait for MCP protocol messages on stdin/stdout.

## Verification Checklist

After installation, verify everything works:

- [ ] Dependencies installed (`node_modules` exists)
- [ ] Project builds without errors (`pnpm build` succeeds)
- [ ] `.env` file created with credentials
- [ ] MCP Inspector can connect to server
- [ ] All 5 tools are listed in MCP Inspector
- [ ] Can successfully call `whoop_get_overview`
- [ ] Data is returned from WHOOP API

## Troubleshooting

### "Cannot find module '@modelcontextprotocol/sdk'"

**Solution**: Install dependencies
```bash
pnpm install
```

### "Cannot find module './dist/index.js'"

**Solution**: Build the project
```bash
pnpm build
```

### "Configuration validation failed"

**Solution**: Check your `.env` file
- Ensure all three variables are set
- No extra spaces or quotes
- Variables are named exactly: `WHOOP_CLIENT_ID`, `WHOOP_CLIENT_SECRET`, `WHOOP_REFRESH_TOKEN`

### "Failed to refresh access token"

**Solution**: Verify your credentials
- Check Client ID and Client Secret are correct
- Ensure refresh token hasn't expired
- Try obtaining a new refresh token

### Build errors about TypeScript

**Solution**: Ensure you have the correct Node.js version
```bash
node --version  # Should be 18+
```

### "EACCES: permission denied"

**Solution**: Don't use sudo with pnpm. Fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to your PATH: export PATH=~/.npm-global/bin:$PATH
```

## Development Mode

For development with hot reload:

```bash
cd packages/whoop-mcp
pnpm dev
```

This will:
- Watch for file changes
- Automatically recompile
- Restart the server

## Next Steps

After successful installation:

1. **Read the documentation**: [`packages/whoop-mcp/README.md`](./packages/whoop-mcp/README.md)
2. **Try example queries**: See [`GETTING_STARTED.md`](./GETTING_STARTED.md)
3. **Deploy to Smithery**: For production use with Poke
4. **Explore the code**: Understand how it works

## Getting Help

If you're still having issues:

1. Check the [GETTING_STARTED.md](./GETTING_STARTED.md) guide
2. Review [packages/whoop-mcp/README.md](./packages/whoop-mcp/README.md)
3. Read the [WHOOP Developer Documentation](https://developer.whoop.com)
4. Open an issue on GitHub with:
   - Your Node.js and pnpm versions
   - The exact error message
   - Steps you've already tried

## Uninstallation

To remove the project:

```bash
# Remove dependencies
rm -rf node_modules
rm -rf packages/*/node_modules

# Remove build artifacts
pnpm clean

# Remove the entire project
cd ..
rm -rf mcp-tools
```

## Updating

To update dependencies:

```bash
# Update all dependencies
pnpm update

# Rebuild
pnpm build
```

To update the MCP SDK specifically:

```bash
cd packages/whoop-mcp
pnpm update @modelcontextprotocol/sdk
cd ../..
pnpm build
```

