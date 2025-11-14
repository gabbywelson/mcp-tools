/**
 * Type definitions for YNAB API responses
 * Based on YNAB API v1 documentation: https://api.ynab.com
 */

/**
 * YNAB API response wrapper
 */
export interface YnabResponse<T> {
  data: T;
}

/**
 * Budget summary
 */
export interface BudgetSummary {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  date_format: {
    format: string;
  };
  currency_format: {
    iso_code: string;
    example_format: string;
    decimal_digits: number;
    decimal_separator: string;
    symbol_first: boolean;
    group_separator: string;
    currency_symbol: string;
    display_symbol: boolean;
  };
  accounts?: Account[];
  categories?: Category[];
  category_groups?: CategoryGroup[];
}

/**
 * Budget detail (full budget data)
 */
export interface BudgetDetail {
  budget: BudgetSummary;
  server_knowledge: number;
}

/**
 * Account
 */
export interface Account {
  id: string;
  name: string;
  type:
    | "checking"
    | "savings"
    | "cash"
    | "creditCard"
    | "lineOfCredit"
    | "otherAsset"
    | "otherLiability"
    | "mortgage"
    | "autoLoan"
    | "studentLoan"
    | "personalLoan"
    | "medicalDebt"
    | "otherDebt";
  on_budget: boolean;
  closed: boolean;
  note: string | null;
  balance: number; // in milliunits
  cleared_balance: number; // in milliunits
  uncleared_balance: number; // in milliunits
  transfer_payee_id: string;
  direct_import_linked: boolean;
  direct_import_in_error: boolean;
  deleted: boolean;
}

/**
 * Category Group
 */
export interface CategoryGroup {
  id: string;
  name: string;
  hidden: boolean;
  deleted: boolean;
  categories?: Category[];
}

/**
 * Category
 */
export interface Category {
  id: string;
  category_group_id: string;
  category_group_name?: string;
  name: string;
  hidden: boolean;
  original_category_group_id: string | null;
  note: string | null;
  budgeted: number; // in milliunits
  activity: number; // in milliunits
  balance: number; // in milliunits
  goal_type: "TB" | "TBD" | "MF" | "NEED" | "DEBT" | null;
  goal_day: number | null;
  goal_cadence: number | null;
  goal_cadence_frequency: number | null;
  goal_creation_month: string | null;
  goal_target: number | null; // in milliunits
  goal_target_month: string | null;
  goal_percentage_complete: number | null;
  goal_months_to_budget: number | null;
  goal_under_funded: number | null; // in milliunits
  goal_overall_funded: number | null; // in milliunits
  goal_overall_left: number | null; // in milliunits
  deleted: boolean;
}

/**
 * Month detail (categories for a specific month)
 */
export interface MonthDetail {
  month: string;
  note: string | null;
  income: number; // in milliunits
  budgeted: number; // in milliunits
  activity: number; // in milliunits
  to_be_budgeted: number; // in milliunits
  age_of_money: number | null;
  deleted: boolean;
  categories: Category[];
}

/**
 * Transaction
 */
export interface Transaction {
  id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  amount: number; // in milliunits
  memo: string | null;
  cleared: "cleared" | "uncleared" | "reconciled";
  approved: boolean;
  flag_color: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | null;
  flag_name: string | null;
  account_id: string;
  account_name: string;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  transfer_transaction_id: string | null;
  matched_transaction_id: string | null;
  import_id: string | null;
  import_payee_name: string | null;
  import_payee_name_original: string | null;
  debt_transaction_type: "payment" | "refund" | "fee" | "interest" | null;
  deleted: boolean;
  subtransactions: SubTransaction[];
}

/**
 * SubTransaction (split transaction)
 */
export interface SubTransaction {
  id: string;
  transaction_id: string;
  amount: number; // in milliunits
  memo: string | null;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  transfer_transaction_id: string | null;
  deleted: boolean;
}

/**
 * Transaction detail wrapper
 */
export interface TransactionDetail {
  transaction: Transaction;
}

/**
 * Transactions wrapper
 */
export interface TransactionsResponse {
  transactions: Transaction[];
  server_knowledge: number;
}

/**
 * Save transaction (request body for creating/updating)
 */
export interface SaveTransaction {
  account_id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  amount: number; // in milliunits
  payee_id?: string | null;
  payee_name?: string | null;
  category_id?: string | null;
  memo?: string | null;
  cleared?: "cleared" | "uncleared" | "reconciled";
  approved?: boolean;
  flag_color?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | null;
  import_id?: string | null;
  subtransactions?: SaveSubTransaction[];
}

/**
 * Save subtransaction
 */
export interface SaveSubTransaction {
  amount: number; // in milliunits
  payee_id?: string | null;
  payee_name?: string | null;
  category_id?: string | null;
  memo?: string | null;
}

/**
 * Save transactions wrapper (request body)
 */
export interface SaveTransactionsWrapper {
  transaction?: SaveTransaction;
  transactions?: SaveTransaction[];
}

/**
 * Save transactions response
 */
export interface SaveTransactionsResponse {
  transaction_ids: string[];
  transaction?: Transaction;
  transactions?: Transaction[];
  duplicate_import_ids?: string[];
  server_knowledge: number;
}

/**
 * Payee
 */
export interface Payee {
  id: string;
  name: string;
  transfer_account_id: string | null;
  deleted: boolean;
}

/**
 * Error response from YNAB API
 */
export interface YnabError {
  error: {
    id: string;
    name: string;
    detail: string;
  };
}
