# Troubleshooting Guide

Common issues and solutions for MCP Tools development.

## Build Issues

### TypeScript Compilation Errors

**Problem**: `tsc` fails with type errors

**Solutions**:
```bash
# 1. Clean and rebuild
pnpm clean && pnpm build

# 2. Check for missing imports
# Make sure all imports end with .js extension (ESM requirement)
import { something } from "./file.js";  // ✅
import { something } from "./file";     // ❌

# 3. Verify tsconfig.json
cat tsconfig.json

# 4. Check for circular dependencies
# Use madge or similar tool
npx madge --circular packages/whoop-mcp/src
```

### Module Resolution Errors

**Problem**: `Cannot find module` errors

**Solutions**:
```bash
# 1. Verify package.json type field
# Should be "type": "module" for ESM

# 2. Check file extensions in imports
# Must use .js even for .ts files (TypeScript ESM requirement)

# 3. Verify paths in tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "module": "ES2022"
  }
}

# 4. Clear node_modules and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install
```

## Testing Issues

### Vitest Worker Errors

**Problem**: `RangeError: Maximum call stack size exceeded`

**Solution**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,  // Use single fork
      },
    },
  },
});
```

### Environment Variable Issues in Tests

**Problem**: Tests fail due to missing env vars

**Solutions**:
```typescript
// 1. Mock environment in tests
import { vi } from "vitest";

vi.stubEnv("WHOOP_CLIENT_ID", "test-id");
vi.stubEnv("WHOOP_CLIENT_SECRET", "test-secret");
vi.stubEnv("WHOOP_REFRESH_TOKEN", "test-token");

// 2. Skip env validation in tests
// Don't call loadConfig() directly in tests

// 3. Use test-specific config
const testConfig = {
  WHOOP_CLIENT_ID: "test",
  WHOOP_CLIENT_SECRET: "test",
  WHOOP_REFRESH_TOKEN: "test",
};
```

### Coverage Not Generated

**Problem**: `pnpm test:coverage` doesn't generate coverage

**Solutions**:
```bash
# 1. Install coverage provider
pnpm add -D @vitest/coverage-v8

# 2. Check vitest.config.ts
{
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
}

# 3. Clean and retry
pnpm clean && pnpm test:coverage
```

## Linting Issues

### Biome Errors

**Problem**: Biome reports errors

**Solutions**:
```bash
# 1. Auto-fix everything
pnpm check

# 2. Check specific file
pnpm check path/to/file.ts

# 3. View configuration
cat biome.json

# 4. Ignore specific rules (use sparingly)
// biome-ignore lint/rule-name: reason
```

### Import Organization

**Problem**: Imports not organized correctly

**Solution**:
```bash
# Biome auto-organizes imports
pnpm format

# Expected order:
# 1. External packages
# 2. Internal packages
# 3. Relative imports
# 4. Type imports
```

## OAuth Issues

### Invalid State Error

**Problem**: `error=invalid_state` in redirect URL

**Solution**:
```bash
# Add state parameter to authorization URL (8+ characters)
https://api.prod.whoop.com/oauth/oauth2/auth?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read:recovery%20read:sleep%20read:cycles%20read:workout%20read:profile%20read:body_measurement%20offline&
  state=random_string_12345
```

### No Refresh Token

**Problem**: Token response doesn't include `refresh_token`

**Solution**:
```bash
# Add 'offline' scope to authorization URL
scope=read:recovery%20read:sleep%20read:cycles%20read:workout%20read:profile%20read:body_measurement%20offline
#                                                                                                         ^^^^^^^^
```

### Invalid Request on Token Exchange

**Problem**: `error=invalid_request` when exchanging code

**Solution**:
```bash
# Use application/x-www-form-urlencoded, not JSON
curl --request POST \
  --url https://api.prod.whoop.com/oauth/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'code=YOUR_CODE' \
  --data-urlencode 'client_id=YOUR_CLIENT_ID' \
  --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
  --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
```

### Token Expired

**Problem**: `401 Unauthorized` from WHOOP API

**Solutions**:
```bash
# 1. Check token expiry
# WhoopClient should auto-refresh, but verify logic

# 2. Manually refresh token
curl --request POST \
  --url https://api.prod.whoop.com/oauth/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=refresh_token' \
  --data-urlencode 'refresh_token=YOUR_REFRESH_TOKEN' \
  --data-urlencode 'client_id=YOUR_CLIENT_ID' \
  --data-urlencode 'client_secret=YOUR_CLIENT_SECRET'

# 3. Update WHOOP_REFRESH_TOKEN in .env
```

## MCP Server Issues

### Server Not Starting

**Problem**: MCP server fails to start

**Solutions**:
```bash
# 1. Check environment variables
cat .env

# 2. Validate env vars
cd packages/whoop-mcp
node -e "require('./dist/env.js')"

# 3. Check for build errors
pnpm build

# 4. Run with verbose logging
DEBUG=* pnpm start
```

### MCP Inspector Not Loading

**Problem**: Inspector shows "No tools available"

**Solutions**:
```bash
# 1. Ensure env vars are loaded
npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js

# 2. Check server output for errors
# Should see "WHOOP MCP Server running on stdio"

# 3. Verify tools are registered
# Check src/index.ts ListToolsRequestSchema handler

# 4. Rebuild
pnpm build
```

### Tool Execution Fails

**Problem**: Tool returns error when called

**Solutions**:
```bash
# 1. Check tool implementation
# Look for try-catch blocks and error handling

# 2. Test WHOOP API directly
curl --request GET \
  --url https://api.prod.whoop.com/developer/v1/user/profile/basic \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Check token validity
# Verify WHOOP_REFRESH_TOKEN is valid

# 4. Add logging
console.error("Tool error:", error);
```

## Documentation Issues

### VitePress Not Starting

**Problem**: `pnpm docs:dev` fails

**Solutions**:
```bash
# 1. Check for ESM config
# Rename config.ts to config.mts
mv docs/.vitepress/config.ts docs/.vitepress/config.mts

# 2. Clear cache
rm -rf docs/.vitepress/cache

# 3. Reinstall dependencies
pnpm install

# 4. Check for syntax errors in markdown
# VitePress will show specific file errors
```

### Broken Links in Docs

**Problem**: Links don't work in VitePress

**Solutions**:
```markdown
# Use relative paths from docs root
[Link](/guide/getting-started)  ✅
[Link](guide/getting-started)   ❌
[Link](./guide/getting-started) ❌

# For anchors
[Link](/guide/getting-started#section)  ✅
```

### Search Not Working

**Problem**: Built-in search doesn't find content

**Solution**:
```bash
# 1. Rebuild docs
pnpm docs:build

# 2. Check config.mts
export default defineConfig({
  themeConfig: {
    search: {
      provider: "local",  // ✅
    },
  },
});

# 3. Clear cache and rebuild
rm -rf docs/.vitepress/cache docs/.vitepress/dist
pnpm docs:build
```

## Versioning Issues

### Changesets Not Found

**Problem**: `pnpm version` says "No changesets found"

**Solution**:
```bash
# 1. Check .changeset directory
ls -la .changeset/*.md

# 2. Create a changeset
pnpm changeset

# 3. Verify changeset format
cat .changeset/your-changeset.md

# Should look like:
# ---
# "@mcp-tools/whoop-mcp": patch
# ---
#
# Your change description
```

### Version Not Updating

**Problem**: `pnpm version` doesn't update package.json

**Solutions**:
```bash
# 1. Check changeset config
cat .changeset/config.json

# 2. Verify package name matches
# Changeset: "@mcp-tools/whoop-mcp"
# package.json: "name": "@mcp-tools/whoop-mcp"

# 3. Run with verbose output
pnpm changeset version --verbose
```

### Changelog Not Syncing

**Problem**: `docs/changelog.md` not updated

**Solutions**:
```bash
# 1. Manually sync
pnpm sync-changelog

# 2. Check script exists
cat scripts/sync-changelog.sh

# 3. Verify script is executable
chmod +x scripts/sync-changelog.sh

# 4. Check package.json script
# "version": "changeset version && pnpm sync-changelog"
```

## Dependency Issues

### pnpm Install Fails

**Problem**: `pnpm install` errors

**Solutions**:
```bash
# 1. Clear pnpm cache
pnpm store prune

# 2. Remove lock file and reinstall
rm pnpm-lock.yaml
pnpm install

# 3. Check Node version
node --version  # Should be 20+

# 4. Update pnpm
npm install -g pnpm@latest
```

### Workspace Dependencies Not Resolving

**Problem**: Can't import from other workspace packages

**Solutions**:
```bash
# 1. Check pnpm-workspace.yaml
cat pnpm-workspace.yaml

# Should include:
# packages:
#   - "packages/*"

# 2. Verify package.json name
# Must match import path

# 3. Reinstall
pnpm install
```

### Peer Dependency Warnings

**Problem**: Warnings about peer dependencies

**Solutions**:
```bash
# 1. Install missing peers
pnpm add <peer-dependency>

# 2. Or ignore (if not needed)
# Add to .npmrc:
# strict-peer-dependencies=false

# 3. Check for version conflicts
pnpm why <package>
```

## Performance Issues

### Slow Tests

**Problem**: Tests take too long

**Solutions**:
```bash
# 1. Use test.concurrent for independent tests
test.concurrent("test name", async () => {
  // test code
});

# 2. Reduce timeout for fast tests
test("fast test", () => {
  // test code
}, { timeout: 1000 });

# 3. Use --no-coverage for faster runs
pnpm test:run --no-coverage

# 4. Run specific tests
pnpm test src/__tests__/specific.test.ts
```

### Slow Builds

**Problem**: `pnpm build` is slow

**Solutions**:
```bash
# 1. Use incremental builds
# tsconfig.json:
{
  "compilerOptions": {
    "incremental": true
  }
}

# 2. Build specific package
pnpm --filter @mcp-tools/whoop-mcp build

# 3. Skip type checking (development only)
tsc --noCheck
```

### Slow Linting

**Problem**: Biome is slow

**Solutions**:
```bash
# 1. Lint specific files
pnpm lint src/

# 2. Skip formatting
pnpm lint --write

# 3. Use CI mode (no fixes)
pnpm ci
```

## Git Issues

### Merge Conflicts in Lock File

**Problem**: `pnpm-lock.yaml` has conflicts

**Solution**:
```bash
# 1. Accept one side
git checkout --ours pnpm-lock.yaml   # or --theirs

# 2. Regenerate lock file
pnpm install

# 3. Commit
git add pnpm-lock.yaml
git commit
```

### Pre-commit Hook Fails

**Problem**: Commit blocked by checks

**Solutions**:
```bash
# 1. Fix issues
pnpm check
pnpm test:run

# 2. Skip hooks (not recommended)
git commit --no-verify

# 3. Check what's failing
pnpm ci
```

## Debugging Tips

### Enable Debug Logging

```bash
# Node debug
DEBUG=* pnpm start

# MCP debug
MCP_DEBUG=1 pnpm start

# Axios debug
DEBUG=axios pnpm start
```

### Inspect Variables

```typescript
// Use console.error for MCP (stdout is reserved)
console.error("Debug:", { variable });

// Or use debugger
debugger;  // Run with --inspect flag
```

### Check Network Requests

```bash
# Use curl to test API directly
curl -v --request GET \
  --url https://api.prod.whoop.com/developer/v1/user/profile/basic \
  --header "Authorization: Bearer YOUR_TOKEN"

# Check response headers
curl -I https://api.prod.whoop.com/developer/v1/user/profile/basic
```

### Verify Environment

```bash
# Check all env vars
printenv | grep WHOOP

# Check Node version
node --version

# Check pnpm version
pnpm --version

# Check TypeScript version
pnpm tsc --version
```

## Getting Help

### Where to Look

1. **Documentation**: Check `docs/` directory
2. **Examples**: Look at existing tools in `src/tools/`
3. **Tests**: See `src/__tests__/` for patterns
4. **Logs**: Check console output for errors
5. **API Docs**: [WHOOP API Documentation](https://developer.whoop.com)
6. **MCP Docs**: [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

### Debugging Checklist

- [ ] Environment variables set correctly
- [ ] Dependencies installed (`pnpm install`)
- [ ] Project builds (`pnpm build`)
- [ ] Tests pass (`pnpm test:run`)
- [ ] Linting passes (`pnpm check`)
- [ ] OAuth tokens valid
- [ ] API endpoints correct
- [ ] Network connectivity working

### Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `Cannot find module` | Missing .js extension | Add .js to imports |
| `Invalid environment variables` | Missing/invalid env vars | Check .env file |
| `401 Unauthorized` | Invalid/expired token | Refresh OAuth token |
| `ECONNREFUSED` | API endpoint wrong | Check baseURL |
| `Maximum call stack` | Vitest worker issue | Use forks pool |
| `ESM file cannot be loaded` | Config file extension | Use .mts for VitePress |

---

**Still stuck?** Check the [GitHub Issues](https://github.com/yourusername/mcp-tools/issues) or create a new one!

