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
    (journal) => journal.referenceId === eventId
  ).sort((a, b) => a.date.getTime() - b.date.getTime()); // optional: sort chronologically
}