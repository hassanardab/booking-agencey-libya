// services/accountingService.ts
import { ACCOUNTS } from "@/data/mcokAccounts";
import { MOCK_JOURNAL_ENTRIES } from "@/data/mockJournalEntries";
import { JournalEntry } from "@/types/accounting";

/**
 * Get a journal entry by its ID
 */
export function getJournalById(id: string): JournalEntry | undefined {
  return MOCK_JOURNAL_ENTRIES.find((journal) => journal.id === id);
}

/**
 * Get all journal entries for a specific event (by its referenceId)
 */
export function getAllJournalsForEvent(eventId: string): JournalEntry[] {
  return MOCK_JOURNAL_ENTRIES.filter(
    (journal) => journal.referenceId === eventId,
  ).sort((a, b) => a.date.getTime() - b.date.getTime()); // optional: sort chronologically
}

/**
 * Add a new payment transaction
 */
export function addJournalEntry(entry: JournalEntry): JournalEntry {
  MOCK_JOURNAL_ENTRIES.push(entry);
  return entry;
}

/**
 * Delete a payment transaction
 */
export function deleteJournalEntry(id: string): boolean {
  const index = MOCK_JOURNAL_ENTRIES.findIndex((journal) => journal.id === id);
  if (index !== -1) {
    MOCK_JOURNAL_ENTRIES.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Standardizes calculation of actual money received (Cash/Bank Debits)
 * for a specific event.
 */
export function getPaidAmountForEvent(eventId: string): number {
  const journals = MOCK_JOURNAL_ENTRIES.filter(
    (j) => j.referenceId === eventId,
  );

  return journals.reduce((total, journal) => {
    return (
      total +
      journal.transactions.reduce((sum, t) => {
        // 1. Identify "Real Money" accounts only
        const isLiquidMoney =
          t.accountId === ACCOUNTS.CASH.id || t.accountId === ACCOUNTS.BANK.id;

        // 2. Only sum if it's a Debit (increase) to a liquid money account
        // We ignore ACCOUNTS.AR.id because that's just a tracking balance.
        return t.type === "debit" && isLiquidMoney ? sum + t.amount : sum;
      }, 0)
    );
  }, 0);
}
/**
 * Updates an existing journal entry
 */
export function updateJournalEntry(
  id: string,
  updatedData: Partial<JournalEntry>,
): boolean {
  const index = MOCK_JOURNAL_ENTRIES.findIndex((j) => j.id === id);
  if (index !== -1) {
    MOCK_JOURNAL_ENTRIES[index] = {
      ...MOCK_JOURNAL_ENTRIES[index],
      ...updatedData,
    };
    return true;
  }
  return false;
}
