//types/accounting.ts

export interface Account {
  id: string;
  companyId: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Represents a single transaction line (a debit or a credit).
export interface Transaction {
  accountId: string;
  accountName?: string; // Denormalized for easier display
  amount: number;
  description?: string;
  type: "debit" | "credit";
}

// Represents a complete, balanced accounting entry in the journal.
export interface JournalEntry {
  id: string;
  companyId: string;
  date: Date;
  description: string;
  receiptNumber: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt?: Date;
  currency?: string;

  // Generic links to other parts of the system
  source: "booking" | "expense" | "payroll" | "other"; // The source module
  referenceId?: string; // The ID of the source entity (e.g., eventId, expenseId)
  clientId?: string;

  metadata?: {
    paymentMethod?: string;
    [key: string]: any;
  };
}

// Type for data passed to create/update functions
export type JournalEntryData = Omit<
  JournalEntry,
  "id" | "createdAt" | "updatedAt"
>;

// Payment methods array
export const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "mobile_payment", label: "Mobile Payment" },
  { value: "online", label: "Online" },
  { value: "other", label: "Other" },
];

export interface PaymentFormErrors {
  amount?: string;
  method?: string;
  date?: string;
  note?: string;
  currency?: string;
}
