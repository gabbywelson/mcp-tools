---
layout: home

hero:
  name: "MCP Tools"
  text: "Model Context Protocol Servers"
  tagline: Connect AI assistants to real-world services
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/gabbywelson/mcp-tools

features:
  - icon: 🏃
    title: WHOOP Integration
    details: Access your WHOOP fitness data through MCP - recovery scores, sleep analysis, strain, and more.
  
  - icon: ⚡
    title: Fast & Modern
    details: Built with TypeScript, Vite, and modern tooling. Instant hot reload during development.
  
  - icon: 🔐
    title: Secure OAuth
    details: Proper OAuth 2.0 implementation with refresh tokens for long-term access.
  
  - icon: 🧪
    title: Well Tested
    details: Comprehensive test suite with Vitest. Fast, reliable, and maintainable.
  
  - icon: 📦
    title: Monorepo Ready
    details: Organized as a monorepo with pnpm workspaces. Easy to add more MCP servers.
  
  - icon: 🎨
    title: Developer Experience
    details: Biome for linting, VitePress for docs, Vitest for testing. Best-in-class DX.
---

## Quick Start

Install dependencies:

```bash
pnpm install
```

Set up environment variables:

```bash
cd packages/whoop-mcp
cp .env.example .env
# Edit .env with your WHOOP credentials
```

Build and run:

```bash
pnpm build
pnpm --filter @mcp-tools/whoop-mcp start
```

## Available Packages

### 🏃 WHOOP MCP Server

Connect to WHOOP's API to access fitness and biometric data:

- **Recovery scores** - Daily recovery metrics
- **Sleep analysis** - Detailed sleep stages and quality
- **Strain tracking** - Workout and daily strain
- **Cycle data** - Physiological cycles
- **Body measurements** - Height, weight, heart rate

[Learn more →](/packages/whoop-mcp/)

## What is MCP?

The **Model Context Protocol (MCP)** is a standard for AI assistants to interact with external services. MCP servers expose "tools" that AI assistants like [Poke](https://interaction.co/mcp) can call to fetch data, perform actions, and more.

This monorepo contains MCP servers for various services, starting with WHOOP.

## Features

### 🔥 Modern Stack

- **TypeScript** - Type-safe code
- **pnpm** - Fast, efficient package management
- **Biome** - Lightning-fast linting and formatting
- **Vitest** - Blazing fast unit tests
- **VitePress** - Beautiful documentation

### 🏗️ Monorepo Architecture

Organized with pnpm workspaces for easy management of multiple packages:

```
mcp-tools/
├── packages/
│   └── whoop-mcp/        # WHOOP MCP server
├── docs/                 # Centralized documentation
└── ...
```

### 🎯 Best Practices

- ✅ Proper OAuth 2.0 with refresh tokens
- ✅ Type-safe environment variables (T3 Env)
- ✅ Comprehensive error handling
- ✅ Automated testing
- ✅ Semantic versioning
- ✅ Professional documentation

## Contributing

We welcome contributions! See our [Contributing Guide](/reference/contributing) for details.

Before submitting a PR:

1. Run `pnpm check` to format and lint
2. Run `pnpm test:run` to ensure tests pass
3. Document your changes in the PR description

## License

MIT - see [LICENSE](https://github.com/gabbywelson/mcp-tools/blob/main/LICENSE) for details.

