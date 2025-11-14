# Code Snippets

Common patterns and snippets for this project.

## MCP Tool Template

```typescript
// src/tools/example.ts
import type { WhoopClient } from "../whoop-client.js";

/**
 * Get example data from WHOOP
 * @param client - Authenticated WHOOP client
 * @param param - Optional parameter
 * @returns Formatted JSON string
 */
export async function getExample(
  client: WhoopClient,
  param?: string
): Promise<string> {
  try {
    const data = await client.getExampleData(param);
    
    return JSON.stringify(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  } catch (error) {
    return JSON.stringify(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      null,
      2
    );
  }
}
```

## WhoopClient Method Template

```typescript
// src/whoop-client.ts

/**
 * Get example data from WHOOP API
 * @param param - Optional parameter
 * @returns Example data
 */
async getExampleData(param?: string): Promise<ExampleType> {
  await this.ensureValidToken();
  
  const endpoint = param 
    ? `/v1/example/${param}` 
    : "/v1/example";
  
  const response = await this.axiosInstance.get<ExampleType>(endpoint);
  return response.data;
}
```

## Type Definition Template

```typescript
// src/types.ts

/**
 * Example data from WHOOP API
 */
export interface ExampleType {
  /** Unique identifier */
  id: number;
  
  /** Example name */
  name: string;
  
  /** Example value */
  value: number;
  
  /** ISO 8601 timestamp */
  created_at: string;
  
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}
```

## MCP Tool Registration

```typescript
// src/index.ts

// 1. Add to ListTools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ... existing tools
    {
      name: "whoop_example",
      description: "Get example data from WHOOP",
      inputSchema: {
        type: "object",
        properties: {
          param: {
            type: "string",
            description: "Optional parameter for filtering",
          },
        },
      },
    },
  ],
}));

// 2. Add to CallTool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ... existing cases
      case "whoop_example": {
        const param = args?.param as string | undefined;
        const result = await getExample(whoopClient, param);
        return {
          content: [{ type: "text", text: result }],
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // ... error handling
  }
});
```

## Test Template

```typescript
// src/__tests__/example.test.ts
import { describe, it, expect, vi } from "vitest";
import { getExample } from "../tools/example.js";
import type { WhoopClient } from "../whoop-client.js";

describe("getExample", () => {
  it("should return formatted example data", async () => {
    // Arrange
    const mockClient = {
      getExampleData: vi.fn().mockResolvedValue({
        id: 1,
        name: "Test",
        value: 42,
        created_at: "2024-01-01T00:00:00Z",
      }),
    } as unknown as WhoopClient;

    // Act
    const result = await getExample(mockClient);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.success).toBe(true);
    expect(parsed.data.id).toBe(1);
    expect(parsed.data.name).toBe("Test");
    expect(mockClient.getExampleData).toHaveBeenCalledOnce();
  });

  it("should handle errors gracefully", async () => {
    // Arrange
    const mockClient = {
      getExampleData: vi.fn().mockRejectedValue(new Error("API Error")),
    } as unknown as WhoopClient;

    // Act
    const result = await getExample(mockClient);
    const parsed = JSON.parse(result);

    // Assert
    expect(parsed.success).toBe(false);
    expect(parsed.error).toBe("API Error");
  });

  it("should pass parameters correctly", async () => {
    // Arrange
    const mockClient = {
      getExampleData: vi.fn().mockResolvedValue({ id: 1 }),
    } as unknown as WhoopClient;

    // Act
    await getExample(mockClient, "test-param");

    // Assert
    expect(mockClient.getExampleData).toHaveBeenCalledWith("test-param");
  });
});
```

## Environment Variable Addition

```typescript
// src/env.ts
export const env = createEnv({
  server: {
    // ... existing vars
    
    NEW_VAR: z
      .string()
      .min(1, "New variable is required")
      .describe("Description of the new variable"),
  },
  // ... rest of config
});
```

```bash
# .env
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REFRESH_TOKEN=your_refresh_token
NEW_VAR=your_new_value
```

## Changeset Template

```markdown
---
"@mcp-tools/whoop-mcp": minor
---

Add new example tool

- Implements `whoop_example` tool for getting example data
- Adds `ExampleType` interface
- Includes comprehensive tests
- Updates documentation
```

## Documentation Template

```markdown
# Tool Name

## Description

Brief description of what this tool does.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param` | `string` | No | Description of parameter |

## Example Usage

\`\`\`typescript
// Via MCP
{
  "name": "whoop_example",
  "arguments": {
    "param": "value"
  }
}
\`\`\`

## Response Format

\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example",
    "value": 42
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

## Error Handling

Possible errors:
- Invalid parameter
- API unavailable
- Authentication failed

## Related Tools

- [Other Tool](/packages/whoop-mcp/tools#other-tool)
```

## Axios Request with Pagination

```typescript
async getPaginatedData<T>(endpoint: string): Promise<T[]> {
  await this.ensureValidToken();
  
  let allData: T[] = [];
  let nextToken: string | undefined;
  
  do {
    const params = nextToken ? { nextToken } : {};
    const response = await this.axiosInstance.get<PaginatedResponse<T>>(
      endpoint,
      { params }
    );
    
    allData = [...allData, ...response.data.records];
    nextToken = response.data.next_token;
  } while (nextToken);
  
  return allData;
}
```

## Error Handling Pattern

```typescript
try {
  const data = await riskyOperation();
  return { success: true, data };
} catch (error) {
  if (axios.isAxiosError(error)) {
    // HTTP error
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (status === 401) {
      // Token expired, try refresh
      await this.refreshAccessToken();
      return this.retryRequest();
    }
    
    return { 
      success: false, 
      error: `HTTP ${status}: ${message}` 
    };
  }
  
  // Generic error
  return { 
    success: false, 
    error: error instanceof Error ? error.message : "Unknown error" 
  };
}
```

## Date Range Helper

```typescript
/**
 * Get date range for queries
 * @param days - Number of days to look back
 * @returns ISO 8601 date strings
 */
function getDateRange(days: number = 7): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
```

## Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError!;
}
```

## Zod Schema for Validation

```typescript
import { z } from "zod";

const ExampleSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  value: z.number(),
  created_at: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

type Example = z.infer<typeof ExampleSchema>;

// Validate API response
function validateExample(data: unknown): Example {
  return ExampleSchema.parse(data);
}
```

## Biome Ignore Comments

```typescript
// Ignore specific rule
// biome-ignore lint/suspicious/noExplicitAny: Legacy code, will fix later
function legacyFunction(data: any) {
  return data;
}

// Ignore entire file
// biome-ignore-file
```

## Git Commit Templates

```bash
# Feature
git commit -m "feat(whoop): add example tool for data retrieval"

# Bug fix
git commit -m "fix(auth): resolve token refresh race condition"

# Documentation
git commit -m "docs(readme): update OAuth setup instructions"

# Tests
git commit -m "test(client): add coverage for error handling"

# Chore
git commit -m "chore(deps): upgrade axios to v1.6.3"

# Breaking change
git commit -m "feat(config)!: migrate to T3 Env

BREAKING CHANGE: Config format changed from plain object to T3 Env"
```

## Package.json Script Pattern

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "clean": "rm -rf dist coverage",
    "format": "biome format --write .",
    "lint": "biome lint --write .",
    "check": "biome check --write ."
  }
}
```

## VitePress Callouts

```markdown
::: tip
Helpful tip for users
:::

::: warning
Warning about potential issues
:::

::: danger
Critical warning about breaking changes
:::

::: info
Informational note
:::

::: details Click to expand
Hidden content that can be expanded
:::
```

## Mock Axios Instance

```typescript
import { vi } from "vitest";
import type { AxiosInstance } from "axios";

const mockAxios: Partial<AxiosInstance> = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Use in tests
mockAxios.get.mockResolvedValue({ data: { id: 1 } });
```

## TypeScript Utility Types

```typescript
// Make all properties optional
type PartialExample = Partial<Example>;

// Pick specific properties
type ExampleId = Pick<Example, "id" | "name">;

// Omit specific properties
type ExampleWithoutMeta = Omit<Example, "metadata">;

// Make specific properties required
type RequiredExample = Required<Example>;

// Extract return type
type ExampleReturn = ReturnType<typeof getExample>;

// Extract promise type
type ExampleData = Awaited<ReturnType<typeof getExampleData>>;
```

---

**Tip**: Copy these snippets and customize them for your specific needs!

