# T3 Env Configuration

This project uses [T3 Env](https://env.t3.gg/) for type-safe environment variable management. T3 Env provides runtime validation and excellent TypeScript support, ensuring your application fails fast with clear error messages if configuration is invalid.

## Why T3 Env?

T3 Env offers several advantages over manual environment variable handling:

- ✅ **Type Safety**: Full TypeScript support with autocomplete
- ✅ **Runtime Validation**: Validates on startup, not at usage time
- ✅ **Clear Errors**: Detailed error messages for missing/invalid variables
- ✅ **Zero Runtime Overhead**: Validation happens once at startup
- ✅ **Framework Agnostic**: Works with any Node.js application
- ✅ **Built on Zod**: Leverages the powerful Zod validation library

## Configuration File

The environment configuration is defined in [`src/env.ts`](../src/env.ts):

```typescript
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    WHOOP_CLIENT_ID: z.string().min(1, "WHOOP Client ID is required"),
    WHOOP_CLIENT_SECRET: z.string().min(1, "WHOOP Client Secret is required"),
    WHOOP_REFRESH_TOKEN: z.string().min(1, "WHOOP Refresh Token is required"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
```

## Usage

### Importing Environment Variables

```typescript
// Import the validated env object
import { env } from './env.js';

// Access environment variables with full type safety
const clientId = env.WHOOP_CLIENT_ID;
const clientSecret = env.WHOOP_CLIENT_SECRET;
const refreshToken = env.WHOOP_REFRESH_TOKEN;
```

### Using the Config Object

For backwards compatibility, we also export a `config` object:

```typescript
import { config } from './config.js';

// Access configuration
const whoopClient = new WhoopClient(config);
```

## Environment Variables

### Required Variables

All three environment variables are **required** and must be non-empty strings:

| Variable | Description | Example |
|----------|-------------|---------|
| `WHOOP_CLIENT_ID` | OAuth Client ID from WHOOP Developer Portal | `abc123xyz` |
| `WHOOP_CLIENT_SECRET` | OAuth Client Secret from WHOOP Developer Portal | `secret_abc123` |
| `WHOOP_REFRESH_TOKEN` | OAuth Refresh Token from authorization flow | `def456abc789` |

### Setting Environment Variables

**Local Development** (`.env` file):
```env
WHOOP_CLIENT_ID=your_client_id_here
WHOOP_CLIENT_SECRET=your_client_secret_here
WHOOP_REFRESH_TOKEN=your_refresh_token_here
```

**Command Line**:
```bash
export WHOOP_CLIENT_ID=your_client_id_here
export WHOOP_CLIENT_SECRET=your_client_secret_here
export WHOOP_REFRESH_TOKEN=your_refresh_token_here
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": ["path/to/dist/index.js"],
      "env": {
        "WHOOP_CLIENT_ID": "your_client_id",
        "WHOOP_CLIENT_SECRET": "your_client_secret",
        "WHOOP_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

**Smithery**: Configure via the Smithery UI when deploying.

## Validation

### When Validation Occurs

T3 Env validates environment variables **immediately when the module is imported**. This means:

- ✅ Validation happens at startup, not at runtime
- ✅ Invalid configuration prevents the application from starting
- ✅ No need to check for undefined values throughout your code
- ✅ TypeScript knows all variables are defined and valid

### Validation Rules

Each environment variable is validated with these rules:

1. **Must exist**: Cannot be `undefined`
2. **Must be non-empty**: Empty strings are treated as undefined
3. **Must be a string**: Type checking via Zod
4. **Minimum length**: Must have at least 1 character

### Error Messages

If validation fails, you'll see clear error messages:

```
❌ Invalid environment variables:
{
  WHOOP_CLIENT_ID: [ 'WHOOP Client ID is required' ],
  WHOOP_CLIENT_SECRET: [ 'WHOOP Client Secret is required' ]
}
Error: Invalid environment variables
```

## Adding New Environment Variables

To add a new environment variable:

1. **Update `src/env.ts`**:
   ```typescript
   export const env = createEnv({
     server: {
       WHOOP_CLIENT_ID: z.string().min(1),
       WHOOP_CLIENT_SECRET: z.string().min(1),
       WHOOP_REFRESH_TOKEN: z.string().min(1),
       // Add your new variable
       NEW_VARIABLE: z.string().optional(),
     },
     runtimeEnv: process.env,
   });
   ```

2. **Update `.env.example`**:
   ```env
   WHOOP_CLIENT_ID=your_client_id_here
   WHOOP_CLIENT_SECRET=your_client_secret_here
   WHOOP_REFRESH_TOKEN=your_refresh_token_here
   NEW_VARIABLE=optional_value
   ```

3. **Update documentation** to describe the new variable

## Advanced Validation

T3 Env uses Zod, so you can use any Zod validation:

```typescript
export const env = createEnv({
  server: {
    // URL validation
    API_URL: z.string().url(),
    
    // Email validation
    ADMIN_EMAIL: z.string().email(),
    
    // Number with constraints
    PORT: z.coerce.number().int().min(1000).max(65535).default(3000),
    
    // Enum validation
    NODE_ENV: z.enum(["development", "production", "test"]),
    
    // Optional with default
    LOG_LEVEL: z.string().default("info"),
    
    // Custom validation
    API_KEY: z.string().regex(/^[A-Za-z0-9]{32}$/, "Invalid API key format"),
  },
  runtimeEnv: process.env,
});
```

## TypeScript Integration

T3 Env provides excellent TypeScript support:

```typescript
import { env } from './env.js';

// ✅ TypeScript knows these are strings
const clientId: string = env.WHOOP_CLIENT_ID;

// ✅ Autocomplete works
env.WHOOP_  // IDE suggests: WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, WHOOP_REFRESH_TOKEN

// ❌ TypeScript error: Property doesn't exist
env.INVALID_VAR;  // Error: Property 'INVALID_VAR' does not exist
```

## Testing

For testing, you can mock environment variables:

```typescript
// test/setup.ts
process.env.WHOOP_CLIENT_ID = "test_client_id";
process.env.WHOOP_CLIENT_SECRET = "test_client_secret";
process.env.WHOOP_REFRESH_TOKEN = "test_refresh_token";

// Now import your modules
import { env } from '../src/env.js';
```

## Troubleshooting

### "Invalid environment variables" on startup

**Cause**: One or more required environment variables are missing or empty.

**Solution**: 
1. Check your `.env` file exists and has all required variables
2. Ensure no variables are empty strings
3. Check for typos in variable names
4. Verify the `.env` file is in the correct directory

### TypeScript errors about env properties

**Cause**: TypeScript doesn't recognize the environment variable.

**Solution**: 
1. Ensure the variable is defined in `src/env.ts`
2. Rebuild the project: `pnpm build`
3. Restart your TypeScript server in your IDE

### Environment variables not loading

**Cause**: The `.env` file isn't being loaded.

**Solution**:
1. T3 Env doesn't load `.env` files automatically
2. Use a package like `dotenv` if needed:
   ```typescript
   import 'dotenv/config';
   import { env } from './env.js';
   ```
3. Or use your framework's built-in env loading

## Resources

- [T3 Env Documentation](https://env.t3.gg/)
- [T3 Env GitHub](https://github.com/t3-oss/t3-env)
- [Zod Documentation](https://zod.dev/)
- [T3 Stack](https://create.t3.gg/)

## Migration from Old Config

The old `config.ts` implementation has been updated to use T3 Env under the hood. The API remains the same for backwards compatibility:

**Old way (still works)**:
```typescript
import { loadConfig } from './config.js';
const config = loadConfig();
```

**New way (recommended)**:
```typescript
import { env } from './env.js';
// or
import { config } from './config.js';
```

Both approaches work, but the new way provides better type safety and is more idiomatic.

