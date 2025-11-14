# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Poke / AI Assistant                  │
│                    (MCP Protocol Client)                     │
└────────────────────────┬────────────────────────────────────┘
                         │ MCP Protocol
                         │ (stdio transport)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    WHOOP MCP Server                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MCP SDK (@modelcontextprotocol/sdk)                 │   │
│  │  - ListTools handler                                 │   │
│  │  - CallTool handler                                  │   │
│  │  - Resource handlers (future)                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  Tool Layer (src/tools/)                            │   │
│  │  - overview.ts                                      │   │
│  │  - recovery.ts                                      │   │
│  │  - sleep.ts                                         │   │
│  │  - strain.ts                                        │   │
│  │  - healthspan.ts                                    │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  WhoopClient (src/whoop-client.ts)                  │   │
│  │  - OAuth token management                           │   │
│  │  - Automatic token refresh                          │   │
│  │  - API request handling                             │   │
│  │  - Error handling & retries                         │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  Configuration (src/env.ts, src/config.ts)          │   │
│  │  - T3 Env validation                                │   │
│  │  - Zod schemas                                      │   │
│  │  - Type-safe config                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (OAuth 2.0)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              WHOOP API (api.prod.whoop.com)                  │
│  - /oauth/oauth2/token (token management)                   │
│  - /developer/v1/user/profile/basic                         │
│  - /developer/v1/recovery                                   │
│  - /developer/v1/activity/sleep                             │
│  - /developer/v1/cycle                                      │
│  - /developer/v1/workout                                    │
│  - /developer/v1/user/measurement/body                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. MCP Server Layer (`src/index.ts`)

**Responsibility**: MCP protocol implementation

- Initializes MCP server with stdio transport
- Registers tool handlers
- Routes tool calls to appropriate implementations
- Handles MCP protocol errors
- Manages server lifecycle

**Key Code**:
```typescript
const server = new Server(
  { name: "whoop-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### 2. Tool Layer (`src/tools/`)

**Responsibility**: Business logic for each MCP tool

Each tool:
- Takes `WhoopClient` instance
- Accepts optional parameters
- Calls WHOOP API via client
- Formats response for AI consumption
- Returns JSON string or formatted text

**Pattern**:
```typescript
export async function getTool(
  client: WhoopClient,
  param?: string
): Promise<string> {
  const data = await client.getApiData(param);
  return JSON.stringify(data, null, 2);
}
```

### 3. WHOOP Client Layer (`src/whoop-client.ts`)

**Responsibility**: WHOOP API communication

**Features**:
- OAuth 2.0 token management
- Automatic token refresh before expiry
- Axios instance with base configuration
- Error handling and retry logic
- Type-safe API methods

**Token Flow**:
```typescript
1. Check if token expired → refreshAccessToken()
2. Make API request with Bearer token
3. If 401 → refresh and retry
4. Return typed response
```

### 4. Configuration Layer (`src/env.ts`, `src/config.ts`)

**Responsibility**: Environment variable management

**T3 Env Flow**:
```typescript
1. Define schema with Zod
2. Validate process.env at runtime
3. Throw descriptive errors if invalid
4. Export type-safe config object
```

**Required Variables**:
- `WHOOP_CLIENT_ID`: OAuth client ID
- `WHOOP_CLIENT_SECRET`: OAuth client secret
- `WHOOP_REFRESH_TOKEN`: Long-lived refresh token

## Data Flow

### Tool Invocation Flow

```
1. AI Assistant sends MCP CallTool request
   ↓
2. MCP Server receives request
   ↓
3. Server routes to appropriate tool function
   ↓
4. Tool function calls WhoopClient method
   ↓
5. WhoopClient checks token validity
   ↓
6. If expired: refresh token
   ↓
7. Make HTTPS request to WHOOP API
   ↓
8. Parse response
   ↓
9. Return typed data to tool
   ↓
10. Tool formats data for AI
    ↓
11. MCP Server sends response back
    ↓
12. AI Assistant processes result
```

### OAuth Token Refresh Flow

```
1. Check: currentTime >= tokenExpiresAt?
   ↓
2. If yes: POST to /oauth/oauth2/token
   ↓
3. Send: refresh_token, client_id, client_secret
   ↓
4. Receive: new access_token, expires_in, refresh_token
   ↓
5. Update: this.accessToken, this.tokenExpiresAt
   ↓
6. If new refresh_token: update this.refreshToken
   ↓
7. Continue with original request
```

## Type System

### Type Flow

```typescript
// 1. Define API response types
interface WhoopUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

// 2. Type API client methods
async getUser(): Promise<WhoopUser> {
  const response = await this.axiosInstance.get<WhoopUser>("/v1/user/profile/basic");
  return response.data;
}

// 3. Type tool functions
async function getOverview(client: WhoopClient): Promise<string> {
  const user: WhoopUser = await client.getUser();
  return JSON.stringify(user, null, 2);
}

// 4. MCP tool schema (runtime validation)
{
  name: "whoop_overview",
  inputSchema: {
    type: "object",
    properties: {},
  },
}
```

## Error Handling Strategy

### Layers of Error Handling

1. **Configuration Layer**: Validation errors at startup
   ```typescript
   if (!WHOOP_CLIENT_ID) throw new Error("Missing WHOOP_CLIENT_ID");
   ```

2. **Client Layer**: API and network errors
   ```typescript
   try {
     return await this.axiosInstance.get(endpoint);
   } catch (error) {
     if (axios.isAxiosError(error)) {
       // Handle HTTP errors
     }
     throw error;
   }
   ```

3. **Tool Layer**: Business logic errors
   ```typescript
   try {
     const data = await client.getData();
     return formatData(data);
   } catch (error) {
     return JSON.stringify({ error: error.message });
   }
   ```

4. **MCP Layer**: Protocol errors
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     try {
       return await handleTool(request);
     } catch (error) {
       return { content: [{ type: "text", text: `Error: ${error.message}` }] };
     }
   });
   ```

## Security Considerations

### OAuth Security

1. **Never log tokens**: Tokens are sensitive credentials
2. **Use refresh tokens**: Long-lived, can be revoked
3. **Store securely**: Use environment variables, not code
4. **HTTPS only**: All API communication encrypted
5. **Token rotation**: Accept new refresh tokens from API

### Environment Variables

1. **Validation**: T3 Env validates at startup
2. **No defaults**: Force explicit configuration
3. **Type safety**: Zod schemas prevent typos
4. **No commits**: `.env` in `.gitignore`

### API Security

1. **Rate limiting**: Respect WHOOP's rate limits
2. **Error messages**: Don't expose sensitive info
3. **Input validation**: Validate tool parameters
4. **Scoped access**: Request minimum OAuth scopes

## Performance Considerations

### Token Caching

- Cache access token in memory
- Only refresh when expired
- Avoid unnecessary token requests

### Response Caching (Future)

```typescript
// Potential future enhancement
const cache = new Map<string, { data: any; expires: number }>();

async getCachedData(key: string, ttl: number) {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }
  const data = await fetchData();
  cache.set(key, { data, expires: Date.now() + ttl });
  return data;
}
```

### Pagination Handling

```typescript
async getAllPages<T>(endpoint: string): Promise<T[]> {
  let allData: T[] = [];
  let nextToken: string | undefined;
  
  do {
    const response = await this.get<PaginatedResponse<T>>(
      endpoint,
      nextToken ? { params: { nextToken } } : {}
    );
    allData = [...allData, ...response.records];
    nextToken = response.next_token;
  } while (nextToken);
  
  return allData;
}
```

## Testing Strategy

### Unit Tests

- **Config**: Validation logic
- **Client**: Token refresh, error handling
- **Tools**: Data formatting, edge cases
- **Types**: Type definitions exist

### Integration Tests (Future)

- Mock WHOOP API responses
- Test full tool invocation flow
- Test error scenarios
- Test token refresh

### E2E Tests (Future)

- Test with MCP Inspector
- Test with real Poke integration
- Test OAuth flow end-to-end

## Deployment Architecture

### Smithery Deployment

```
User → Smithery Platform → Docker Container
                            ├── Node.js runtime
                            ├── MCP Server
                            └── Environment variables
```

### Local Development

```
Developer → MCP Inspector → Local MCP Server
                            ├── tsx (TypeScript execution)
                            ├── dotenv (env loading)
                            └── Watch mode (auto-reload)
```

## Extension Points

### Adding New Tools

1. Create `src/tools/new-tool.ts`
2. Add types to `src/types.ts`
3. Add client method to `WhoopClient`
4. Register in `src/index.ts`
5. Add tests
6. Document

### Adding New Packages

1. Create `packages/new-package/`
2. Add to `pnpm-workspace.yaml`
3. Create `package.json`
4. Add `tsconfig.json`
5. Implement functionality
6. Add tests and docs

### Adding Resources (Future)

MCP supports "resources" for static content:

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "whoop://user/profile",
      name: "User Profile",
      mimeType: "application/json",
    },
  ],
}));
```

## Monitoring & Observability (Future)

Potential enhancements:

- **Logging**: Structured logging with pino
- **Metrics**: Request counts, latency, errors
- **Tracing**: OpenTelemetry for distributed tracing
- **Alerts**: Error rate thresholds

## Scalability Considerations

Current architecture is single-instance:
- One MCP server per user
- Stateless (no shared state)
- Scales horizontally (multiple users = multiple instances)

Future considerations:
- Shared cache layer (Redis)
- Rate limit coordination
- Token refresh coordination

---

**This architecture is designed for**:
- ✅ Type safety
- ✅ Maintainability
- ✅ Testability
- ✅ Security
- ✅ Developer experience

