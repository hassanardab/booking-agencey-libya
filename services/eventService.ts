//services/eventService.ts
import { MOCK_EVENTS } from "@/data/mockEvents";
import { BookingEvent } from "@/types/events";

/**
 * Get event by ID
 */
export function getEventById(id: string): BookingEvent | undefined {
  return MOCK_EVENTS.find((event) => event.id === id);
}

/**
 * Get all events
 */
export function getAllEvents(): BookingEvent[] {
  return MOCK_EVENTS;
}

/**
 * Get upcoming events
 */
export function getUpcomingEvents(): BookingEvent[] {
  return MOCK_EVENTS.filter(
    (e) => e.status === "confirmed" || e.status === "partially_paid",
  );
}

/**
 * Get postponed events
 */
export function getPostponedEvents(): BookingEvent[] {
  return MOCK_EVENTS.filter((e) => e.status === "postponed");
}
