# MCP Tools

[![CI](https://github.com/gabbywelson/mcp-tools/workflows/CI/badge.svg)](https://github.com/gabbywelson/mcp-tools/actions/workflows/ci.yml)
[![Release](https://github.com/gabbywelson/mcp-tools/workflows/Release/badge.svg)](https://github.com/gabbywelson/mcp-tools/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of Model Context Protocol (MCP) servers designed to integrate with Poke, Claude, and other MCP-compatible AI assistants.

📚 **[View Full Documentation](https://yourusername.github.io/mcp-tools/)** | 🚀 **[Quick Start](/docs/guide/quick-start.md)** | 📦 **[Packages](/docs/packages/)**

## Available MCP Servers

### 🏃 WHOOP MCP Server

Connect your WHOOP fitness tracker data to AI assistants. Get insights on recovery, sleep, strain, and overall health metrics.

**Features:**

- Comprehensive daily overview (recovery, strain, sleep, activities)
- Detailed sleep analysis with stages and performance
- Recovery tracking with HRV, RHR, and trends
- Strain analysis with heart rate zones
- Automatic OAuth token management

[📖 View WHOOP MCP Documentation](./packages/whoop-mcp/README.md)

## Getting Started

This is a pnpm workspace monorepo. Each MCP server is in the `packages/` directory.

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/gabbywelson/mcp-tools.git
cd mcp-tools

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Run all packages in development mode
pnpm dev

# Build all packages
pnpm build

# Clean all build artifacts
pnpm clean

# Format code with Biome
pnpm format

# Lint and fix code with Biome
pnpm lint

# Format, lint, and organize imports
pnpm check
```

## Project Structure

```
mcp-tools/
├── packages/
│   └── whoop-mcp/          # WHOOP fitness tracker integration
├── package.json            # Root workspace configuration
├── pnpm-workspace.yaml     # pnpm workspace definition
└── tsconfig.json           # Base TypeScript configuration
```

## Using with AI Assistants

### Claude Desktop

Add MCP servers to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

See individual package READMEs for specific configuration.

### Poke

Deploy MCP servers to Smithery and connect them to Poke for AI-powered interactions.

[Learn more about Poke MCP integration](https://interaction.co/mcp)

## Deployment

Each MCP server can be deployed to [Smithery](https://smithery.ai) for easy integration with Poke and other services. See individual package documentation for deployment instructions.

## Developer Experience

### Code Quality

This project uses [Biome](https://biomejs.dev/) for fast linting and formatting:

- ✅ **25x faster** than Prettier
- ✅ **One tool** instead of ESLint + Prettier  
- ✅ **Auto-format** on save in VS Code
- ✅ **Consistent** code style across the project

### Testing

Fast, modern testing with [Vitest](https://vitest.dev/):

```bash
pnpm test              # Watch mode
pnpm test:ui           # Visual UI
pnpm test:coverage     # Coverage report
```

### Documentation

Beautiful, searchable docs with [VitePress](https://vitepress.dev/):

```bash
pnpm docs:dev          # Start dev server
pnpm docs:build        # Build for production
```

### Versioning

Automated versioning and changelogs with [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset         # Document changes
pnpm version           # Update versions
pnpm release           # Publish to npm
```

### Cursor AI Context

This project includes comprehensive Cursor AI context files in `.cursor/`:

- **`.cursorrules`**: Project conventions and best practices (auto-loaded)
- **`commands.md`**: Quick reference for all commands
- **`architecture.md`**: System design and patterns
- **`snippets.md`**: Copy-paste code templates
- **`troubleshooting.md`**: Solutions to common issues

[Learn more about Cursor context files](./.cursor/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Before submitting:
1. Run `pnpm check` to format and lint your code
2. Run `pnpm test:run` to ensure all tests pass
3. Add a changeset: `pnpm changeset` (see [CHANGESETS.md](./CHANGESETS.md))
4. Follow the existing code style (enforced by Biome)

## License

MIT - see LICENSE file for details

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Smithery Documentation](https://smithery.ai/docs)
- [Poke AI Assistant](https://interaction.co/mcp)
- [Claude Desktop](https://claude.ai/desktop)
