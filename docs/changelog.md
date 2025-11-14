# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### @mcp-tools/whoop-mcp

**New Features:**
- Complete WHOOP MCP server with OAuth 2.0 support
- Five MCP tools: overview, recovery, sleep, strain, and healthspan
- Automatic token refresh and error handling

**Developer Experience:**
- Vitest for blazing-fast testing (10x faster than Jest)
- Biome for lightning-fast linting and formatting (25x faster than Prettier)
- Changesets for automated versioning and changelogs
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

---

## How Versioning Works

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### For Users

- **Patch** (0.0.X) - Bug fixes and minor improvements
- **Minor** (0.X.0) - New features, backwards compatible
- **Major** (X.0.0) - Breaking changes

### For Contributors

When you make changes:

1. Run `pnpm changeset` to document your changes
2. Select the affected package(s)
3. Choose the version bump type (patch/minor/major)
4. Write a summary of your changes

See the [Versioning Guide](/guide/versioning) for details.

### Release Process

When maintainers are ready to release:

1. `pnpm version` - Consumes changesets and updates versions
2. `pnpm release` - Publishes to npm and creates git tags

The changelog is automatically generated from changesets!

---

::: tip
This changelog is automatically updated when versions are released. Check back after each release to see what's new!
:::

