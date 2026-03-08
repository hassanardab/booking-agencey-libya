// data/mockJournalEntries.ts
import { JournalEntry } from "@/types/accounting";

// Helper to create a Date relative to today
const today = new Date();
const todayAt = (hours: number, minutes = 0, seconds = 0) => {
  const d = new Date(today);
  d.setHours(hours, minutes, seconds, 0);
  return d;
};

// Mock account IDs
const ACCOUNTS = {
  CASH: { id: "acc_cash", name: "Cash" },
  AR: { id: "acc_ar", name: "Accounts Receivable" },
  UNEARNED_REV: { id: "acc_unearned", name: "Unearned Revenue" },
  REVENUE: { id: "acc_revenue", name: "Event Revenue" },
} as const;

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  // ===== Event 1: Corporate Gala (fully paid) =====
  {
    id: "je_1",
    companyId: "company-1",
    date: todayAt(14, 5),
    description: "Corporate Gala - Full payment received",
    receiptNumber: "RCPT-2024-001",
    source: "booking",
    referenceId: "1",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 2400,
        type: "debit",
        description: "Payment from Acme Corp",
      },
      {
        accountId: ACCOUNTS.REVENUE.id,
        accountName: ACCOUNTS.REVENUE.name,
        amount: 2400,
        type: "credit",
        description: "Revenue recognized for Corporate Gala",
      },
    ],
    metadata: { paymentMethod: "bank_transfer" },
    createdAt: todayAt(14, 5),
  },

  // ===== Event 2: Wedding Photography (partially paid) =====
  // Entry 2a: Deposit received 5 days before the event
  {
    id: "je_2a",
    companyId: "company-1",
    date: (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - 5);
      d.setHours(10, 0, 0, 0);
      return d;
    })(),
    description: "Wedding Photography - Deposit received",
    receiptNumber: "RCPT-2024-002",
    source: "booking",
    referenceId: "2",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 600,
        type: "debit",
        description: "Deposit from Sarah & John",
      },
      {
        accountId: ACCOUNTS.UNEARNED_REV.id,
        accountName: ACCOUNTS.UNEARNED_REV.name,
        amount: 600,
        type: "credit",
        description: "Unearned revenue – deposit",
      },
    ],
    metadata: { paymentMethod: "credit_card" },
    createdAt: (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - 5);
      d.setHours(10, 0, 0, 0);
      return d;
    })(),
  },

  // Entry 2b: Service rendered on event day – recognise revenue and remaining receivable
  {
    id: "je_2b",
    companyId: "company-1",
    date: todayAt(18, 0),
    description: "Wedding Photography - Service provided, invoice raised",
    receiptNumber: "INV-2024-002",
    source: "booking",
    referenceId: "2",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.AR.id,
        accountName: ACCOUNTS.AR.name,
        amount: 600,
        type: "debit",
        description: "Remaining balance due",
      },
      {
        accountId: ACCOUNTS.UNEARNED_REV.id,
        accountName: ACCOUNTS.UNEARNED_REV.name,
        amount: 600,
        type: "debit",
        description: "Deposit now earned",
      },
      {
        accountId: ACCOUNTS.REVENUE.id,
        accountName: ACCOUNTS.REVENUE.name,
        amount: 1200,
        type: "credit",
        description: "Total revenue for wedding photography",
      },
    ],
    metadata: {},
    createdAt: todayAt(18, 0),
  },

  // ===== Event 3: Product Launch (postponed, deposit taken) =====
  {
    id: "je_3",
    companyId: "company-1",
    date: new Date("2023-09-15T11:00:00Z"),
    description: "Product Launch - Deposit received (event postponed)",
    receiptNumber: "RCPT-2023-003",
    source: "booking",
    referenceId: "3",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 1000,
        type: "debit",
        description: "Deposit from TechFlow Inc",
      },
      {
        accountId: ACCOUNTS.UNEARNED_REV.id,
        accountName: ACCOUNTS.UNEARNED_REV.name,
        amount: 1000,
        type: "credit",
        description: "Unearned revenue – deposit for postponed event",
      },
    ],
    metadata: { paymentMethod: "credit_card" },
    createdAt: new Date("2023-09-15T11:00:00Z"),
  },
];
