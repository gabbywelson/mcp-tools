#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { WhoopClient } from './whoop-client.js';
import { getOverview } from './tools/overview.js';
import { getSleepAnalysis } from './tools/sleep.js';
import { getRecoveryAnalysis } from './tools/recovery.js';
import { getStrainAnalysis } from './tools/strain.js';
import { getHealthspanAnalysis } from './tools/healthspan.js';

/**
 * WHOOP MCP Server
 * Provides fitness and health data from WHOOP via the Model Context Protocol
 */

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'whoop_get_overview',
    description: 'Get comprehensive WHOOP overview data for a specific date including recovery, strain, sleep, activities, and key statistics',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
  {
    name: 'whoop_get_sleep',
    description: 'Get detailed sleep analysis including performance, duration, efficiency, stages, and sleep needed',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
  {
    name: 'whoop_get_recovery',
    description: 'Get comprehensive recovery analysis including score, HRV, RHR, respiratory rate, and trends vs 30-day baseline',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
  {
    name: 'whoop_get_strain',
    description: 'Get comprehensive strain analysis including score, heart rate zones, activities, and trends vs 30-day baseline',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
  {
    name: 'whoop_get_healthspan',
    description: 'Get healthspan/biological age data (Note: May not be available in current WHOOP API version)',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
      },
    },
  },
];

async function main() {
  // Load configuration
  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error('Failed to load configuration:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Initialize WHOOP client
  const whoopClient = new WhoopClient(config);

  // Create MCP server
  const server = new Server(
    {
      name: 'whoop-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS,
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const date = args?.date as string | undefined;

      switch (name) {
        case 'whoop_get_overview': {
          const result = await getOverview(whoopClient, date);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        }

        case 'whoop_get_sleep': {
          const result = await getSleepAnalysis(whoopClient, date);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        }

        case 'whoop_get_recovery': {
          const result = await getRecoveryAnalysis(whoopClient, date);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        }

        case 'whoop_get_strain': {
          const result = await getStrainAnalysis(whoopClient, date);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        }

        case 'whoop_get_healthspan': {
          const result = await getHealthspanAnalysis(whoopClient, date);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('WHOOP MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

