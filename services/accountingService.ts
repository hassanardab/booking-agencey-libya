// services/accountingService.ts
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
