# Common Commands Quick Reference

## 🚀 Most Used Commands

```bash
# Start development
pnpm dev

# Run tests while coding
pnpm test

# Format and lint everything
pnpm check

# Start documentation site
pnpm docs:dev
```

## 📦 Package Management

```bash
# Install dependencies
pnpm install

# Add dependency to workspace root
pnpm add -w <package>

# Add dependency to specific package
pnpm add <package> --filter @mcp-tools/whoop-mcp

# Update all dependencies interactively
pnpm up -r -i

# Remove dependency
pnpm remove <package> --filter @mcp-tools/whoop-mcp
```

## 🔨 Development

```bash
# Run all packages in dev mode
pnpm dev

# Run specific package
cd packages/whoop-mcp && pnpm dev

# Build all packages
pnpm build

# Build specific package
pnpm --filter @mcp-tools/whoop-mcp build

# Clean all build artifacts
pnpm clean
```

## 🧪 Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Open Vitest UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Run tests for specific package
cd packages/whoop-mcp && pnpm test

# Run specific test file
pnpm test src/__tests__/config.test.ts

# Run tests matching pattern
pnpm test --grep "WhoopClient"
```

## ✨ Code Quality

```bash
# Format, lint, and fix everything (recommended)
pnpm check

# Just format
pnpm format

# Just lint
pnpm lint

# CI checks (no auto-fix)
pnpm ci

# Check specific file
pnpm check packages/whoop-mcp/src/index.ts
```

## 📚 Documentation

```bash
# Start docs dev server
pnpm docs:dev

# Build docs for production
pnpm docs:build

# Preview production build
pnpm docs:preview

# Sync changelog to docs
pnpm sync-changelog
```

## 📝 Versioning & Release

```bash
# Create a changeset (interactive)
pnpm changeset

# Create changeset with CLI
pnpm changeset add

# Version packages (consume changesets)
pnpm version

# Publish to npm
pnpm release

# Full release workflow
pnpm version && git add . && git commit -m "chore: version packages" && pnpm release
```

## 🔍 MCP Development

```bash
# Run MCP server directly
cd packages/whoop-mcp && pnpm start

# Run with MCP Inspector
cd packages/whoop-mcp && npx --yes dotenv-cli -e .env -- npx @modelcontextprotocol/inspector node dist/index.js

# Build and test
pnpm build && cd packages/whoop-mcp && pnpm start
```

## 🔐 OAuth Setup

```bash
# Get authorization URL (manual process)
# See docs/packages/whoop-mcp/oauth-setup.md

# Test token exchange
curl --request POST \
  --url https://api.prod.whoop.com/oauth/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'code=YOUR_AUTH_CODE' \
  --data-urlencode 'client_id=YOUR_CLIENT_ID' \
  --data-urlencode 'client_secret=YOUR_CLIENT_SECRET' \
  --data-urlencode 'redirect_uri=YOUR_REDIRECT_URI'
```

## 🐛 Debugging

```bash
# Check environment variables
cat .env

# Validate env vars
cd packages/whoop-mcp && node -e "require('./dist/env.js')"

# Check TypeScript compilation
pnpm build --verbose

# Check for type errors
pnpm tsc --noEmit

# View test coverage
pnpm test:coverage && open coverage/index.html
```

## 🔧 Troubleshooting

```bash
# Clean everything and reinstall
pnpm clean && rm -rf node_modules packages/*/node_modules && pnpm install

# Clear pnpm cache
pnpm store prune

# Reset git state (careful!)
git reset --hard HEAD

# Check for outdated dependencies
pnpm outdated -r

# Verify workspace structure
pnpm list -r --depth 0
```

## 📊 Useful Checks

```bash
# Check bundle size
cd packages/whoop-mcp && pnpm build && ls -lh dist/

# Count lines of code
find packages/whoop-mcp/src -name "*.ts" | xargs wc -l

# Find TODO comments
grep -r "TODO" packages/whoop-mcp/src

# Check for console.logs
grep -r "console.log" packages/whoop-mcp/src

# List all scripts
cat package.json | grep -A 20 '"scripts"'
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feat/new-feature

# Stage changes
git add .

# Commit with conventional commits
git commit -m "feat: add new tool"

# Push and create PR
git push -u origin feat/new-feature

# Update from main
git checkout main && git pull && git checkout - && git rebase main
```

## 🎯 Quick Workflows

### Adding a New MCP Tool

```bash
# 1. Create tool file
touch packages/whoop-mcp/src/tools/new-tool.ts

# 2. Add types if needed
# Edit packages/whoop-mcp/src/types.ts

# 3. Register tool
# Edit packages/whoop-mcp/src/index.ts

# 4. Add tests
touch packages/whoop-mcp/src/__tests__/new-tool.test.ts

# 5. Test it
pnpm test

# 6. Document it
# Edit docs/packages/whoop-mcp/tools.md

# 7. Create changeset
pnpm changeset

# 8. Commit
git add . && git commit -m "feat: add new-tool"
```

### Fixing a Bug

```bash
# 1. Create branch
git checkout -b fix/bug-description

# 2. Fix the bug
# Edit relevant files

# 3. Add test
# Edit test files

# 4. Verify fix
pnpm test:run && pnpm build

# 5. Format and lint
pnpm check

# 6. Create changeset
pnpm changeset

# 7. Commit and push
git add . && git commit -m "fix: description" && git push
```

### Updating Documentation

```bash
# 1. Start docs server
pnpm docs:dev

# 2. Edit docs
# Edit files in docs/

# 3. Preview changes
# Check http://localhost:5173

# 4. Build to verify
pnpm docs:build

# 5. Commit
git add docs/ && git commit -m "docs: update guide"
```

### Releasing a New Version

```bash
# 1. Ensure main is up to date
git checkout main && git pull

# 2. Run all checks
pnpm check && pnpm test:run && pnpm build

# 3. Version packages (consumes changesets)
pnpm version

# 4. Review changes
git diff

# 5. Commit version bump
git add . && git commit -m "chore: version packages"

# 6. Publish to npm
pnpm release

# 7. Push with tags
git push && git push --tags
```

## 💡 Pro Tips

```bash
# Watch mode for multiple commands
pnpm dev & pnpm test & pnpm docs:dev

# Run command in all packages
pnpm -r exec <command>

# Filter by package name
pnpm --filter "*whoop*" build

# Dry run for publishing
pnpm publish --dry-run

# Check what files will be published
cd packages/whoop-mcp && pnpm pack && tar -tzf *.tgz

# Run TypeScript REPL with project context
cd packages/whoop-mcp && pnpm tsx
```

## 🎨 Aliases (Add to ~/.zshrc or ~/.bashrc)

```bash
# MCP Tools aliases
alias mcp="cd ~/code/mcp-tools"
alias mcpd="cd ~/code/mcp-tools && pnpm dev"
alias mcpt="cd ~/code/mcp-tools && pnpm test"
alias mcpc="cd ~/code/mcp-tools && pnpm check"
alias mcpdocs="cd ~/code/mcp-tools && pnpm docs:dev"
```

---

**Tip**: Bookmark this file in Cursor for quick reference! Press `Cmd+P` and type `commands.md`

