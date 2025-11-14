#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { type YnabConfig, loadConfig } from "./config.js";
import { getBudgetSummary } from "./tools/budget-summary.js";
import { getCategoryActivity } from "./tools/category-activity.js";
import { createTransaction } from "./tools/create-transaction.js";
import { getRecentTransactions } from "./tools/recent-transactions.js";
import { YnabClient } from "./ynab-client.js";

/**
 * YNAB MCP Server
 * Provides budget and transaction data from YNAB via the Model Context Protocol
 */

// Define available tools
const TOOLS: Tool[] = [
  {
    name: "ynab_get_budget_summary",
    description:
      "Get comprehensive budget overview including account balances, category group totals, and net worth. Returns on-budget and off-budget accounts with current balances.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "ynab_get_category_activity",
    description:
      "Get detailed category budgeted amounts, activity (spending), and balances for a specific month. Shows categories grouped by category groups with totals and goal progress.",
    inputSchema: {
      type: "object",
      properties: {
        month: {
          type: "string",
          description:
            "Month in YYYY-MM-DD format (optional, defaults to current month). Use first day of month (e.g., 2024-01-01 for January 2024).",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        },
      },
    },
  },
  {
    name: "ynab_list_recent_transactions",
    description:
      "List recent transactions with optional date filter. Returns transaction details including date, payee, category, amount, and cleared status. Sorted by date (most recent first).",
    inputSchema: {
      type: "object",
      properties: {
        since_date: {
          type: "string",
          description:
            "Only return transactions on or after this date in YYYY-MM-DD format (optional)",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        },
        limit: {
          type: "number",
          description: "Maximum number of transactions to return (optional, default: 20)",
          minimum: 1,
          maximum: 100,
        },
      },
    },
  },
  {
    name: "ynab_create_transaction",
    description:
      "Create a new transaction in YNAB. Requires account ID, date, and amount. Amount must be in milliunits (1000 = $1.00). Negative amounts are outflows (expenses), positive amounts are inflows (income).",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description: "Account UUID from YNAB (required)",
        },
        date: {
          type: "string",
          description: "Transaction date in YYYY-MM-DD format (required)",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
        },
        amount: {
          type: "number",
          description:
            "Amount in milliunits (required). 1000 milliunits = $1.00. Negative for outflows (expenses), positive for inflows (income). Example: -50000 = -$50.00 expense",
        },
        payee_name: {
          type: "string",
          description: "Payee name (optional)",
        },
        memo: {
          type: "string",
          description: "Transaction memo/note (optional)",
        },
        category_id: {
          type: "string",
          description: "Category UUID from YNAB (optional)",
        },
      },
      required: ["account_id", "date", "amount"],
    },
  },
];

async function main() {
  // Load configuration
  let config: YnabConfig;
  try {
    config = loadConfig();
  } catch (error) {
    console.error("Failed to load configuration:", error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Initialize YNAB client
  const ynabClient = new YnabClient(config);

  // Create MCP server
  const server = new Server(
    {
      name: "ynab-mcp",
      version: "1.0.0",
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
      switch (name) {
        case "ynab_get_budget_summary": {
          const result = await getBudgetSummary(ynabClient);
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "ynab_get_category_activity": {
          const month = args?.month as string | undefined;
          const result = await getCategoryActivity(ynabClient, month);
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "ynab_list_recent_transactions": {
          const sinceDate = args?.since_date as string | undefined;
          const limit = args?.limit as number | undefined;
          const result = await getRecentTransactions(ynabClient, sinceDate, limit);
          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "ynab_create_transaction": {
          const accountId = args?.account_id as string;
          const date = args?.date as string;
          const amount = args?.amount as number;
          const payeeName = args?.payee_name as string | undefined;
          const memo = args?.memo as string | undefined;
          const categoryId = args?.category_id as string | undefined;

          const result = await createTransaction(
            ynabClient,
            accountId,
            date,
            amount,
            payeeName,
            memo,
            categoryId
          );
          return {
            content: [
              {
                type: "text",
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
            type: "text",
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

  console.error("YNAB MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
