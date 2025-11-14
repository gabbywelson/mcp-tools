# Vitest Setup Guide

This project uses **[Vitest](https://vitest.dev/)** - a blazing fast unit test framework powered by Vite.

## What is Vitest?

Vitest is a modern testing framework that offers:
- ⚡ **Lightning fast** - Powered by Vite's instant HMR
- 🔄 **Watch mode** - Re-runs only changed tests
- 📊 **Beautiful UI** - Optional web-based test UI
- 🎯 **Jest-compatible** - Same API as Jest
- 📦 **ESM first** - Native ES modules support
- 🔍 **TypeScript** - First-class TypeScript support
- 📈 **Coverage** - Built-in code coverage with c8/v8

## Installation

Already installed! Vitest is configured at both the root and package levels.

```bash
# Root dependencies
pnpm add -D vitest @vitest/ui

# Already in package.json
```

## Configuration

### Root Config (`vitest.config.ts`)

The root configuration manages all packages in the monorepo:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### Package Config (`packages/whoop-mcp/vitest.config.ts`)

Each package has its own configuration:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@mcp-tools/whoop-mcp",
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.{js,ts}"],
    testTimeout: 10000,
  },
});
```

## Running Tests

### From Root (All Packages)

```bash
# Watch mode (interactive, re-runs on changes)
pnpm test

# Run once (CI mode)
pnpm test:run

# With UI (opens browser)
pnpm test:ui

# With coverage
pnpm test:coverage
```

### From Package Directory

```bash
cd packages/whoop-mcp

# Watch mode
pnpm test

# Run once
pnpm test:run

# With UI
pnpm test:ui

# With coverage
pnpm test:coverage
```

### Filtering Tests

```bash
# Run tests matching a pattern
pnpm test config

# Run specific file
pnpm test src/__tests__/config.test.ts

# Run tests in a specific package
pnpm test --project @mcp-tools/whoop-mcp
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("MyFeature", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(42);
  });
});
```

### With Setup/Teardown

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("MyFeature", () => {
  let resource: Resource;

  beforeEach(() => {
    // Setup before each test
    resource = createResource();
  });

  afterEach(() => {
    // Cleanup after each test
    resource.cleanup();
  });

  it("should use resource", () => {
    expect(resource.isReady()).toBe(true);
  });
});
```

### Async Tests

```typescript
import { describe, it, expect } from "vitest";

describe("Async Operations", () => {
  it("should fetch data", async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });

  it("should handle errors", async () => {
    await expect(fetchInvalidData()).rejects.toThrow("Not found");
  });
});
```

### Mocking

```typescript
import { describe, it, expect, vi } from "vitest";
import { apiClient } from "./api";

// Mock entire module
vi.mock("./api", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("API Client", () => {
  it("should call API", async () => {
    // Setup mock
    vi.mocked(apiClient.get).mockResolvedValue({ data: "test" });

    // Test
    const result = await apiClient.get("/endpoint");

    // Assert
    expect(apiClient.get).toHaveBeenCalledWith("/endpoint");
    expect(result.data).toBe("test");
  });
});
```

## Test Organization

### Directory Structure

```
packages/whoop-mcp/
├── src/
│   ├── __tests__/              # Test files
│   │   ├── config.test.ts
│   │   ├── whoop-client.test.ts
│   │   └── types.test.ts
│   ├── config.ts
│   ├── whoop-client.ts
│   └── types.ts
└── vitest.config.ts
```

### Naming Conventions

- Test files: `*.test.ts` or `*.spec.ts`
- Place tests in `__tests__/` directory or co-located with source
- Name tests after the file they test: `config.ts` → `config.test.ts`

## Example Tests

### Testing Configuration

```typescript
import { describe, it, expect } from "vitest";
import { env } from "../env.js";

describe("Config", () => {
  it("should have required environment variables", () => {
    expect(env.WHOOP_CLIENT_ID).toBeDefined();
    expect(env.WHOOP_CLIENT_SECRET).toBeDefined();
  });
});
```

### Testing API Client

```typescript
import { describe, it, expect, vi } from "vitest";
import { WhoopClient } from "../whoop-client.js";

describe("WhoopClient", () => {
  it("should create instance", () => {
    const client = new WhoopClient({
      WHOOP_CLIENT_ID: "test",
      WHOOP_CLIENT_SECRET: "test",
      WHOOP_REFRESH_TOKEN: "test",
    });
    expect(client).toBeInstanceOf(WhoopClient);
  });
});
```

### Testing Types

```typescript
import { describe, it, expect } from "vitest";
import type { WhoopUser } from "../types.js";

describe("Types", () => {
  it("should accept valid user object", () => {
    const user: WhoopUser = {
      user_id: 123,
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
    };
    expect(user.user_id).toBe(123);
  });
});
```

## Vitest UI

The Vitest UI provides a beautiful web interface for running tests:

```bash
pnpm test:ui
```

This opens `http://localhost:51204/__vitest__/` with:
- 📊 Test results visualization
- 🔍 Test filtering and search
- 📝 Code coverage display
- ⚡ Live test re-running
- 🎯 Click-to-run individual tests

## Coverage Reports

Generate code coverage reports:

```bash
pnpm test:coverage
```

This creates:
- **Terminal output** - Summary in console
- **HTML report** - `coverage/index.html` (open in browser)
- **JSON report** - `coverage/coverage-final.json` (for CI)

### Coverage Configuration

```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html"],
  include: ["src/**/*.ts"],
  exclude: [
    "src/**/*.{test,spec}.ts",
    "src/types.ts",
    "src/index.ts",
  ],
}
```

### Viewing Coverage

```bash
# Generate coverage
pnpm test:coverage

# Open HTML report
open coverage/index.html
```

## CI Integration

### GitHub Actions

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Best Practices

### 1. Test Organization

```typescript
describe("Feature", () => {
  describe("Subfeature", () => {
    it("should do X", () => {
      // Test
    });
  });
});
```

### 2. Clear Test Names

```typescript
// ✅ Good
it("should return user profile when authenticated", () => {});

// ❌ Bad
it("test1", () => {});
```

### 3. Arrange-Act-Assert Pattern

```typescript
it("should calculate total", () => {
  // Arrange
  const items = [1, 2, 3];
  
  // Act
  const total = sum(items);
  
  // Assert
  expect(total).toBe(6);
});
```

### 4. Test One Thing

```typescript
// ✅ Good - Tests one behavior
it("should validate email format", () => {
  expect(isValidEmail("test@example.com")).toBe(true);
});

// ❌ Bad - Tests multiple things
it("should validate email and password", () => {
  expect(isValidEmail("test@example.com")).toBe(true);
  expect(isValidPassword("password123")).toBe(true);
});
```

### 5. Use Descriptive Assertions

```typescript
// ✅ Good
expect(user.name).toBe("John Doe");
expect(items).toHaveLength(3);
expect(error).toBeInstanceOf(ValidationError);

// ❌ Bad
expect(user.name === "John Doe").toBe(true);
expect(items.length === 3).toBe(true);
```

## Common Assertions

```typescript
// Equality
expect(value).toBe(42);                    // Strict equality (===)
expect(value).toEqual({ a: 1 });           // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(3.14, 2);

// Strings
expect(str).toContain("substring");
expect(str).toMatch(/pattern/);

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain(item);
expect(arr).toEqual(expect.arrayContaining([1, 2]));

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toMatchObject({ a: 1 });

// Functions
expect(fn).toThrow();
expect(fn).toThrow("Error message");
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## Debugging Tests

### 1. Focus on Specific Tests

```typescript
// Run only this test
it.only("should do something", () => {});

// Skip this test
it.skip("should do something", () => {});

// Run only this suite
describe.only("Feature", () => {});
```

### 2. Console Logging

```typescript
it("should debug", () => {
  console.log("Debug info:", value);
  expect(value).toBe(42);
});
```

### 3. VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run"],
  "console": "integratedTerminal"
}
```

## Environment Variables

For tests that need environment variables:

```typescript
import { beforeEach, afterEach } from "vitest";

describe("Config", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, TEST_VAR: "test" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use test env", () => {
    expect(process.env.TEST_VAR).toBe("test");
  });
});
```

## Performance

Vitest is fast, but you can make it faster:

### 1. Run Tests in Parallel

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    pool: "threads",        // Use worker threads (default)
    poolOptions: {
      threads: {
        maxThreads: 4,      // Limit concurrent threads
      },
    },
  },
});
```

### 2. Use Test Isolation

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    isolate: true,          // Isolate tests (default: true)
  },
});
```

### 3. Cache Dependencies

Vitest automatically caches dependencies. Clear cache if needed:

```bash
pnpm vitest --clearCache
```

## Troubleshooting

### "Cannot find module"

**Problem:** Import errors in tests.

**Solution:** Check `tsconfig.json` and ensure paths are correct:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### "Test timeout"

**Problem:** Tests taking too long.

**Solution:** Increase timeout:

```typescript
it("slow test", async () => {
  // Test code
}, 30000); // 30 second timeout
```

Or globally:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 30000,
  },
});
```

### "Coverage not working"

**Problem:** Coverage reports are empty.

**Solution:** Install coverage provider:

```bash
pnpm add -D @vitest/coverage-v8
```

## Migration from Jest

Vitest is mostly Jest-compatible:

```typescript
// Jest
import { describe, it, expect } from "@jest/globals";

// Vitest (same API!)
import { describe, it, expect } from "vitest";
```

Key differences:
- Vitest uses `vi` instead of `jest` for mocking
- Vitest has native ESM support
- Vitest is faster (no need for `--runInBand`)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Next Steps

1. ✅ Vitest is installed and configured
2. ✅ Example tests are in `packages/whoop-mcp/src/__tests__/`
3. 📝 Run `pnpm test` to see tests in action
4. 📝 Run `pnpm test:ui` to see the beautiful UI
5. 📝 Add more tests as you develop features

---

**Happy Testing!** 🎉

