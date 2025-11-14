# Biome Setup

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Biome is a fast, modern toolchain that replaces ESLint and Prettier with better performance and a unified configuration.

## What is Biome?

Biome is a fast formatter and linter for JavaScript, TypeScript, JSX, JSON, and more. It's designed to be:

- **Fast**: Written in Rust, 25x faster than Prettier
- **Simple**: One tool instead of ESLint + Prettier
- **Compatible**: Drop-in replacement with similar rules
- **Reliable**: Deterministic formatting with no surprises

## Installation

Biome is already installed as a dev dependency. If you need to reinstall:

```bash
pnpm install
```

## Configuration

The Biome configuration is in [`biome.json`](./biome.json) at the project root.

### Key Settings

```json
{
  "formatter": {
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## Usage

### Command Line

From the root directory:

```bash
# Format all files
pnpm format

# Lint all files and apply safe fixes
pnpm lint

# Format, lint, and organize imports
pnpm check

# Check for CI (no writes)
pnpm ci
```

From the `packages/whoop-mcp` directory:

```bash
# Format files in this package
pnpm format

# Lint files in this package
pnpm lint

# Check everything
pnpm check
```

### VS Code Integration

1. **Install the Biome extension**:
   - Open VS Code
   - Go to Extensions (Cmd+Shift+X)
   - Search for "Biome"
   - Install the official Biome extension

2. **Extension is auto-recommended**:
   - When you open this project, VS Code will suggest installing Biome
   - Click "Install" on the notification

3. **Auto-format on save**:
   - Already configured in `.vscode/settings.json`
   - Files will auto-format when you save
   - Imports will auto-organize

### Editor Configuration

The `.vscode/settings.json` file configures:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

## Available Commands

### Root Package

| Command | Description |
|---------|-------------|
| `pnpm format` | Format all files in the workspace |
| `pnpm lint` | Lint all files and apply safe fixes |
| `pnpm check` | Format, lint, and organize imports |
| `pnpm ci` | Check without writing (for CI) |

### Whoop MCP Package

| Command | Description |
|---------|-------------|
| `pnpm format` | Format files in this package |
| `pnpm lint` | Lint files in this package |
| `pnpm check` | Format, lint, and organize imports |

## What Biome Checks

### Formatting

- Consistent indentation (2 spaces)
- Line width (100 characters)
- Quote style (double quotes)
- Semicolons (always)
- Trailing commas (ES5 style)
- Line endings (LF)

### Linting

Biome includes 200+ rules covering:

- **Correctness**: Catch bugs and errors
- **Suspicious**: Identify suspicious patterns
- **Style**: Enforce consistent code style
- **Performance**: Optimize code patterns
- **Security**: Detect security issues

### Import Organization

- Remove unused imports
- Sort imports alphabetically
- Group imports by type (external, internal, etc.)

## Migrating from ESLint/Prettier

Biome is designed as a drop-in replacement:

1. **Remove old tools**:
   ```bash
   pnpm remove eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

2. **Remove config files**:
   ```bash
   rm .eslintrc.json .prettierrc .prettierignore
   ```

3. **Update scripts**: Already done in `package.json`

4. **Update CI**: Use `pnpm ci` instead of `eslint` and `prettier`

## CI Integration

For continuous integration, use the `ci` command:

```bash
pnpm ci
```

This will:
- Check formatting without writing
- Run linter without fixing
- Exit with error code if issues found
- Perfect for CI pipelines

### GitHub Actions Example

```yaml
- name: Check code quality
  run: pnpm ci
```

### GitLab CI Example

```yaml
lint:
  script:
    - pnpm ci
```

## Ignoring Files

Files are ignored via `biome.json`:

```json
{
  "files": {
    "ignore": [
      "node_modules",
      "dist",
      ".pnpm-store",
      "*.tsbuildinfo"
    ]
  }
}
```

Biome also respects `.gitignore` by default.

## Performance

Biome is **significantly faster** than ESLint + Prettier:

- **Format**: ~25x faster than Prettier
- **Lint**: ~10x faster than ESLint
- **Check**: Runs both in parallel

Example on this project:
- Prettier: ~500ms
- Biome: ~20ms

## Troubleshooting

### "Biome command not found"

**Solution**: Install dependencies
```bash
pnpm install
```

### VS Code not formatting on save

**Solution**: 
1. Install the Biome extension
2. Reload VS Code
3. Check `.vscode/settings.json` exists

### Different formatting in CI vs local

**Solution**: 
- Ensure same Biome version (pinned in `package.json`)
- Run `pnpm install` to sync versions

### Conflicts with existing Prettier/ESLint

**Solution**:
1. Disable Prettier extension in VS Code
2. Disable ESLint extension in VS Code
3. Or remove them: `pnpm remove eslint prettier`

## Configuration Reference

See the [Biome documentation](https://biomejs.dev/reference/configuration/) for all available options.

### Common Customizations

**Change line width**:
```json
{
  "formatter": {
    "lineWidth": 120
  }
}
```

**Use single quotes**:
```json
{
  "javascript": {
    "formatter": {
      "quoteStyle": "single"
    }
  }
}
```

**Disable specific rules**:
```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

## Resources

- [Biome Documentation](https://biomejs.dev/)
- [Biome GitHub](https://github.com/biomejs/biome)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [Configuration Reference](https://biomejs.dev/reference/configuration/)
- [Linter Rules](https://biomejs.dev/linter/rules/)

## Support

For issues with Biome:
- Check the [Biome documentation](https://biomejs.dev/)
- Open an issue on [Biome GitHub](https://github.com/biomejs/biome/issues)
- Ask in the [Biome Discord](https://discord.gg/BypW39g6Yc)

