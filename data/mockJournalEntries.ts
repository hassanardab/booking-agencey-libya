import { JournalEntry } from "@/types/accounting";
import { ACCOUNTS } from "./mcokAccounts";

const today = new Date();
const todayAt = (hours: number) => {
  const d = new Date(today);
  d.setHours(hours, 0, 0, 0);
  return d;
};

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  // Event 1: Fully Paid
  {
    id: "je_1",
    companyId: "mamo-15",
    date: todayAt(14),
    description: "Full payment: Corporate Gala",
    receiptNumber: "RCPT-2026-001", // Added
    source: "booking",
    referenceId: "1",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 2400,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.EVENT_REVENUE.id,
        accountName: ACCOUNTS.EVENT_REVENUE.name,
        amount: 2400,
        type: "credit",
      },
    ],
    createdAt: todayAt(14),
  },

  // Event 2: Partial Payment
  {
    id: "je_2",
    companyId: "mamo-15",
    date: todayAt(17),
    description: "Partial payment: Wedding Photography",
    receiptNumber: "INV-2026-002", // Added
    source: "booking",
    referenceId: "2",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 600,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.AR.id,
        accountName: ACCOUNTS.AR.name,
        amount: 600,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.EVENT_REVENUE.id,
        accountName: ACCOUNTS.EVENT_REVENUE.name,
        amount: 1200,
        type: "credit",
      },
    ],
    createdAt: todayAt(17),
  },

  // Event 3: Postponed (Deposit)
  {
    id: "je_3",
    companyId: "mamo-15",
    date: todayAt(10),
    description: "Deposit for Postponed Product Launch",
    receiptNumber: "RCPT-2026-003", // Added
    source: "booking",
    referenceId: "3",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.CASH.id,
        accountName: ACCOUNTS.CASH.name,
        amount: 1000,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.UNEARNED_REVENUE.id,
        accountName: ACCOUNTS.UNEARNED_REVENUE.name,
        amount: 1000,
        type: "credit",
      },
    ],
    createdAt: todayAt(10),
  },

  // Event 4: This Week (Bank Transfer)
  {
    id: "je_4",
    companyId: "mamo-15",
    date: new Date(new Date().setDate(today.getDate() + 3)),
    description: "Bank Transfer: Networking Brunch",
    receiptNumber: "BANK-2026-004", // Added
    source: "booking",
    referenceId: "4",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.BANK.id,
        accountName: ACCOUNTS.BANK.name,
        amount: 1500,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.EVENT_REVENUE.id,
        accountName: ACCOUNTS.EVENT_REVENUE.name,
        amount: 1500,
        type: "credit",
      },
    ],
    createdAt: today,
  },

  // Event 5: This Month (Invoice Raised)
  {
    id: "je_5",
    companyId: "mamo-15",
    date: new Date(new Date().setDate(today.getDate() + 15)),
    description: "Invoice Raised: Fashion Show",
    receiptNumber: "INV-2026-005", // Added
    source: "booking",
    referenceId: "5",
    currency: "USD",
    transactions: [
      {
        accountId: ACCOUNTS.AR.id,
        accountName: ACCOUNTS.AR.name,
        amount: 5000,
        type: "debit",
      },
      {
        accountId: ACCOUNTS.EVENT_REVENUE.id,
        accountName: ACCOUNTS.EVENT_REVENUE.name,
        amount: 5000,
        type: "credit",
      },
    ],
    createdAt: today,
  },
];
