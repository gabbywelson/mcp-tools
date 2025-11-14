# Contributing

Thank you for your interest in contributing to MCP Tools! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build great software together.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/mcp-tools.git
cd mcp-tools
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create a Branch

```bash
git checkout -b feature/my-new-feature
```

## Development Workflow

### Making Changes

1. **Write code** in the appropriate package
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Format and lint** your code
5. **Add a changeset** to document your changes

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run with coverage
pnpm test:coverage
```

### Code Quality

Format and lint your code before committing:

```bash
# Format, lint, and organize imports
pnpm check

# Or individually:
pnpm format  # Format code
pnpm lint    # Lint and fix
```

### Adding a Changeset

Before committing, add a changeset to document your changes:

```bash
pnpm changeset
```

Follow the prompts:
1. Select the package(s) you changed
2. Choose the version bump type (patch/minor/major)
3. Write a summary of your changes

This creates a file in `.changeset/` that will be committed with your code.

**Version types:**
- **patch** (0.0.X) - Bug fixes, small tweaks
- **minor** (0.X.0) - New features, backwards compatible
- **major** (X.0.0) - Breaking changes

See the [Versioning Guide](/guide/versioning) for details.

## Pull Request Process

### 1. Commit Your Changes

```bash
git add .
git commit -m "feat: add new WHOOP tool for heart rate zones"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `chore:` - Maintenance tasks

### 2. Push to Your Fork

```bash
git push origin feature/my-new-feature
```

### 3. Create Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template
5. Submit!

### PR Checklist

Before submitting, ensure:

- [ ] Code is formatted and linted (`pnpm check`)
- [ ] Tests pass (`pnpm test:run`)
- [ ] Changeset is added (`pnpm changeset`)
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow conventions
- [ ] PR description explains the changes

## Project Structure

See the [Project Structure](/reference/structure) guide for details on how the codebase is organized.

## Coding Standards

### TypeScript

- ✅ Use TypeScript for all code
- ✅ Enable strict mode
- ✅ Define types explicitly
- ✅ Avoid `any` (use `unknown` if needed)

**Good:**
```typescript
function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}
```

**Bad:**
```typescript
function getUser(id: any): any {
  return api.get(`/users/${id}`);
}
```

### Code Style

We use Biome for consistent formatting:

- **Indentation**: Tabs
- **Line width**: 80 characters
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: ES5

Run `pnpm check` to auto-format.

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

**Examples:**
```typescript
// Files
whoop-client.ts
oauth-manager.ts

// Classes
class WhoopClient {}
class TokenManager {}

// Functions
function getUserProfile() {}
async function refreshToken() {}

// Constants
const API_BASE_URL = "https://api.whoop.com";
const MAX_RETRIES = 3;

// Types
interface WhoopUser {}
type RecoveryScore = number;
```

### Testing

- ✅ Write tests for new features
- ✅ Maintain or improve coverage
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange-Act-Assert)

**Good:**
```typescript
describe("WhoopClient", () => {
  it("should fetch user profile successfully", async () => {
    // Arrange
    const client = new WhoopClient(mockConfig);
    
    // Act
    const profile = await client.getUserProfile();
    
    // Assert
    expect(profile).toBeDefined();
    expect(profile.user_id).toBeGreaterThan(0);
  });
});
```

See the [Testing Guide](/guide/testing) for more details.

### Documentation

- ✅ Update docs when changing functionality
- ✅ Add JSDoc comments for public APIs
- ✅ Keep README files up to date
- ✅ Use clear, concise language

**Good:**
```typescript
/**
 * Fetches the user's recovery score for a specific date.
 * 
 * @param date - Date in YYYY-MM-DD format
 * @returns Recovery score and related metrics
 * @throws {Error} If the date is invalid or data is unavailable
 */
async getRecovery(date?: string): Promise<RecoveryScore> {
  // Implementation
}
```

## Adding a New Package

To add a new MCP server or package:

1. **Create package directory:**
   ```bash
   mkdir packages/new-mcp
   cd packages/new-mcp
   ```

2. **Initialize package:**
   ```bash
   pnpm init
   ```

3. **Set up structure:**
   ```bash
   mkdir -p src/__tests__ src/tools
   touch src/index.ts src/types.ts
   ```

4. **Add TypeScript config:**
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "outDir": "./dist"
     }
   }
   ```

5. **Add documentation:**
   ```bash
   mkdir -p ../../docs/packages/new-mcp
   touch ../../docs/packages/new-mcp/index.md
   ```

6. **Update VitePress config** to include your docs

See [Project Structure](/reference/structure) for details.

## Adding a New Tool

To add a new MCP tool to an existing package:

1. **Create tool file:**
   ```bash
   touch packages/whoop-mcp/src/tools/new-tool.ts
   ```

2. **Implement tool:**
   ```typescript
   import type { WhoopClient } from "../whoop-client.js";
   
   export async function getNewData(
     client: WhoopClient,
     date?: string
   ): Promise<string> {
     try {
       const data = await client.getNewData(date);
       return formatNewData(data);
     } catch (error) {
       return `Error: ${error.message}`;
     }
   }
   ```

3. **Register tool** in `src/index.ts`:
   ```typescript
   server.setRequestHandler(ListToolsRequestSchema, async () => ({
     tools: [
       // ... existing tools
       {
         name: "whoop_get_new_data",
         description: "Get new data from WHOOP",
         inputSchema: {
           type: "object",
           properties: {
             date: { type: "string" }
           }
         }
       }
     ]
   }));
   ```

4. **Add test:**
   ```bash
   touch packages/whoop-mcp/src/__tests__/new-tool.test.ts
   ```

5. **Update documentation:**
   - Add to `/docs/packages/whoop-mcp/tools.md`

## Common Tasks

### Running a Specific Package

```bash
# Run WHOOP MCP in dev mode
pnpm --filter @mcp-tools/whoop-mcp dev

# Build only WHOOP MCP
pnpm --filter @mcp-tools/whoop-mcp build

# Test only WHOOP MCP
pnpm --filter @mcp-tools/whoop-mcp test
```

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update axios

# Update to latest (breaking changes)
pnpm update --latest
```

### Building Documentation

```bash
# Start docs dev server
pnpm docs:dev

# Build docs for production
pnpm docs:build

# Preview built docs
pnpm docs:preview
```

## Troubleshooting

### "Cannot find module"

Run `pnpm install` to ensure all dependencies are installed.

### "Type error" in tests

Make sure you've built the package:
```bash
pnpm build
```

### Biome errors

Run `pnpm check` to auto-fix most issues.

### Test failures

Check that your `.env` file is set up correctly (for integration tests).

## Getting Help

- **Documentation**: Check the [docs](/guide/getting-started)
- **Issues**: Search [existing issues](https://github.com/yourusername/mcp-tools/issues)
- **Discussions**: Start a [discussion](https://github.com/yourusername/mcp-tools/discussions)
- **Discord**: Join our community (link TBD)

## Recognition

Contributors are recognized in:
- Release notes (via changesets)
- GitHub contributors page
- Special mentions for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask! Open an issue or discussion if you need help.

Thank you for contributing! 🎉

