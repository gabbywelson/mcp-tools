---
"@mcp-tools/ynab-mcp": minor
---

Add YNAB MCP Server package for budget and transaction integration

This new package provides a Model Context Protocol server for YNAB (You Need A Budget), enabling AI assistants like Claude and Poke to access budget data and manage transactions.

Features:
- Budget summary with account balances and net worth calculation
- Category spending analysis by month with goal tracking
- Recent transaction listing with filtering options
- Create new transactions programmatically
- Simple Personal Access Token authentication (no OAuth flow required)
- Type-safe configuration with T3 Env validation
- Comprehensive documentation with VitePress integration

The package follows the same architecture and patterns as the existing WHOOP MCP server, using TypeScript, Biome for linting/formatting, Vitest for testing, and includes full documentation.

