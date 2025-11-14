# Project Structure

This document describes the organization of the MCP Tools monorepo.

## Repository Layout

```
mcp-tools/
├── .vscode/                # VS Code settings
│   ├── settings.json       # Editor config
│   └── extensions.json     # Recommended extensions
├── docs/                   # Centralized documentation (VitePress)
│   ├── .vitepress/        # VitePress configuration
│   ├── guide/             # User guides
│   ├── packages/          # Package-specific docs
│   └── reference/         # Reference documentation
├── packages/              # Workspace packages
│   └── whoop-mcp/        # WHOOP MCP server
│       ├── dist/         # Compiled output
│       ├── src/          # Source code
│       ├── package.json  # Package config
│       └── tsconfig.json # TypeScript config
├── biome.json            # Biome configuration
├── package.json          # Root package config
├── pnpm-lock.yaml        # Lockfile
├── pnpm-workspace.yaml   # Workspace definition
├── tsconfig.json         # Base TypeScript config
├── vitest.config.ts      # Vitest root config
└── README.md             # Main README

```

## Key Directories

### `/packages`

Contains all workspace packages. Each package is independently versioned and can be published to npm.

**Current packages:**
- `whoop-mcp` - WHOOP fitness tracker integration

**Future packages:**
- `strava-mcp` - Strava integration
- `garmin-mcp` - Garmin integration
- `shared` - Shared utilities

### `/docs`

Centralized documentation powered by VitePress. All markdown documentation lives here, organized by category.

**Structure:**
- `guide/` - User guides and tutorials
- `packages/` - Package-specific documentation
- `reference/` - API reference and technical docs

### `/.vscode`

VS Code workspace settings for consistent development experience.

**Files:**
- `settings.json` - Editor settings (Biome integration)
- `extensions.json` - Recommended extensions

## Package Structure

Each package in `/packages` follows this structure:

```
packages/package-name/
├── src/                    # Source code
│   ├── __tests__/         # Test files
│   │   ├── *.test.ts     # Unit tests
│   │   └── *.spec.ts     # Integration tests
│   ├── tools/            # MCP tools
│   ├── types.ts          # TypeScript types
│   ├── config.ts         # Configuration
│   ├── env.ts            # Environment variables
│   └── index.ts          # Entry point
├── dist/                  # Compiled output (gitignored)
├── coverage/              # Test coverage (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
└── README.md              # Package README
```

## Configuration Files

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Workspace configuration, scripts, dev dependencies |
| `pnpm-workspace.yaml` | Defines workspace packages |
| `tsconfig.json` | Base TypeScript configuration |
| `vitest.config.ts` | Root Vitest configuration (monorepo) |
| `biome.json` | Biome linter/formatter configuration |

### Package Level

| File | Purpose |
|------|---------|
| `package.json` | Package metadata, dependencies, scripts |
| `tsconfig.json` | Package-specific TypeScript config |
| `vitest.config.ts` | Package-specific test configuration |

## Source Code Organization

### WHOOP MCP Package

```
packages/whoop-mcp/src/
├── __tests__/              # Tests
│   ├── config.test.ts     # Config tests
│   ├── types.test.ts      # Type tests
│   └── whoop-client.test.ts # Client tests
├── tools/                  # MCP tools
│   ├── overview.ts        # Daily overview tool
│   ├── recovery.ts        # Recovery tool
│   ├── sleep.ts           # Sleep tool
│   ├── strain.ts          # Strain tool
│   └── healthspan.ts      # Healthspan tool
├── config.ts              # Configuration loader
├── env.ts                 # Environment validation (T3 Env)
├── types.ts               # TypeScript interfaces
├── whoop-client.ts        # WHOOP API client
└── index.ts               # MCP server entry point
```

## Build Output

Compiled TypeScript output goes to `dist/`:

```
packages/whoop-mcp/dist/
├── index.js              # Compiled entry point
├── index.d.ts            # Type declarations
├── *.js.map              # Source maps
└── tools/                # Compiled tools
```

## Documentation Structure

```
docs/
├── .vitepress/           # VitePress config
│   └── config.ts        # Site configuration
├── index.md             # Homepage
├── guide/               # User guides
│   ├── getting-started.md
│   ├── installation.md
│   ├── quick-start.md
│   ├── testing.md
│   ├── linting.md
│   └── versioning.md
├── packages/            # Package docs
│   └── whoop-mcp/
│       ├── index.md
│       ├── getting-started.md
│       ├── oauth-setup.md
│       ├── configuration.md
│       └── tools.md
└── reference/           # Reference docs
    ├── structure.md
    └── contributing.md
```

## Ignored Files

The following are gitignored:

- `node_modules/` - Dependencies
- `dist/` - Build output
- `coverage/` - Test coverage
- `.env` - Environment variables
- `.env.local` - Local overrides
- `*.log` - Log files
- `.DS_Store` - macOS files

## Naming Conventions

### Files

- **Source files**: `kebab-case.ts`
- **Test files**: `kebab-case.test.ts` or `kebab-case.spec.ts`
- **Type files**: `types.ts` (singular)
- **Config files**: `config.ts`, `env.ts`

### Directories

- **Package names**: `kebab-case`
- **Source directories**: `src/`, `dist/`, `docs/`
- **Tool directories**: `tools/`, `__tests__/`

### Packages

- **Scoped packages**: `@mcp-tools/package-name`
- **NPM naming**: `@scope/kebab-case`

## Dependencies

### Root Dependencies

Development tools used across all packages:

- `@biomejs/biome` - Linting and formatting
- `@vitest/ui` - Test UI
- `vitest` - Test framework
- `vitepress` - Documentation
- `typescript` - Type checking

### Package Dependencies

Each package manages its own runtime dependencies:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@t3-oss/env-core": "^0.10.1",
    "axios": "^1.6.2",
    "zod": "^3.22.4"
  }
}
```

## Scripts

### Root Scripts

Run from the repository root:

```bash
pnpm build          # Build all packages
pnpm dev            # Dev mode for all packages
pnpm test           # Run all tests
pnpm test:run       # Run tests once (CI)
pnpm docs:dev       # Start docs dev server
pnpm docs:build     # Build docs site
pnpm format         # Format code
pnpm lint           # Lint code
pnpm check          # Format + lint
```

### Package Scripts

Run from a package directory:

```bash
pnpm build          # Build this package
pnpm dev            # Dev mode
pnpm start          # Run the server
pnpm test           # Run tests
pnpm test:coverage  # Run with coverage
```

## Adding a New Package

1. Create directory in `packages/`:
   ```bash
   mkdir packages/new-mcp
   ```

2. Initialize package:
   ```bash
   cd packages/new-mcp
   pnpm init
   ```

3. Add to workspace (automatic with pnpm)

4. Create source structure:
   ```bash
   mkdir -p src/__tests__ src/tools
   touch src/index.ts src/types.ts
   ```

5. Add TypeScript config:
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src/**/*"]
   }
   ```

6. Add documentation:
   ```bash
   mkdir -p docs/packages/new-mcp
   touch docs/packages/new-mcp/index.md
   ```

7. Update VitePress sidebar in `docs/.vitepress/config.ts`

## Best Practices

### File Organization

- ✅ Keep related code together
- ✅ Use clear, descriptive names
- ✅ Separate tests from source
- ✅ Group by feature, not type

### Module Boundaries

- ✅ Each package is independent
- ✅ Shared code goes in `shared` package
- ✅ No circular dependencies
- ✅ Clear public APIs

### Documentation

- ✅ Document in `/docs`, not scattered markdown
- ✅ Keep package READMEs minimal
- ✅ Link to main docs for details
- ✅ Update docs with code changes

## Next Steps

- [Contributing Guide](./contributing) - How to contribute
- [Getting Started](/guide/getting-started) - Set up the project
- [Testing Guide](/guide/testing) - Write and run tests

