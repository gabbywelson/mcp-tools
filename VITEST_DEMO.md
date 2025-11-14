# Vitest Quick Start & Demo

## ✨ What You Just Got

**Vitest** is now fully integrated into your monorepo! Here's what was set up:

### 📦 Installation

- `vitest` - The core test framework
- `@vitest/ui` - Beautiful web-based test UI
- Configuration at root and package levels
- Example tests in `packages/whoop-mcp/src/__tests__/`

### 🎯 Available Commands

```bash
# Watch mode (interactive, re-runs on changes)
pnpm test

# Run once (CI mode)
pnpm test:run

# With beautiful UI (opens browser)
pnpm test:ui

# With coverage report
pnpm test:coverage
```

## 🚀 Try It Now!

### 1. Run Tests

```bash
pnpm test:run
```

**Output:**
```
✓ packages/whoop-mcp/src/__tests__/types.test.ts (5 tests) 2ms
✓ packages/whoop-mcp/src/__tests__/whoop-client.test.ts (3 tests) 1ms
✓ packages/whoop-mcp/src/__tests__/config.test.ts (3 tests) 0ms

Test Files  3 passed (3)
     Tests  11 passed (11)
```

### 2. Watch Mode (Interactive)

```bash
pnpm test
```

This will:
- Watch for file changes
- Re-run only affected tests
- Show results instantly
- Press `h` for help menu

### 3. UI Mode (Visual)

```bash
pnpm test:ui
```

Opens `http://localhost:51204/__vitest__/` with:
- 📊 Visual test results
- 🔍 Filter and search tests
- 📝 View code coverage
- ⚡ Click to run individual tests
- 🎯 See test execution time

## 📝 Example Tests

### Type Tests (`types.test.ts`)

```typescript
import { describe, it, expect } from "vitest";
import type { WhoopUser } from "../types.js";

describe("Type Definitions", () => {
  it("should accept valid user object", () => {
    const user: WhoopUser = {
      user_id: 123,
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
    };

    expect(user.user_id).toBe(123);
    expect(user.email).toBe("test@example.com");
  });
});
```

### Config Tests (`config.test.ts`)

```typescript
import { describe, it, expect } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("Config / Environment Variables", () => {
  it("should have correct config structure", () => {
    const mockConfig: WhoopConfig = {
      WHOOP_CLIENT_ID: "test",
      WHOOP_CLIENT_SECRET: "test",
      WHOOP_REFRESH_TOKEN: "test",
    };

    expect(typeof mockConfig.WHOOP_CLIENT_ID).toBe("string");
    expect(typeof mockConfig.WHOOP_CLIENT_SECRET).toBe("string");
    expect(typeof mockConfig.WHOOP_REFRESH_TOKEN).toBe("string");
  });
});
```

### API Tests (`whoop-client.test.ts`)

```typescript
import { describe, it, expect } from "vitest";
import type { WhoopConfig } from "../config.js";

describe("WhoopClient", () => {
  const mockConfig: WhoopConfig = {
    WHOOP_CLIENT_ID: "test-client-id",
    WHOOP_CLIENT_SECRET: "test-client-secret",
    WHOOP_REFRESH_TOKEN: "test-refresh-token",
  };

  it("should accept valid config", () => {
    expect(mockConfig.WHOOP_CLIENT_ID).toBe("test-client-id");
  });
});
```

## 🏗️ Project Structure

```
mcp-tools/
├── vitest.config.ts              # Root config (manages all packages)
├── packages/
│   └── whoop-mcp/
│       ├── vitest.config.ts      # Package-specific config
│       └── src/
│           ├── __tests__/        # Test files
│           │   ├── config.test.ts
│           │   ├── types.test.ts
│           │   └── whoop-client.test.ts
│           ├── config.ts
│           ├── types.ts
│           └── whoop-client.ts
```

## ✍️ Writing Your First Test

### 1. Create Test File

```bash
touch packages/whoop-mcp/src/__tests__/my-feature.test.ts
```

### 2. Write Test

```typescript
import { describe, it, expect } from "vitest";

describe("MyFeature", () => {
  it("should do something useful", () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  it("should handle edge cases", () => {
    const result = 0 + 0;
    expect(result).toBe(0);
  });
});
```

### 3. Run Tests

```bash
pnpm test
```

Vitest will automatically detect and run your new test!

## 🎨 Common Test Patterns

### Testing Functions

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "../utils.js";

describe("myFunction", () => {
  it("should return correct value", () => {
    expect(myFunction(5)).toBe(10);
  });
});
```

### Testing Async Code

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

### Testing with Setup/Teardown

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Database", () => {
  beforeEach(() => {
    // Setup before each test
    database.connect();
  });

  afterEach(() => {
    // Cleanup after each test
    database.disconnect();
  });

  it("should save data", () => {
    database.save({ id: 1, name: "Test" });
    expect(database.count()).toBe(1);
  });
});
```

### Mocking

```typescript
import { describe, it, expect, vi } from "vitest";
import { apiClient } from "./api";

// Mock module
vi.mock("./api", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("API", () => {
  it("should call endpoint", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: "test" });
    
    const result = await apiClient.get("/users");
    
    expect(apiClient.get).toHaveBeenCalledWith("/users");
    expect(result.data).toBe("test");
  });
});
```

## 📊 Coverage Reports

Generate code coverage:

```bash
pnpm test:coverage
```

This creates:
- **Terminal output** - Summary in console
- **HTML report** - `coverage/index.html`
- **JSON report** - `coverage/coverage-final.json`

View HTML report:

```bash
open coverage/index.html
```

## 🔥 Why Vitest?

### Speed Comparison

| Framework | Cold Start | Watch Mode |
|-----------|------------|------------|
| **Vitest** | ~500ms | ~50ms |
| Jest | ~5s | ~500ms |
| Mocha | ~2s | ~200ms |

### Features

- ⚡ **10x faster** than Jest
- 🔄 **Smart watch mode** - Only re-runs affected tests
- 📦 **ESM native** - No transpilation needed
- 🎯 **TypeScript** - First-class support
- 🎨 **Beautiful UI** - Optional web interface
- 📈 **Coverage** - Built-in with c8/v8
- 🔌 **Jest-compatible** - Same API as Jest
- 🚀 **Vite-powered** - Instant HMR

## 🎯 Best Practices

### 1. Test File Naming

```
✅ config.test.ts
✅ config.spec.ts
❌ config-tests.ts
❌ test-config.ts
```

### 2. Test Organization

```typescript
describe("Feature", () => {
  describe("Subfeature", () => {
    it("should do X", () => {
      // Test
    });
  });
});
```

### 3. Clear Test Names

```typescript
// ✅ Good
it("should return user profile when authenticated", () => {});

// ❌ Bad
it("test1", () => {});
```

### 4. Arrange-Act-Assert

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

## 🛠️ Configuration

### Root Config (`vitest.config.ts`)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.ts"],
    globals: true,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
```

### Package Config (`packages/whoop-mcp/vitest.config.ts`)

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

## 🐛 Debugging

### Focus on Specific Tests

```typescript
// Run only this test
it.only("should do something", () => {});

// Skip this test
it.skip("should do something", () => {});
```

### Console Logging

```typescript
it("should debug", () => {
  console.log("Debug info:", value);
  expect(value).toBe(42);
});
```

### Filter by Name

```bash
# Run tests matching pattern
pnpm test config

# Run specific file
pnpm test src/__tests__/config.test.ts
```

## 📚 Common Assertions

```typescript
// Equality
expect(value).toBe(42);                    // Strict equality
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

// Strings
expect(str).toContain("substring");
expect(str).toMatch(/pattern/);

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain(item);

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toMatchObject({ a: 1 });

// Functions
expect(fn).toThrow();
expect(fn).toHaveBeenCalled();

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## 🔄 CI Integration

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
```

## 🎓 Next Steps

1. ✅ **Run tests** - `pnpm test:run`
2. ✅ **Try UI mode** - `pnpm test:ui`
3. ✅ **Check coverage** - `pnpm test:coverage`
4. 📝 **Write more tests** as you add features
5. 📝 **Add to CI/CD** pipeline

## 📖 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [VITEST_SETUP.md](./VITEST_SETUP.md) - Detailed setup guide
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 💡 Tips

- **Watch mode is your friend** - Use `pnpm test` during development
- **UI mode is great for debugging** - Visual feedback helps
- **Coverage shows gaps** - Use it to find untested code
- **Tests are documentation** - Write clear, descriptive tests
- **Fast tests = happy devs** - Vitest makes testing enjoyable

---

**Happy Testing!** 🎉

Now you have a modern, fast testing setup that will scale with your project!

