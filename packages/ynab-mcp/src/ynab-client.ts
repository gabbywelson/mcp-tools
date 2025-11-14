import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { YnabConfig } from "./config.js";
import type {
  BudgetDetail,
  MonthDetail,
  SaveTransaction,
  SaveTransactionsResponse,
  SaveTransactionsWrapper,
  TransactionsResponse,
  YnabResponse,
} from "./types.js";

/**
 * YNAB API Client with Personal Access Token authentication
 */
export class YnabClient {
  private accessToken: string;
  private budgetId: string;
  private axiosInstance: AxiosInstance;
  private readonly baseURL = "https://api.ynab.com/v1";

  constructor(config: YnabConfig) {
    this.accessToken = config.accessToken;
    this.budgetId = config.budgetId;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as { error?: { detail?: string } };

          // Handle common YNAB API errors
          if (status === 401) {
            throw new Error(
              "Invalid or expired access token. Please check your YNAB_ACCESS_TOKEN."
            );
          }
          if (status === 404) {
            throw new Error(`Resource not found: ${data?.error?.detail || error.message}`);
          }
          if (status === 429) {
            throw new Error("Rate limit exceeded. YNAB API allows 200 requests per hour.");
          }
          if (status >= 500) {
            throw new Error(`YNAB API server error: ${data?.error?.detail || error.message}`);
          }
          throw new Error(`YNAB API error: ${data?.error?.detail || error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get budget details including accounts and categories
   */
  async getBudget(budgetId?: string): Promise<BudgetDetail> {
    const id = budgetId || this.budgetId;
    const response = await this.axiosInstance.get<YnabResponse<BudgetDetail>>(`/budgets/${id}`);
    return response.data.data;
  }

  /**
   * Get categories for a specific month
   * @param budgetId - Budget ID (optional, uses default if not provided)
   * @param month - Month in YYYY-MM-DD format (optional, uses current month if not provided)
   */
  async getCategories(budgetId?: string, month?: string): Promise<MonthDetail> {
    const id = budgetId || this.budgetId;
    const monthParam = month || "current";
    const response = await this.axiosInstance.get<YnabResponse<{ month: MonthDetail }>>(
      `/budgets/${id}/months/${monthParam}`
    );
    return response.data.data.month;
  }

  /**
   * Get transactions
   * @param budgetId - Budget ID (optional, uses default if not provided)
   * @param sinceDate - Only return transactions on or after this date (ISO format YYYY-MM-DD)
   * @param type - Type of transactions to return (optional: uncategorized, unapproved)
   */
  async getTransactions(
    budgetId?: string,
    sinceDate?: string,
    type?: string
  ): Promise<TransactionsResponse> {
    const id = budgetId || this.budgetId;
    const params: Record<string, string> = {};

    if (sinceDate) {
      params.since_date = sinceDate;
    }
    if (type) {
      params.type = type;
    }

    const response = await this.axiosInstance.get<YnabResponse<TransactionsResponse>>(
      `/budgets/${id}/transactions`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Create a new transaction
   * @param budgetId - Budget ID (optional, uses default if not provided)
   * @param transaction - Transaction data to create
   */
  async createTransaction(
    budgetId?: string,
    transaction?: SaveTransaction
  ): Promise<SaveTransactionsResponse> {
    if (!transaction) {
      throw new Error("Transaction data is required");
    }

    const id = budgetId || this.budgetId;
    const requestBody: SaveTransactionsWrapper = {
      transaction,
    };

    const response = await this.axiosInstance.post<YnabResponse<SaveTransactionsResponse>>(
      `/budgets/${id}/transactions`,
      requestBody
    );
    return response.data.data;
  }

  /**
   * Create multiple transactions
   * @param budgetId - Budget ID (optional, uses default if not provided)
   * @param transactions - Array of transaction data to create
   */
  async createTransactions(
    budgetId?: string,
    transactions?: SaveTransaction[]
  ): Promise<SaveTransactionsResponse> {
    if (!transactions || transactions.length === 0) {
      throw new Error("At least one transaction is required");
    }

    const id = budgetId || this.budgetId;
    const requestBody: SaveTransactionsWrapper = {
      transactions,
    };

    const response = await this.axiosInstance.post<YnabResponse<SaveTransactionsResponse>>(
      `/budgets/${id}/transactions`,
      requestBody
    );
    return response.data.data;
  }

  /**
   * Get the default budget ID
   */
  getBudgetId(): string {
    return this.budgetId;
  }
}
