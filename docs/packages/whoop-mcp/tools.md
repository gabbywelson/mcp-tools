# Available Tools

The WHOOP MCP server exposes several tools that AI assistants can use to access your WHOOP data.

## Overview Tool

### `whoop_get_overview`

Get a comprehensive daily overview of your WHOOP data.

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Recovery score and status
- Strain level and activities
- Sleep performance and duration
- HRV, RHR, and other metrics

**Example:**

```typescript
// Get today's overview
const overview = await client.getOverview();

// Get specific date
const overview = await client.getOverview("2024-01-15");
```

**Response:**

```
📊 WHOOP Daily Overview for 2024-01-15

🔋 Recovery: 85% (Green)
- HRV: 75ms
- RHR: 52 bpm
- Status: Well recovered

💪 Strain: 12.5
- Activities: 2
- Max HR: 165 bpm

😴 Sleep: 7h 32m
- Performance: 92%
- Quality: Optimal
```

## Recovery Tool

### `whoop_get_recovery`

Get detailed recovery metrics.

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Recovery score and color
- HRV (Heart Rate Variability)
- RHR (Resting Heart Rate)
- Respiratory rate
- Skin temperature
- Blood oxygen levels

**Example:**

```typescript
const recovery = await client.getRecovery("2024-01-15");
```

**Response:**

```
🔋 Recovery Score: 85% (Green)

📈 Metrics:
- HRV: 75ms (↑ from yesterday)
- RHR: 52 bpm (↓ from yesterday)
- Respiratory Rate: 14.5 breaths/min
- Skin Temp: +0.2°F from baseline
- SpO2: 97%

💡 Status: Well recovered, ready for high strain
```

## Sleep Tool

### `whoop_get_sleep`

Get detailed sleep analysis.

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to last night.

**Returns:**
- Sleep duration and performance
- Sleep stages (light, deep, REM, awake)
- Sleep efficiency
- Disturbances
- Respiratory rate during sleep

**Example:**

```typescript
const sleep = await client.getSleep("2024-01-15");
```

**Response:**

```
😴 Sleep Analysis for 2024-01-15

⏱️ Duration: 7h 32m
📊 Performance: 92%
✨ Efficiency: 95%

🌙 Sleep Stages:
- Light: 3h 45m (50%)
- Deep: 1h 30m (20%)
- REM: 2h 00m (27%)
- Awake: 17m (3%)

📈 Metrics:
- Respiratory Rate: 14.2 breaths/min
- Disturbances: 3
- Sleep Onset: 11:23 PM
- Wake Time: 6:55 AM

💡 Quality: Optimal sleep with good stage distribution
```

## Strain Tool

### `whoop_get_strain`

Get strain data and workout details.

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Daily strain score
- Workout activities
- Heart rate zones
- Calories burned
- Activity duration

**Example:**

```typescript
const strain = await client.getStrain("2024-01-15");
```

**Response:**

```
💪 Strain Analysis for 2024-01-15

📊 Day Strain: 12.5

🏃 Activities (2):

1. Morning Run
   - Strain: 8.2
   - Duration: 45 minutes
   - Avg HR: 145 bpm
   - Max HR: 165 bpm
   - Calories: 425 kcal
   - HR Zones:
     * Zone 1: 5 min
     * Zone 2: 15 min
     * Zone 3: 20 min
     * Zone 4: 5 min

2. Afternoon Strength Training
   - Strain: 4.3
   - Duration: 30 minutes
   - Avg HR: 120 bpm
   - Max HR: 140 bpm
   - Calories: 210 kcal

💡 Optimal strain for recovery level
```

## Healthspan Tool

### `whoop_get_healthspan`

Get WHOOP 4.0 healthspan metrics (if available).

**Parameters:**
- `date` (optional): Date in YYYY-MM-DD format. Defaults to today.

**Returns:**
- Healthspan score
- Longevity metrics
- Health trends

**Example:**

```typescript
const healthspan = await client.getHealthspan("2024-01-15");
```

**Note:** This endpoint may not be available for all WHOOP accounts or API versions.

## Using Tools with AI Assistants

### Claude Desktop

Once configured, you can ask Claude:

> "What's my WHOOP recovery score today?"

> "How did I sleep last night?"

> "Show me my strain from yesterday"

Claude will automatically call the appropriate MCP tool and format the response.

### Poke

Connect your Smithery-deployed WHOOP MCP server to Poke, then ask:

> "Give me my WHOOP overview for this week"

> "Compare my recovery from the last 7 days"

Poke can make multiple tool calls and aggregate data across dates.

## Error Handling

All tools handle errors gracefully:

```
❌ Error fetching recovery data: Token expired
Please check your WHOOP credentials and try again.
```

Common errors:
- **Token expired**: Refresh token needs renewal
- **Invalid date**: Date format must be YYYY-MM-DD
- **No data available**: No data for the requested date
- **API error**: WHOOP API is unavailable

## Rate Limiting

WHOOP's API has rate limits. The client handles this automatically with:
- Exponential backoff
- Automatic retries
- Clear error messages

## Data Freshness

- **Recovery**: Updated once per day (morning)
- **Sleep**: Updated after sleep is complete
- **Strain**: Updated throughout the day
- **Activities**: Updated in real-time

## Privacy & Security

All data access:
- ✅ Requires explicit OAuth authorization
- ✅ Uses secure HTTPS connections
- ✅ Respects WHOOP's data policies
- ✅ Only accesses data you've authorized

## Next Steps

- [Configuration](./configuration) - Configure the server
- [Getting Started](./getting-started) - Set up from scratch
- [OAuth Setup](./oauth-setup) - Get your credentials

## Advanced Usage

### Custom Date Ranges

While individual tools accept single dates, AI assistants can make multiple calls:

> "Show me my recovery trend for the last week"

The AI will call `whoop_get_recovery` for each day and analyze the trend.

### Data Aggregation

AI assistants can combine multiple tools:

> "Give me a complete health report for yesterday"

This might call:
1. `whoop_get_overview`
2. `whoop_get_recovery`
3. `whoop_get_sleep`
4. `whoop_get_strain`

And synthesize the results into a comprehensive report.

### Insights & Analysis

AI assistants can provide insights:

> "Why is my recovery low today?"

The AI will analyze your sleep, strain, and recovery data to provide personalized insights.

## API Reference

For developers building custom integrations, see the TypeScript types:

```typescript
// packages/whoop-mcp/src/types.ts

interface RecoveryScore {
  recovery_score: number;
  hrv_rmssd_milli: number;
  resting_heart_rate: number;
  // ... more fields
}

interface SleepActivity {
  sleep_performance_percentage: number;
  stage_summary: {
    total_light_sleep_time_milli: number;
    total_slow_wave_sleep_time_milli: number;
    total_rem_sleep_time_milli: number;
    total_awake_time_milli: number;
  };
  // ... more fields
}
```

See the [source code](https://github.com/yourusername/mcp-tools/tree/main/packages/whoop-mcp/src) for complete type definitions.

