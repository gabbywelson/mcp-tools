# Changelog

All notable changes to this project will be documented in this file.

## @mcp-tools/whoop-mcp

### Current Version

**New Features:**
- Complete WHOOP MCP server with OAuth 2.0 support
- Five MCP tools: overview, recovery, sleep, strain, and healthspan
- Automatic token refresh and error handling

**Developer Experience:**
- Vitest for blazing-fast testing (10x faster than Jest)
- Biome for lightning-fast linting and formatting (25x faster than Prettier)
- VitePress for beautiful, searchable documentation
- T3 Env for type-safe environment variable validation

**Documentation:**
- Comprehensive user guides (getting started, installation, quick start)
- Package-specific documentation (OAuth setup, configuration, tools)
- Development guides (testing, linting, versioning)
- Reference documentation (project structure, contributing)

**Quality:**
- Type-safe TypeScript throughout
- Comprehensive test coverage
- Automated code formatting and linting
- Professional error handling and logging

## @mcp-tools/ynab-mcp

### Current Version

**New Features:**
- Complete YNAB MCP server with Personal Access Token authentication
- Four MCP tools: budget summary, category activity, recent transactions, create transaction
- Simple authentication (no OAuth flow required)

**Developer Experience:**
- Same modern tooling as whoop-mcp
- Type-safe TypeScript throughout
- Comprehensive test coverage

**Documentation:**
- Complete setup and configuration guides
- Tool reference documentation
- Integration examples

---

## How Versioning Works

This project uses [Semantic Versioning](https://semver.org/) for version management.

### For Users

- **Patch** (0.0.X) - Bug fixes and minor improvements
- **Minor** (0.X.0) - New features, backwards compatible
- **Major** (X.0.0) - Breaking changes

### For Contributors

When you make changes:

1. Document your changes in the PR description
2. Indicate the type of change (patch/minor/major)
3. Update relevant documentation

See the [Versioning Guide](/guide/versioning) for details.

### Release Process

When maintainers are ready to release:

1. Update version in `package.json`
2. Document changes in package README
3. Create git tag and push
4. Publish to npm (if applicable)

---

::: tip
Check individual package READMEs for detailed version history and release notes.
:::
