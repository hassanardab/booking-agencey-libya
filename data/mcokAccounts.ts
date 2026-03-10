//data/mcokAccounts.ts
export const ACCOUNTS = {
  // ASSETS (1000-1999)
  CASH: { id: "1000", name: "Cash", type: "asset" },
  BANK: { id: "1010", name: "Bank Account", type: "asset" },
  AR: { id: "1100", name: "Accounts Receivable", type: "asset" },

  // LIABILITIES (2000-2999)
  UNEARNED_REVENUE: { id: "2100", name: "Unearned Revenue", type: "liability" },

  // REVENUE (4000-4999)
  EVENT_REVENUE: { id: "4000", name: "Event Revenue", type: "revenue" },

  // EXPENSES (5000-5999)
  SOFTWARE_EXPENSE: { id: "5200", name: "Software Expense", type: "expense" },
} as const;
